export interface TrackProgress {
  completedLevels: number[];
  score: number;
  lastLevelIndex: number;
  updatedAt: string;
}

export type ProgressMap = Record<string, TrackProgress>;

const STORAGE_KEY = "codecanvas:progress:v1";

function loadAllProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function getTrackProgress(trackId: string): TrackProgress | null {
  return loadAllProgress()[trackId] ?? null;
}

export function getAllProgress(): ProgressMap {
  return loadAllProgress();
}

export function setTrackProgress(trackId: string, progress: TrackProgress): void {
  try {
    const all = loadAllProgress();
    all[trackId] = progress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — progress just won't persist.
  }
}

const SYNCED_FLAG_KEY = "codecanvas:synced-to-server:v1";

// Whether this browser's local progress has already been migrated to the server once. Persisted
// (not just in-memory) so re-mounting GameProvider on track navigation doesn't re-POST the sync
// endpoint on every switch.
export function hasSyncedToServer(): boolean {
  try {
    return localStorage.getItem(SYNCED_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

export function markSyncedToServer(): void {
  try {
    localStorage.setItem(SYNCED_FLAG_KEY, "1");
  } catch {
    // localStorage unavailable — sync may re-run next mount, which is harmless (server merge is idempotent).
  }
}
