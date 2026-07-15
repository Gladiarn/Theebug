import type { ProgressMap } from "@/lib/progress-store";
import type { Track } from "@/lib/tracks";

export interface Badge {
  id: string;
  label: string;
  description: string;
}

// Every badge here is computed purely from data already persisted (completedLevels/score/
// levelStats per track) — no new fields beyond what game-context.tsx already saves. Perfectionist
// checks each level's persisted `perfect` flag directly (set once a level has ever been completed
// with zero mistakes and zero hints) rather than comparing the track's total score against a
// fixed "max possible" sum — that comparison stopped being reliable once speed/streak bonuses made
// a level's achievable score variable instead of one fixed number per difficulty.
export function computeBadges(progress: ProgressMap, tracks: Track[]): Badge[] {
  const badges: Badge[] = [];
  const startedTracks = tracks.filter((t) => (progress[t.id]?.completedLevels.length ?? 0) > 0);

  if (startedTracks.length > 0) {
    badges.push({ id: "getting-started", label: "Getting Started", description: "Completed your first level." });
  }
  if (startedTracks.length >= 2) {
    badges.push({ id: "polyglot", label: "Polyglot", description: "Made progress in 2 or more tracks." });
  }

  for (const track of tracks) {
    const trackProgress = progress[track.id];
    if (!trackProgress) continue;
    const completed = trackProgress.completedLevels.length;
    const total = track.levels.length;

    if (completed === total && total > 0) {
      badges.push({
        id: `complete-${track.id}`,
        label: `${track.title} Track Complete`,
        description: `Finished every level in ${track.title}.`,
      });
      const allPerfect = track.levels.every((l) => trackProgress.levelStats?.[l.id]?.perfect === true);
      if (allPerfect) {
        badges.push({
          id: `perfect-${track.id}`,
          label: `${track.title} Perfectionist`,
          description: `Finished ${track.title} with zero mistakes on every level.`,
        });
      }
    } else if (total > 0 && completed / total >= 0.5) {
      badges.push({
        id: `halfway-${track.id}`,
        label: `${track.title} Halfway There`,
        description: `Completed at least half of ${track.title}.`,
      });
    }
  }

  return badges;
}
