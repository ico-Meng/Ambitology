"""
Job listing cache handler — multi-mode Lambda for scheduled job cache refresh.

Architecture
============
Three execution modes, all served by the same Lambda function:

ORCHESTRATOR (default / EventBridge-triggered)
    Phase 1 — Fetch job listings from JSearch API (sequential, ~1 min).
    Phase 2 — Fan-out: invoke one async Lambda worker per job category
              (7 parallel workers, each a separate Lambda invocation).
    Phase 3 — Wait for workers to finish, then delete stale DynamoDB items.

WORKER (invoked asynchronously by the orchestrator)
    For each position in the assigned category, run a three-tier waterfall
    search using the OpenAI Responses API with ``web_search_preview``:
        Tier 1 — Company official career pages
        Tier 2 — Indeed  (only if Tier 1 yielded < 5 total results)
        Tier 3 — LinkedIn (only if Tier 2 still yielded < 5 total results)
    Every job must include a posting URL. Missing URLs trigger a dedicated
    resolution search (official -> Indeed -> LinkedIn).
    If a position has < 10 total results after all tiers, a broad supplemental
    search fills the gap.

Timeout strategy
================
- Lambda timeout: 900 s (15 min, the AWS maximum).
- The orchestrator uses ~1 min for JSearch, up to ~8 min waiting for workers,
  and ~2 min for stale cleanup.
- Each worker processes one category (~7-11 positions) using ``asyncio`` with
  a concurrency semaphore of 5 for OpenAI calls.  Worst case ~5 min/worker.
- Workers check remaining execution time before starting each new position
  and stop early if < 90 s remain, guaranteeing graceful shutdown.
- All 7 category workers run in parallel as separate Lambda invocations,
  giving the system an effective throughput of ~35 concurrent OpenAI calls.
"""

import asyncio
import boto3
import hashlib
import json
import os
import time
import logging
from datetime import datetime, timezone

import requests
from boto3.dynamodb.conditions import Key, Attr

try:
    import openai
except ImportError:
    openai = None

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# ---------------------------------------------------------------------------
# Environment variables
# ---------------------------------------------------------------------------
JSEARCH_API_KEY = os.environ.get("JSEARCH_API_KEY", "")
JSEARCH_APP_NAME = os.environ.get("JSEARCH_APP_NAME", "")
OPENAI_API_KEY = os.environ.get("OPENAI_APIKEY", "")
TABLE_NAME = "jobCache"
JSEARCH_BASE_URL = "https://jsearch.p.rapidapi.com/search"

# ---------------------------------------------------------------------------
# Target companies for OpenAI waterfall search
# ---------------------------------------------------------------------------
TARGET_COMPANIES = [
    "Nvidia", "Microsoft", "Salesforce", "Adobe", "Databricks", "OpenAI",
    "Anthropic", "Jane Street", "Hudson River Trading", "JPMorganChase",
    "Google", "Apple", "Meta", "Amazon", "Snowflake", "Stripe", "Oracle",
    "xAI", "Perplexity", "Clean", "Harvey", "CoreWeave", "Waymo",
    "Citadel Securities", "IMC Trading", "Optiver", "Two Sigma",
    "Tower Research Capital", "Goldman Sachs", "Capital One",
    "American Express", "Bloomberg", "Jump Trading", "Uber", "Airbnb",
    "Netflix",
]

# ---------------------------------------------------------------------------
# Waterfall search configuration
# ---------------------------------------------------------------------------
MAX_JOBS_PER_COMPANY = 3           # Up to 3 job titles per company per position
MIN_JOBS_BEFORE_NEXT_TIER = 5     # Fall through to next source when total < 5
MIN_JOBS_PER_TYPE = 10            # Target at least 10 jobs per position overall
COMPANIES_PER_PROMPT = 5          # Companies batched into one OpenAI prompt
WORKER_CONCURRENCY = 5            # Max concurrent OpenAI calls per worker
WORKER_SAFETY_BUFFER_MS = 90_000  # Stop processing 90 s before timeout
ORCHESTRATOR_WAIT_BUDGET_S = 480  # Wait up to 8 min for workers to finish
ORCHESTRATOR_CLEANUP_BUFFER_S = 120  # Reserve 2 min for stale cleanup

# ---------------------------------------------------------------------------
# Job categories and positions
#
# "AI engineer" appears in both Software Engineering and AI & ML intentionally.
# Each category is handled by a separate worker so both get results stored
# under their own job_type partition key.
# ---------------------------------------------------------------------------
JOB_CATEGORIES = {
    "Software Engineering": [
        "full stack engineer",
        "frontend engineer",
        "backend engineer",
        "cloud computing engineer",
        "platform engineer",
        "AI engineer",
        "Distributed System Engineer",
        "Site Reliability Engineer",
        "mobile engineer",
        "infrastructure engineer",
        "low latency engineer",
    ],
    "AI & Machine Learning": [
        "Machine learning engineer",
        "AI engineer",
        "deep learning engineer",
        "machine learning scientist",
        "AI research scientist",
        "generative AI engineer",
        "LLM engineer",
        "MLOps engineer",
        "AI platform engineer",
    ],
    "Data Engineering": [
        "data engineer",
        "data platform engineer",
        "data pipeline engineer",
        "ETL engineer",
        "streaming data engineer",
        "data warehouse engineer",
        "data infrastructure engineer",
    ],
    "Data Science": [
        "data scientist",
        "applied scientist",
        "research scientist",
        "data analyst",
        "decision scientist",
        "ML scientist",
    ],
    "UI/UX & Product Design": [
        "product designer",
        "ux designer",
        "ui designer",
        "interaction designer",
        "visual designer",
        "design system designer",
    ],
    "Financial Engineering": [
        "quant researcher",
        "quant developer",
        "financial engineer",
        "trading engineer",
        "financial data scientist",
        "modeling engineer",
    ],
    "Cybersecurity": [
        "security engineer",
        "application security engineer",
        "cloud security engineer",
        "security architect",
        "IAM engineer",
        "GRC analyst",
    ],
}

# ---------------------------------------------------------------------------
# DynamoDB resource (shared across all handler modes)
# ---------------------------------------------------------------------------
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)


# =========================================================================
# Helpers
# =========================================================================

def normalize_position_name(name: str) -> str:
    """Convert a position name to a consistent lowercase_underscore key."""
    return name.strip().lower().replace(" ", "_").replace("/", "_").replace("&", "and")


def generate_openai_job_id(company_name: str, job_title: str, job_url: str) -> str:
    """Deterministic MD5-based job ID prefixed with ``oa_``."""
    raw = f"{company_name.lower()}|{job_title.lower()}|{job_url}"
    return "oa_" + hashlib.md5(raw.encode()).hexdigest()[:16]


def _is_valid_url(url: str) -> bool:
    """Minimal URL validation — must start with http(s)."""
    return bool(url) and url.startswith(("http://", "https://"))


def _extract_openai_text(response) -> str:
    """Extract assistant text from an OpenAI Responses API result."""
    parts = []
    for item in response.output:
        if getattr(item, "type", None) == "message":
            for block in getattr(item, "content", []):
                if getattr(block, "type", None) == "output_text":
                    parts.append(block.text)
    return "".join(parts).strip()


def _strip_fences(text: str) -> str:
    """Remove optional markdown code fences (``````json ... ``````)."""
    text = text.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        end = -1 if lines[-1].strip() == "```" else len(lines)
        text = "\n".join(lines[1:end])
    return text


def _parse_json_array(text: str) -> list:
    """Parse a JSON array from OpenAI text, stripping markdown fences."""
    data = json.loads(_strip_fences(text))
    return data if isinstance(data, list) else []


def _parse_json_object(text: str) -> dict:
    """Parse a JSON object from OpenAI text, stripping markdown fences."""
    data = json.loads(_strip_fences(text))
    return data if isinstance(data, dict) else {}


# =========================================================================
# JSearch fetcher (unchanged)
# =========================================================================

def fetch_jobs_for_query(query: str, max_pages: int = 2) -> list:
    """
    Fetch job listings from JSearch for a given query string.
    Fetches up to *max_pages* pages (10 results each).
    Returns a list of dicts: {job_id, job_title, company_name, job_url, is_direct_apply}.
    """
    headers = {
        "X-RapidAPI-Key": JSEARCH_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    }
    all_jobs = []
    seen_ids = set()

    for page in range(1, max_pages + 1):
        try:
            params = {
                "query": query,
                "page": str(page),
                "num_pages": "1",
                "employment_types": "FULLTIME",
                "date_posted": "all",
            }
            response = requests.get(
                JSEARCH_BASE_URL, headers=headers, params=params, timeout=15,
            )
            response.raise_for_status()
            jobs_raw = response.json().get("data", [])

            if not jobs_raw:
                logger.info(f"No results on page {page} for '{query}', stopping early.")
                break

            for job in jobs_raw:
                job_id = job.get("job_id", "")
                company = (job.get("employer_name") or "").strip()
                title = (job.get("job_title") or "").strip()
                url = (job.get("job_apply_link") or "").strip()

                if not (job_id and company and title and url):
                    continue
                if job_id in seen_ids:
                    continue

                seen_ids.add(job_id)
                all_jobs.append({
                    "job_id": job_id,
                    "job_title": title,
                    "company_name": company,
                    "job_url": url,
                    "is_direct_apply": bool(job.get("job_apply_is_direct", False)),
                })

            logger.info(
                f"Page {page} for '{query}': fetched {len(jobs_raw)} raw, "
                f"kept {len(all_jobs)} total so far."
            )
            time.sleep(0.5)  # Respect rate limit between pages

        except requests.HTTPError as e:
            logger.error(f"HTTP error on page {page} for '{query}': {e}")
            break
        except Exception as e:
            logger.error(f"Unexpected error on page {page} for '{query}': {e}")
            break

    return all_jobs


# =========================================================================
# DynamoDB operations
# =========================================================================

def write_jobs_to_dynamo(job_type: str, position_name: str, jobs: list, batch_id: str) -> int:
    """
    Batch-write job items into the jobCache table.
    SK format: ``{normalized_position_name}#{job_id}``
    Returns the number of items written.
    """
    normalized_pos = normalize_position_name(position_name)

    with table.batch_writer() as batch:
        for job in jobs:
            item = {
                "job_type":        job_type,
                "sk":              f"{normalized_pos}#{job['job_id']}",
                "company_name":    job["company_name"],
                "position_name":   normalized_pos,
                "job_title":       job["job_title"],
                "job_url":         job["job_url"],
                "is_direct_apply": job.get("is_direct_apply", True),
                "batch_id":        batch_id,
            }
            if job.get("source"):
                item["source"] = job["source"]
            batch.put_item(Item=item)

    logger.info(f"Wrote {len(jobs)} items — job_type='{job_type}', position='{position_name}'")
    return len(jobs)


def delete_stale_items(job_type: str, current_batch_id: str):
    """
    Remove all items for a *job_type* whose batch_id differs from the current
    run.  Called after all writes are complete to ensure safe atomic swap.
    Handles DynamoDB pagination for large result sets.
    """
    stale_keys = []
    last_key = None

    while True:
        kwargs = {
            "KeyConditionExpression": Key("job_type").eq(job_type),
            "FilterExpression": Attr("batch_id").ne(current_batch_id),
            "ProjectionExpression": "job_type, sk",
        }
        if last_key:
            kwargs["ExclusiveStartKey"] = last_key

        resp = table.query(**kwargs)
        stale_keys.extend(resp.get("Items", []))
        last_key = resp.get("LastEvaluatedKey")
        if not last_key:
            break

    if not stale_keys:
        logger.info(f"No stale items to delete for job_type='{job_type}'")
        return

    with table.batch_writer() as batch:
        for key in stale_keys:
            batch.delete_item(Key={"job_type": key["job_type"], "sk": key["sk"]})

    logger.info(f"Deleted {len(stale_keys)} stale items for job_type='{job_type}'")


# =========================================================================
# OpenAI waterfall search (async)
# =========================================================================

_TIER_INSTRUCTIONS = {
    "official": (
        "Search each company's OFFICIAL careers/jobs website (e.g., "
        "careers.google.com, jobs.lever.co/company, boards.greenhouse.io, "
        "myworkdayjobs.com, etc.). "
        "Job URLs MUST come from the company's own career domain or their "
        "ATS platform (Lever, Greenhouse, Workday, iCIMS, etc.)."
    ),
    "indeed": (
        "Search Indeed.com (indeed.com) for these job postings. "
        "Job URLs MUST be from the indeed.com domain."
    ),
    "linkedin": (
        "Search LinkedIn Jobs (linkedin.com/jobs) for these job postings. "
        "Job URLs MUST be from the linkedin.com domain."
    ),
}


async def _search_tier_batch(client, position_name, companies, tier):
    """
    Ask OpenAI to find open jobs for *position_name* at *companies* using a
    specific search source (*tier*).

    Returns ``{company_name: [{job_title, company_name, job_url, source}, ...]}``.
    """
    instruction = _TIER_INSTRUCTIONS.get(tier, _TIER_INSTRUCTIONS["official"])
    companies_str = ", ".join(companies)

    prompt = (
        f'Search for currently open "{position_name}" job positions.\n'
        f"{instruction}\n\n"
        f"Target companies: {companies_str}\n\n"
        f"For each company, find up to {MAX_JOBS_PER_COMPANY} distinct, "
        f"currently open job listings.\n\n"
        "Return a JSON array. Each element must have exactly these keys:\n"
        '  "job_title"    — the exact title shown in the job posting\n'
        '  "company_name" — must be one of the target companies above\n'
        '  "job_url"      — direct URL to the job posting page\n'
        f'  "source"       — "{tier}"\n\n'
        "Rules:\n"
        "- Only include verifiably open positions with real, clickable URLs.\n"
        "- Do NOT fabricate or guess URLs.\n"
        "- If no jobs found for a company, simply omit that company.\n"
        "- Return ONLY a valid JSON array — no markdown fences, no prose."
    )

    try:
        response = await client.responses.create(
            model="gpt-4o-mini",
            tools=[{"type": "web_search_preview"}],
            input=prompt,
        )
        text = _extract_openai_text(response)
        if not text:
            return {}

        raw_jobs = _parse_json_array(text)
        grouped = {}
        for job in raw_jobs:
            title   = (job.get("job_title")    or "").strip()
            company = (job.get("company_name") or "").strip()
            url     = (job.get("job_url")      or "").strip()

            if not (title and company):
                continue

            grouped.setdefault(company, [])
            if len(grouped[company]) < MAX_JOBS_PER_COMPANY:
                grouped[company].append({
                    "job_title": title,
                    "company_name": company,
                    "job_url": url if _is_valid_url(url) else "",
                    "source": tier,
                })
        return grouped

    except json.JSONDecodeError as exc:
        logger.error(f"JSON parse error ({tier}, '{position_name}'): {exc}")
        return {}
    except Exception as exc:
        logger.error(f"OpenAI error ({tier}, '{position_name}'): {exc}")
        return {}


async def _resolve_missing_url(client, job_title, company_name):
    """
    Find a posting URL for a job that is missing one.
    Search order: company official site -> Indeed -> LinkedIn.
    """
    prompt = (
        f'Find the job posting URL for: "{job_title}" at {company_name}.\n\n'
        "Search in this priority order:\n"
        f"1. {company_name}'s official careers page\n"
        "2. indeed.com\n"
        "3. linkedin.com/jobs\n\n"
        "Return a JSON object with exactly:\n"
        '  "job_url" — the direct URL to the posting\n'
        '  "source"  — "official", "indeed", or "linkedin"\n\n'
        'If no URL can be found at all, return: {"job_url": "", "source": "none"}\n'
        "Return ONLY valid JSON — no markdown fences, no explanation."
    )
    try:
        response = await client.responses.create(
            model="gpt-4o-mini",
            tools=[{"type": "web_search_preview"}],
            input=prompt,
        )
        text = _extract_openai_text(response)
        if not text:
            return ""
        result = _parse_json_object(text)
        url = (result.get("job_url") or "").strip()
        return url if _is_valid_url(url) else ""
    except Exception as exc:
        logger.error(f"URL resolve error ('{job_title}' @ {company_name}): {exc}")
        return ""


async def _broad_supplemental_search(client, position_name, needed, semaphore):
    """
    Broad search (no company restriction) when target companies don't
    yield MIN_JOBS_PER_TYPE results for a position.
    """
    prompt = (
        f'Search for {needed} currently open "{position_name}" job positions '
        "at any reputable technology, finance, or consulting company.\n\n"
        "Return a JSON array. Each element:\n"
        '  "job_title"    — exact title from the posting\n'
        '  "company_name" — the hiring company\n'
        '  "job_url"      — direct URL to the posting\n'
        '  "source"       — "supplemental"\n\n'
        "Rules:\n"
        "- Only include real, currently open positions with valid URLs.\n"
        "- Return ONLY a valid JSON array — no markdown, no explanation."
    )
    async with semaphore:
        try:
            response = await client.responses.create(
                model="gpt-4o-mini",
                tools=[{"type": "web_search_preview"}],
                input=prompt,
            )
            text = _extract_openai_text(response)
            if not text:
                return []
            raw = _parse_json_array(text)
            jobs = []
            for item in raw[:needed]:
                t = (item.get("job_title")    or "").strip()
                c = (item.get("company_name") or "").strip()
                u = (item.get("job_url")      or "").strip()
                if t and c and _is_valid_url(u):
                    jobs.append({
                        "job_title": t,
                        "company_name": c,
                        "job_url": u,
                        "source": "supplemental",
                    })
            return jobs
        except Exception as exc:
            logger.error(f"Supplemental search error ('{position_name}'): {exc}")
            return []


async def waterfall_search_for_position(client, position_name, companies, semaphore):
    """
    Three-tier waterfall search for one position across all target companies.

    Tier 1 — company official websites  (always runs for all companies)
    Tier 2 — Indeed   (runs for companies still below MAX_JOBS_PER_COMPANY
                       when Tier 1 total < MIN_JOBS_BEFORE_NEXT_TIER)
    Tier 3 — LinkedIn (same trigger condition after Tiers 1+2)

    After all tiers:
      - Resolves missing URLs via a dedicated search per job.
      - If total valid results < MIN_JOBS_PER_TYPE, runs a broad supplemental
        search to fill the gap.

    Returns a list of DynamoDB-ready job dicts.
    """
    company_jobs = {c: [] for c in companies}

    async def _run_tier(tier, target_companies):
        """Run one search tier across company batches; return count added."""
        batches = [
            target_companies[i:i + COMPANIES_PER_PROMPT]
            for i in range(0, len(target_companies), COMPANIES_PER_PROMPT)
        ]

        async def _fetch(batch):
            async with semaphore:
                return await _search_tier_batch(client, position_name, batch, tier)

        results = await asyncio.gather(
            *[_fetch(b) for b in batches], return_exceptions=True,
        )

        added = 0
        for result in results:
            if isinstance(result, Exception):
                logger.error(f"Tier '{tier}' batch error for '{position_name}': {result}")
                continue
            for company, jobs in result.items():
                if company not in company_jobs:
                    company_jobs[company] = []
                remaining = MAX_JOBS_PER_COMPANY - len(company_jobs[company])
                new = jobs[:remaining]
                company_jobs[company].extend(new)
                added += len(new)
        return added

    # --- Tier 1: Official company websites (always runs) ---
    total = await _run_tier("official", companies)
    logger.info(f"[{position_name}] Tier 1 (official): {total} jobs")

    # --- Tier 2: Indeed (when official-site results are sparse) ---
    if total < MIN_JOBS_BEFORE_NEXT_TIER:
        need_more = [c for c in companies if len(company_jobs[c]) < MAX_JOBS_PER_COMPANY]
        if need_more:
            added = await _run_tier("indeed", need_more)
            total += added
            logger.info(f"[{position_name}] Tier 2 (indeed): +{added} -> {total} total")

    # --- Tier 3: LinkedIn (when Indeed still didn't fill the gap) ---
    if total < MIN_JOBS_BEFORE_NEXT_TIER:
        need_more = [c for c in companies if len(company_jobs[c]) < MAX_JOBS_PER_COMPANY]
        if need_more:
            added = await _run_tier("linkedin", need_more)
            total += added
            logger.info(f"[{position_name}] Tier 3 (linkedin): +{added} -> {total} total")

    # --- Flatten all company results ---
    flat = []
    for jobs in company_jobs.values():
        flat.extend(jobs)

    # --- Resolve missing URLs ---
    missing = [j for j in flat if not _is_valid_url(j.get("job_url", ""))]
    if missing:
        logger.info(f"[{position_name}] Resolving {len(missing)} missing URLs")

        async def _resolve(job):
            async with semaphore:
                url = await _resolve_missing_url(
                    client, job["job_title"], job["company_name"],
                )
                if url:
                    job["job_url"] = url

        await asyncio.gather(*[_resolve(j) for j in missing], return_exceptions=True)

    # Keep only jobs with valid URLs
    valid = [j for j in flat if _is_valid_url(j.get("job_url", ""))]

    # --- Supplemental search if below minimum ---
    if len(valid) < MIN_JOBS_PER_TYPE:
        shortfall = MIN_JOBS_PER_TYPE - len(valid)
        logger.info(
            f"[{position_name}] {len(valid)} jobs < {MIN_JOBS_PER_TYPE}; "
            f"supplementing +{shortfall}"
        )
        extra = await _broad_supplemental_search(
            client, position_name, shortfall, semaphore,
        )
        valid.extend(extra)

    # --- Deduplicate and format for DynamoDB ---
    dynamo_jobs = []
    seen = set()
    for job in valid:
        jid = generate_openai_job_id(job["company_name"], job["job_title"], job["job_url"])
        if jid in seen:
            continue
        seen.add(jid)
        dynamo_jobs.append({
            "job_id": jid,
            "job_title": job["job_title"],
            "company_name": job["company_name"],
            "job_url": job["job_url"],
            "is_direct_apply": True,
            "source": job.get("source", "unknown"),
        })

    logger.info(f"[{position_name}] Final: {len(dynamo_jobs)} unique jobs with URLs")
    return dynamo_jobs


# =========================================================================
# Worker: async processing loop for one job category
# =========================================================================

async def _process_category(job_type, positions, companies, batch_id, context):
    """
    Async entry point for a worker Lambda invocation.  Processes all
    *positions* in one *job_type* using waterfall search across *companies*.
    """
    if openai is None or not OPENAI_API_KEY:
        logger.error("OpenAI not available — worker exiting")
        return {"job_type": job_type, "status": "skipped", "jobs_written": 0}

    client = openai.AsyncOpenAI(api_key=OPENAI_API_KEY)
    semaphore = asyncio.Semaphore(WORKER_CONCURRENCY)

    total_written = 0
    failed = []

    for position_name in positions:
        # Safety: check remaining Lambda execution time before each position
        remaining_ms = context.get_remaining_time_in_millis() if context else 900_000
        if remaining_ms < WORKER_SAFETY_BUFFER_MS:
            logger.warning(
                f"Worker '{job_type}': only {remaining_ms}ms left — "
                f"stopping before '{position_name}'"
            )
            break

        try:
            jobs = await waterfall_search_for_position(
                client, position_name, companies, semaphore,
            )
            if jobs:
                count = write_jobs_to_dynamo(job_type, position_name, jobs, batch_id)
                total_written += count
            else:
                logger.warning(f"[{job_type}] No results for '{position_name}'")
        except Exception as exc:
            logger.error(f"Worker error ({job_type}/{position_name}): {exc}")
            failed.append(position_name)

    return {
        "job_type": job_type,
        "status": "success" if not failed else "partial",
        "jobs_written": total_written,
        "failed_positions": failed,
    }


# =========================================================================
# Handler modes
# =========================================================================

def _orchestrator_handler(event, context):
    """
    Full cache refresh orchestrator.

    Phase 1 — JSearch (sequential, ~1 min)
    Phase 2 — Fan-out OpenAI workers (one per category, async invocation)
    Phase 3 — Wait for workers, then delete stale DynamoDB items
    """
    batch_id = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    logger.info(f"Orchestrator started — batch_id={batch_id}")

    # ------------------------------------------------------------------
    # Phase 1: Fetch from JSearch and write new data
    # Duplicate API queries (same position across categories) are served
    # from an in-memory cache.
    # ------------------------------------------------------------------
    api_cache = {}
    total_written = 0
    failed_positions = []

    for job_type, positions in JOB_CATEGORIES.items():
        logger.info(f"--- JSearch: '{job_type}' ({len(positions)} positions) ---")

        for position_name in positions:
            cache_key = normalize_position_name(position_name)

            if cache_key not in api_cache:
                logger.info(f"JSearch API call: '{position_name}'")
                jobs = fetch_jobs_for_query(position_name, max_pages=2)
                api_cache[cache_key] = jobs
                time.sleep(0.3)  # Gentle rate limiting
            else:
                logger.info(
                    f"JSearch cache hit: '{position_name}' "
                    f"(reusing {len(api_cache[cache_key])} results)"
                )
                jobs = api_cache[cache_key]

            if not jobs:
                logger.warning(f"No JSearch jobs for '{position_name}' — skipping write.")
                continue

            try:
                count = write_jobs_to_dynamo(job_type, position_name, jobs, batch_id)
                total_written += count
            except Exception as e:
                logger.error(f"DynamoDB write failed ({job_type}/{position_name}): {e}")
                failed_positions.append(f"{job_type}/{position_name}")

    logger.info(f"Phase 1 complete — {total_written} JSearch items written")

    # ------------------------------------------------------------------
    # Phase 2: Fan out one async Lambda worker per job category.
    #
    # Each worker receives the full TARGET_COMPANIES list and its
    # category's positions. Workers run the three-tier waterfall search
    # (official -> Indeed -> LinkedIn) using asyncio for concurrency
    # and write results directly to DynamoDB with the same batch_id.
    # ------------------------------------------------------------------
    lambda_client = boto3.client("lambda")
    function_name = os.environ.get("AWS_LAMBDA_FUNCTION_NAME", "job_listing_cache")
    worker_count = 0

    for job_type, positions in JOB_CATEGORIES.items():
        payload = {
            "mode": "worker",
            "batch_id": batch_id,
            "job_type": job_type,
            "positions": positions,
            "companies": TARGET_COMPANIES,
        }
        try:
            lambda_client.invoke(
                FunctionName=function_name,
                InvocationType="Event",  # Async fire-and-forget
                Payload=json.dumps(payload),
            )
            worker_count += 1
            logger.info(f"Launched worker for '{job_type}'")
        except Exception as e:
            logger.error(f"Failed to launch worker for '{job_type}': {e}")

    logger.info(f"Phase 2: launched {worker_count} workers")

    # ------------------------------------------------------------------
    # Wait for workers to complete before cleanup.
    #
    # Workers write items with the current batch_id. The subsequent
    # cleanup only deletes items with a *different* batch_id, so items
    # from late-finishing workers are never accidentally removed.
    # ------------------------------------------------------------------
    remaining_s = (context.get_remaining_time_in_millis() / 1000) if context else 600
    wait_s = max(0, min(ORCHESTRATOR_WAIT_BUDGET_S, remaining_s - ORCHESTRATOR_CLEANUP_BUFFER_S))
    logger.info(f"Waiting {wait_s:.0f}s for workers ({remaining_s:.0f}s remaining)...")
    time.sleep(wait_s)

    # ------------------------------------------------------------------
    # Phase 3: Delete stale data from previous batch
    # ------------------------------------------------------------------
    logger.info("Phase 3: deleting stale items from previous batch...")
    for job_type in JOB_CATEGORIES:
        try:
            delete_stale_items(job_type, batch_id)
        except Exception as e:
            logger.error(f"Stale item deletion failed for '{job_type}': {e}")

    result = {
        "status": "success" if not failed_positions else "partial",
        "batch_id": batch_id,
        "jsearch_items_written": total_written,
        "jsearch_unique_api_calls": len(api_cache),
        "workers_launched": worker_count,
        "failed_positions": failed_positions,
    }
    logger.info(f"Orchestrator complete: {result}")
    return result


def _worker_handler(event, context):
    """Process one category's positions via OpenAI waterfall search."""
    batch_id = event["batch_id"]
    job_type = event["job_type"]
    positions = event["positions"]
    companies = event["companies"]

    logger.info(
        f"Worker started — job_type='{job_type}', "
        f"{len(positions)} positions, {len(companies)} companies"
    )

    result = asyncio.run(
        _process_category(job_type, positions, companies, batch_id, context)
    )

    logger.info(f"Worker complete: {result}")
    return result


# =========================================================================
# Lambda entry point
# =========================================================================

def lambda_handler(event, context):
    """
    Dispatch to the correct handler based on ``event['mode']``.

    Modes
    -----
    orchestrator (default)
        Full cache refresh: JSearch + fan-out workers + stale cleanup.
    worker
        Process one job category with OpenAI three-tier waterfall search.

    Invoked by EventBridge schedule (1st and 15th of each month at 03:00 UTC)
    or manually via the AWS console / CLI.
    """
    mode = event.get("mode", "orchestrator") if isinstance(event, dict) else "orchestrator"

    if mode == "worker":
        return _worker_handler(event, context)
    return _orchestrator_handler(event, context)
