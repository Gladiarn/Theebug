// Best-ever score and fastest-ever time for one level, independently tracked — replaying a level
// can only ever improve (or match) each of these, never make them worse. See LevelStatsMap below.
export interface LevelStats {
  score: number;
  timeMs: number;
}

// Keyed by Level.id. This is what `score`/`totalTimeMs` are derived from (sum of every level's
// best-ever score / fastest-ever time) — the source of truth is per-level, not a running total,
// specifically so replaying an already-completed level can never inflate the track total by
// simply completing the same level repeatedly. Optional since progress saved before this field
// existed won't have it (falls back to trusting the old plain `score`, see game-context.tsx).
export type LevelStatsMap = Record<number, LevelStats>;

export interface TrackProgress {
  completedLevels: number[];
  score: number;
  lastLevelIndex: number;
  updatedAt: string;
  // Cumulative real elapsed time (ms) — sum of every level's *fastest* completion in this track,
  // not every attempt's raw time. Used only as a leaderboard tiebreaker (faster total time wins
  // when totalScore ties), never shown as a primary stat.
  totalTimeMs?: number;
  levelStats?: LevelStatsMap;
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
