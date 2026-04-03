export interface AnonData {
  id: string;
  craftCount: number;
  analysisCount: number;
  downloadCount: number;
  autoFillCount: number;
  fingerprint: string;
}

const ANON_STORAGE_KEY = 'ambitology_anon_v1';
export const ANON_FREE_LIMIT = 2;

function getAnonFingerprint(): string {
  try {
    return btoa([
      navigator.userAgent.substring(0, 50),
      `${screen.width}x${screen.height}`,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.language,
    ].join('|')).replace(/[+/=]/g, '').substring(0, 24);
  } catch {
    return 'unknown';
  }
}

export function getOrCreateAnonData(): AnonData {
  try {
    const stored = localStorage.getItem(ANON_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AnonData;
      if (parsed && typeof parsed.id === 'string') {
        if (parsed.downloadCount === undefined) parsed.downloadCount = 0;
        if (parsed.autoFillCount === undefined) parsed.autoFillCount = 0;
        return parsed;
      }
    }
  } catch {}

  const newData: AnonData = {
    id: crypto.randomUUID(),
    craftCount: 0,
    analysisCount: 0,
    downloadCount: 0,
    autoFillCount: 0,
    fingerprint: getAnonFingerprint(),
  };
  try {
    localStorage.setItem(ANON_STORAGE_KEY, JSON.stringify(newData));
  } catch {}
  return newData;
}

export function saveAnonData(data: AnonData): void {
  try {
    localStorage.setItem(ANON_STORAGE_KEY, JSON.stringify(data));
  } catch {}
}
