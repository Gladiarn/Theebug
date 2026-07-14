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
  type TrackProgress,
} from "./progress-store";
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
  elapsedSeconds: number;
  justCompleted: boolean;
  lastLevelPoints: number;
  dropBlock: (zoneId: string, code: string) => void;
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
  const [wormMood, setWormMood] = useState<WormMood>("neutral");
  const [wormMessage, setWormMessage] = useState(currentLevel.wormIntro);
  const [terminalLogs, setTerminalLogs] = useState<string[]>(["[system] Theebug ready. Happy coding!"]);
  const [levelComplete, setLevelComplete] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [justCompleted, setJustCompleted] = useState(false);
  const [lastLevelPoints, setLastLevelPoints] = useState(0);
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
    setElapsedSeconds(0);
    setJustCompleted(false);
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
    const start = levelStartRef.current;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [levelKey, levelComplete]);

  // Hydrate saved progress for this track — from the server if signed in, otherwise from
  // localStorage. Done in an effect (not a useState initializer) since neither localStorage nor
  // the session are available during SSR — a lazy useState initializer would read real client
  // data while the server rendered empty state, causing a hydration mismatch. The one-frame
  // "flash" of fresh state before this runs is the accepted tradeoff for that.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (sessionStatus === "loading") return;

    if (isSignedIn) {
      fetch("/api/progress")
        .then((res) => (res.ok ? (res.json() as Promise<Record<string, TrackProgress>>) : null))
        .then((all) => {
          const saved = all?.[track.id];
          if (saved) {
            setScore(saved.score);
            setCompletedLevels(saved.completedLevels);
            if (saved.completedLevels.includes(currentLevel.id)) setLevelComplete(true);
          }
        });
      return;
    }

    const saved = getTrackProgress(track.id);
    if (saved) {
      setScore(saved.score);
      setCompletedLevels(saved.completedLevels);
      if (saved.completedLevels.includes(currentLevel.id)) {
        setLevelComplete(true);
      }
    }
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
          if (saved.completedLevels.includes(currentLevel.id)) setLevelComplete(true);
        }
      });
    // Runs once per browser on sign-in; intentionally not re-keyed on track/currentLevel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const dropBlock = useCallback(
    (zoneId: string, code: string) => {
      const zone = currentLevel.zones.find((z) => z.id === zoneId);
      if (!zone) return;

      const correct = code === zone.answer;
      const nextFills: Record<string, ZoneFill | null> = {
        ...zoneFills,
        [zoneId]: { code, correct },
      };
      const allCorrect = currentLevel.zones.every((z) => nextFills[z.id]?.correct === true);

      setZoneFills(nextFills);
      addLog(`[drop] "${code}" → ${zoneId} ${correct ? "✓" : "✗"}`);

      if (allCorrect) {
        const levelScore = Math.max(40, 100 - mistakes * 10);
        const nextScore = score + levelScore;
        const nextCompleted = completedLevels.includes(currentLevel.id)
          ? completedLevels
          : [...completedLevels, currentLevel.id];

        setWormMood("celebrating");
        setWormMessage(currentLevel.wormCorrectAll);
        setLevelComplete(true);
        setScore(nextScore);
        addLog(`[system] Level ${currentLevel.id} complete! +${levelScore} points`);
        setCompletedLevels(nextCompleted);
        setLastLevelPoints(levelScore);
        setJustCompleted(true);
        const progress: TrackProgress = {
          completedLevels: nextCompleted,
          score: nextScore,
          lastLevelIndex: currentLevelIndex,
          updatedAt: new Date().toISOString(),
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
    [currentLevel, currentLevelIndex, zoneFills, score, completedLevels, track, addLog, isSignedIn, mistakes],
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
    setElapsedSeconds(0);
    setJustCompleted(false);
    levelStartRef.current = Date.now();
    addLog("[system] Level reset.");
  }, [currentLevel, addLog]);

  const dismissReward = useCallback(() => {
    setJustCompleted(false);
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
        elapsedSeconds,
        justCompleted,
        lastLevelPoints,
        dropBlock,
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
