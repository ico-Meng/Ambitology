'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { userManager } from '@/types';
import type { User } from 'oidc-client-ts';
import AIChatbox from '@/app/dashboard/AIChatbox';
import { API_ENDPOINT } from '@/app/components/config';

const SUGGESTION_SHOWN_KEY = 'ambitology_chatbox_suggestion_shown';

export default function GlobalChatbox() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [autoShowSuggestions, setAutoShowSuggestions] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navTo = (target: string) => () => router.push(`/dashboard?nav=${target}`);

  useEffect(() => {
    if (pathname?.startsWith('/dashboard')) return;

    let cancelled = false;

    userManager.getUser().then((u) => {
      if (!cancelled) setUser(u && !u.expired ? u : null);
    }).catch(() => {});

    const onLoaded = (u: User | null) => { if (!cancelled) setUser(u); };
    const onUnloaded = () => { if (!cancelled) setUser(null); };
    userManager.events.addUserLoaded(onLoaded);
    userManager.events.addUserUnloaded(onUnloaded);

    return () => {
      cancelled = true;
      userManager.events.removeUserLoaded(onLoaded);
      userManager.events.removeUserUnloaded(onUnloaded);
    };
  }, [pathname]);

  // Auto-show chat suggestions once after 5 seconds on non-dashboard pages
  useEffect(() => {
    if (pathname?.startsWith('/dashboard')) return;

    try {
      if (sessionStorage.getItem(SUGGESTION_SHOWN_KEY)) return;
    } catch { /* SSR / private browsing guard */ }

    timerRef.current = setTimeout(() => {
      try {
        if (sessionStorage.getItem(SUGGESTION_SHOWN_KEY)) return;
        sessionStorage.setItem(SUGGESTION_SHOWN_KEY, '1');
      } catch {}
      setAutoShowSuggestions(true);
    }, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Dashboard has its own full-featured chatbox — don't double-render
  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <AIChatbox
      apiEndpoint={API_ENDPOINT}
      cognitoSub={user?.profile?.sub}
      userEmail={user?.profile?.email as string | undefined}
      userName={user?.profile?.name as string | undefined}
      sidebarWidth={0}
      pageContext={{ section: pathname ?? 'landing' }}
      autoShowSuggestions={autoShowSuggestions}
      onNavigateToExistingResume={navTo('resume-existing')}
      onNavigateToExistingResumeAndFocusJob={navTo('resume-existing-focus-job')}
      onNavigateToKnowledgeBaseResume={navTo('resume-kb')}
      onNavigateToEstablishedPersonalProject={navTo('knowledge-established')}
      onNavigateToExpandingPersonalProject={navTo('knowledge-expanding')}
      onNavigateToEstablishedProfessionalProject={navTo('knowledge-established')}
      onNavigateToExpandingProfessionalProject={navTo('knowledge-expanding')}
      onNavigateToProfessionalStep={navTo('profile-professional')}
      onNavigateToCareerFocus={navTo('profile-career-focus')}
      onNavigateToJobAnalysis={navTo('analysis')}
      onShowPricing={navTo('pricing')}
    />
  );
}
