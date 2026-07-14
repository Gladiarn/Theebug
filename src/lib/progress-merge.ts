import type { TrackProgress } from "@/lib/progress-store";

// Never silently regress progress the user already has saved server-side from a previous
// session — pure logic (no I/O, no "server-only") so the merge decision is unit-testable.
export function pickHigherScoreProgress(local: TrackProgress, current: TrackProgress | undefined): TrackProgress {
  return !current || local.score > current.score ? local : current;
}
