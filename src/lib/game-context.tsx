"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  getAllProgress,
  getTrackProgress,
  hasSyncedToServer,
  markSyncedToServer,
  setTrackProgress,
  type LevelStatsMap,
  type TrackProgress,
} from "./progress-store";
import { calculateLevelScore, type ScoreBreakdown } from "./scoring";
import { getLevelIndexById, getTrack, type Level, type Track } from "./tracks";

export type WormMood = "neutral" | "happy" | "sad" | "celebrating";

export interface ZoneFill {
  code: string;
  correct: boolean;
}

interface GameContextValue {
  currentTrack: Track;
  currentLevel: Level;
  currentLevelIndex: number;
  zoneFills: Record<string, ZoneFill | null>;
  score: number;
  completedLevels: number[];
  wormMood: WormMood;
  wormMessage: string;
  terminalLogs: string[];
  levelComplete: boolean;
  mistakes: number;
  hintsUsed: number;
  // The zone a just-requested hint targets — highlights that zone's correct block in BottomPanel.
  // Clears once that specific zone is filled correctly, or the level changes.
  hintedZoneId: string | null;
  // Consecutive clean (zero mistakes, zero hints) level completions in a row this session — not
  // persisted, resets to 0 the instant a level finishes with any mistake or hint. Feeds the streak
  // bonus in scoring.ts.
  cleanStreak: number;
  elapsedSeconds: number;
  justCompleted: boolean;
  lastLevelScore: ScoreBreakdown | null;
  // Below `lg` the Sidebar and RightPanel become off-canvas drawers (fixed chrome that would
  // otherwise force horizontal overflow at phone widths) — only one open at a time, toggled from
  // MenuBar. Lives here (not local component state) since MenuBar and Sidebar/RightPanel aren't
  // siblings under a shared parent (MenuBar renders from GameProviderShell, the panels from
  // GamePlayShell one level down), and every one of them already consumes useGame().
  mobilePanel: "none" | "sidebar" | "right";
  toggleMobilePanel: (panel: "sidebar" | "right") => void;
  closeMobilePanel: () => void;
  dropBlock: (zoneId: string, code: string) => void;
  useHint: () => void;
  nextLevel: () => void;
  resetLevel: () => void;
  goToLevel: (index: number) => void;
  dismissReward: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}

function makeEmptyFills(level: Level): Record<string, null> {
  return Object.fromEntries(level.zones.map((z) => [z.id, null]));
}

export function GameProvider({ trackId, children }: { trackId: string; children: ReactNode }) {
  const router = useRouter();
  const params = useParams<{ level?: string }>();
  const { status: sessionStatus } = useSession();
  const isSignedIn = sessionStatus === "authenticated";

  const track = getTrack(trackId);
  if (!track) throw new Error(`Unknown track: ${trackId}`);

  const paramIndex = getLevelIndexById(track, Number(params.level));
  const currentLevelIndex = paramIndex === -1 ? 0 : paramIndex;
  const currentLevel = track.levels[currentLevelIndex];

  const [zoneFills, setZoneFills] = useState<Record<string, ZoneFill | null>>(() => makeEmptyFills(currentLevel));
  const [score, setScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  // Source of truth behind `score`/`totalTimeMs`: each level's best-ever score and fastest-ever
  // time, independently. `score`/persisted `totalTimeMs` are always the *sum* of these — derived,
  // never incremented directly — specifically so replaying an already-completed level can never
  // inflate the track total just by completing the same level again (a real bug found and fixed;
  // see upgrade-plan.md item #19).
  const [levelStats, setLevelStats] = useState<LevelStatsMap>({});
  const [wormMood, setWormMood] = useState<WormMood>("neutral");
  const [wormMessage, setWormMessage] = useState(currentLevel.wormIntro);
  const [terminalLogs, setTerminalLogs] = useState<string[]>(["[system] Theebug ready. Happy coding!"]);
  const [levelComplete, setLevelComplete] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintedZoneId, setHintedZoneId] = useState<string | null>(null);
  // Ephemeral, session-only — not persisted, not hydrated. Resets per track in the hydration
  // effect below (a track switch shouldn't carry a streak from a different track), and resets to
  // 0 the instant any level finishes with a mistake or hint (see dropBlock).
  const [cleanStreak, setCleanStreak] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [justCompleted, setJustCompleted] = useState(false);
  const [lastLevelScore, setLastLevelScore] = useState<ScoreBreakdown | null>(null);
  // True once the hydration effect below has actually read (or fetched) saved progress for the
  // current track/auth state. Guards dropBlock so a drop can't race ahead of hydration and save
  // stale default state (score 0, no completed levels) over real saved progress — see the
  // hydration effect's comment for why this matters.
  const [hydrated, setHydrated] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"none" | "sidebar" | "right">("none");
  const levelStartRef = useRef<number | null>(null);

  const addLog = useCallback((msg: string) => {
    setTerminalLogs((prev) => [...prev.slice(-30), msg]);
  }, []);

  // The URL is the source of truth for the active level. Detect it changing during
  // render (React's documented pattern for resetting state when a prop changes) and
  // reset per-level state before this render commits — covers Sidebar clicks, Next
  // Level, and back/forward navigation uniformly, with no extra render pass.
  const levelKey = `${track.id}:${currentLevel.id}`;
  const [syncedLevelKey, setSyncedLevelKey] = useState(levelKey);
  if (levelKey !== syncedLevelKey) {
    setSyncedLevelKey(levelKey);
    setZoneFills(makeEmptyFills(currentLevel));
    setWormMood("neutral");
    setWormMessage(currentLevel.wormIntro);
    setLevelComplete(completedLevels.includes(currentLevel.id));
    setMistakes(0);
    setHintsUsed(0);
    setHintedZoneId(null);
    setElapsedSeconds(0);
    setJustCompleted(false);
    setMobilePanel("none");
    addLog(`[system] Level ${currentLevelIndex + 1}: ${currentLevel.title}`);
  }

  // Per-level stopwatch. Refs/Date.now() can't be touched during render (React purity rules),
  // so the start-time reset happens in its own effect, ordered before the ticking effect below
  // so the interval always reads a freshly-reset start time on the same commit a level changes.
  useEffect(() => {
    levelStartRef.current = Date.now();
  }, [levelKey]);

  useEffect(() => {
    if (levelComplete || levelStartRef.current === null) return;
    const interval = setInterval(() => {
      // Read the ref fresh on every tick (not a closed-over `const`) so resetLevel()'s
      // direct ref mutation takes effect immediately, even when it doesn't also change
      // this effect's own dependencies (e.g. resetting an already-incomplete level).
      setElapsedSeconds(Math.floor((Date.now() - (levelStartRef.current ?? Date.now())) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [levelKey, levelComplete]);

  // Hydrate saved progress for this track — from the server if signed in, otherwise from
  // localStorage. Done in an effect (not a useState initializer) since neither localStorage nor
  // the session are available during SSR — a lazy useState initializer would read real client
  // data while the server rendered empty state, causing a hydration mismatch. The one-frame
  // "flash" of fresh state before this runs is the accepted tradeoff for that.
  //
  // `hydrated` guards a real bug this shape invites: score/completedLevels start at their
  // default 0/[] on every fresh mount, and only get overwritten with the real saved values once
  // this effect runs. If dropBlock completes a level before that happens (confirmed via a fast
  // E2E test — a human wouldn't normally hit this, but nothing stopped it), it saves
  // `nextScore = 0 + levelScore` and `nextCompleted = [thisLevel]`, silently overwriting any
  // progress from previous levels/sessions. dropBlock checks `hydrated` before doing anything.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setHydrated(false);
    setCleanStreak(0);
    if (sessionStatus === "loading") return;

    if (isSignedIn) {
      fetch("/api/progress")
        .then((res) => (res.ok ? (res.json() as Promise<Record<string, TrackProgress>>) : null))
        .then((all) => {
          const saved = all?.[track.id];
          if (saved) {
            // `levelStats` defaults to {} for progress saved before this field existed — the old
            // cumulative `score` is still trusted as-is until the next completion, at which point
            // it becomes derived purely from levelStats going forward (see dropBlock).
            setScore(saved.score);
            setCompletedLevels(saved.completedLevels);
            setLevelStats(saved.levelStats ?? {});
            if (saved.completedLevels.includes(currentLevel.id)) setLevelComplete(true);
          }
          setHydrated(true);
        });
      return;
    }

    const saved = getTrackProgress(track.id);
    if (saved) {
      setScore(saved.score);
      setCompletedLevels(saved.completedLevels);
      setLevelStats(saved.levelStats ?? {});
      if (saved.completedLevels.includes(currentLevel.id)) {
        setLevelComplete(true);
      }
    }
    setHydrated(true);
    // Only re-hydrate when switching tracks or auth state, not on every level navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.id, isSignedIn, sessionStatus]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // One-time migration: the first time this browser is signed in, POST whatever local progress
  // it has accumulated anonymously so it isn't lost. `hasSyncedToServer`/`markSyncedToServer` are
  // localStorage-backed (not a ref) so this survives GameProvider remounting on track navigation.
  useEffect(() => {
    if (!isSignedIn || hasSyncedToServer()) return;

    const local = getAllProgress();
    if (Object.keys(local).length === 0) {
      markSyncedToServer();
      return;
    }

    fetch("/api/progress/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(local),
    })
      .then((res) => (res.ok ? (res.json() as Promise<Record<string, TrackProgress>>) : null))
      .then((merged) => {
        markSyncedToServer();
        const saved = merged?.[track.id];
        if (saved) {
          setScore(saved.score);
          setCompletedLevels(saved.completedLevels);
          setLevelStats(saved.levelStats ?? {});
          if (saved.completedLevels.includes(currentLevel.id)) setLevelComplete(true);
        }
      });
    // Runs once per browser on sign-in; intentionally not re-keyed on track/currentLevel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const dropBlock = useCallback(
    (zoneId: string, code: string) => {
      // Ignore drops until saved progress has actually loaded — see the hydration effect's
      // comment for the overwrite bug this prevents. In practice this window is milliseconds,
      // imperceptible to a real human dragging a block.
      if (!hydrated) return;

      const zone = currentLevel.zones.find((z) => z.id === zoneId);
      if (!zone) return;

      const correct = code === zone.answer;
      const nextFills: Record<string, ZoneFill | null> = {
        ...zoneFills,
        [zoneId]: { code, correct },
      };
      const allCorrect = currentLevel.zones.every((z) => nextFills[z.id]?.correct === true);

      setZoneFills(nextFills);
      // A hint's highlight is only for "which block goes in this zone" — once that zone is
      // actually correct, the hint has done its job and should stop glowing.
      if (correct && zoneId === hintedZoneId) setHintedZoneId(null);
      if (correct) {
        addLog(`[drop] "${code}" → ${zoneId} ✓`);
      } else {
        // Reads like a real compiler/runtime error (location + a generic "doesn't fit here"
        // message) rather than a bare ✗ — but deliberately never names the correct answer, since
        // that would just spoil the puzzle. Location is derived from the level's own codeLines,
        // not a separately-maintained line number, so it can't drift out of sync with the data.
        const lineIndex = currentLevel.codeLines.findIndex((line) => line.includes(`{{${zoneId}}}`));
        const location = lineIndex === -1 ? currentLevel.filename : `${currentLevel.filename}:${lineIndex + 1}`;
        addLog(`[error] ${location} — "${code}" is not valid here`);
      }

      if (allCorrect) {
        // Real ms elapsed for this attempt, not the once-a-second-rounded `elapsedSeconds` used
        // for display — this also feeds the speed bonus, so it needs to be exact, not rounded.
        const thisAttemptMs = Date.now() - (levelStartRef.current ?? Date.now());
        const isClean = mistakes === 0 && hintsUsed === 0;
        const nextCleanStreak = isClean ? cleanStreak + 1 : 0;

        const breakdown = calculateLevelScore({
          difficulty: currentLevel.difficulty,
          mistakes,
          hintsUsed,
          elapsedSeconds: thisAttemptMs / 1000,
          streak: nextCleanStreak,
        });
        const nextCompleted = completedLevels.includes(currentLevel.id)
          ? completedLevels
          : [...completedLevels, currentLevel.id];

        // Best-ever score, fastest-ever time, and ever-been-perfect for THIS level, each tracked
        // independently — replaying a level (via Sidebar) can only ever improve or match the
        // first two, never make them worse, and can never inflate the track total just by
        // re-completing the same level (see upgrade-plan.md #19, a real bug found where every
        // completion unconditionally added to the running total).
        const previous = levelStats[currentLevel.id];
        const nextLevelStats: LevelStatsMap = {
          ...levelStats,
          [currentLevel.id]: {
            score: previous ? Math.max(previous.score, breakdown.total) : breakdown.total,
            timeMs: previous ? Math.min(previous.timeMs, thisAttemptMs) : thisAttemptMs,
            perfect: (previous?.perfect ?? false) || isClean,
          },
        };
        const nextScore = Object.values(nextLevelStats).reduce((sum, s) => sum + s.score, 0);
        const nextTotalTimeMs = Object.values(nextLevelStats).reduce((sum, s) => sum + s.timeMs, 0);

        setWormMood("celebrating");
        setWormMessage(currentLevel.wormCorrectAll);
        setLevelComplete(true);
        setScore(nextScore);
        setCleanStreak(nextCleanStreak);
        const bonusParts = [
          breakdown.speedBonus > 0 ? `+${breakdown.speedBonus} speed` : null,
          breakdown.streakBonus > 0 ? `+${breakdown.streakBonus} streak` : null,
        ].filter(Boolean);
        addLog(
          `[system] Level ${currentLevel.id} complete! +${breakdown.total} points` +
            (bonusParts.length > 0 ? ` (${bonusParts.join(", ")})` : ""),
        );
        setCompletedLevels(nextCompleted);
        setLevelStats(nextLevelStats);
        setLastLevelScore(breakdown);
        setJustCompleted(true);
        const progress: TrackProgress = {
          completedLevels: nextCompleted,
          score: nextScore,
          lastLevelIndex: currentLevelIndex,
          updatedAt: new Date().toISOString(),
          totalTimeMs: nextTotalTimeMs,
          levelStats: nextLevelStats,
        };
        if (isSignedIn) {
          fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ trackId: track.id, progress }),
          });
        } else {
          setTrackProgress(track.id, progress);
        }
      } else if (correct) {
        setWormMood("happy");
        setWormMessage("Nice drop! That one's correct! Keep going! 🎯");
        setTimeout(() => setWormMood("neutral"), 1500);
      } else {
        setMistakes((m) => m + 1);
        setWormMood("sad");
        setWormMessage("Hmm, that's not quite right. Try a different block! 🤔");
        setTimeout(() => {
          setWormMood("neutral");
          setWormMessage(currentLevel.wormIntro);
        }, 2200);
      }
    },
    [
      currentLevel,
      currentLevelIndex,
      zoneFills,
      completedLevels,
      levelStats,
      track,
      addLog,
      isSignedIn,
      mistakes,
      hintsUsed,
      hintedZoneId,
      cleanStreak,
      hydrated,
    ],
  );

  const nextLevel = useCallback(() => {
    const next = currentLevelIndex + 1;
    if (next < track.levels.length) {
      router.push(`/play/${track.id}/${track.levels[next].id}`);
    }
  }, [currentLevelIndex, track, router]);

  const resetLevel = useCallback(() => {
    setZoneFills(makeEmptyFills(currentLevel));
    setWormMood("neutral");
    setWormMessage(currentLevel.wormIntro);
    setLevelComplete(false);
    setMistakes(0);
    setHintsUsed(0);
    setHintedZoneId(null);
    setElapsedSeconds(0);
    setJustCompleted(false);
    levelStartRef.current = Date.now();
    addLog("[system] Level reset.");
  }, [currentLevel, addLog]);

  // Reveals which block is correct for the first not-yet-correct zone (never auto-fills it — the
  // player still has to drag it themselves) at a real scoring cost, see scoring.ts's
  // HINT_PENALTY_RATIO. Deliberately does nothing once every zone is already correct or the level
  // itself is complete — there's nothing left to hint at that point.
  const useHint = useCallback(() => {
    if (!hydrated || levelComplete) return;
    const targetZone = currentLevel.zones.find((z) => zoneFills[z.id]?.correct !== true);
    if (!targetZone) return;
    setHintsUsed((h) => h + 1);
    setHintedZoneId(targetZone.id);
    addLog(`[system] Hint used for ${targetZone.id}.`);
  }, [hydrated, levelComplete, currentLevel, zoneFills, addLog]);

  const dismissReward = useCallback(() => {
    setJustCompleted(false);
  }, []);

  const toggleMobilePanel = useCallback((panel: "sidebar" | "right") => {
    setMobilePanel((prev) => (prev === panel ? "none" : panel));
  }, []);

  const closeMobilePanel = useCallback(() => {
    setMobilePanel("none");
  }, []);

  const goToLevel = useCallback(
    (index: number) => {
      if (index < 0 || index >= track.levels.length) return;
      router.push(`/play/${track.id}/${track.levels[index].id}`);
    },
    [track, router],
  );

  return (
    <GameContext.Provider
      value={{
        currentTrack: track,
        currentLevel,
        currentLevelIndex,
        zoneFills,
        score,
        completedLevels,
        wormMood,
        wormMessage,
        terminalLogs,
        levelComplete,
        mistakes,
        hintsUsed,
        hintedZoneId,
        cleanStreak,
        elapsedSeconds,
        justCompleted,
        lastLevelScore,
        mobilePanel,
        toggleMobilePanel,
        closeMobilePanel,
        dropBlock,
        useHint,
        nextLevel,
        resetLevel,
        goToLevel,
        dismissReward,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
