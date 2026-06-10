import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { LEVELS } from './gameData';

export type WormMood = 'neutral' | 'happy' | 'sad' | 'celebrating';

export interface ZoneFill {
  code: string;
  correct: boolean;
}

interface GameState {
  currentLevelIndex: number;
  zoneFills: Record<string, ZoneFill | null>;
  score: number;
  completedLevels: number[];
  wormMood: WormMood;
  wormMessage: string;
  terminalLogs: string[];
  levelComplete: boolean;
}

interface GameContextValue extends GameState {
  dropBlock: (zoneId: string, code: string) => void;
  nextLevel: () => void;
  resetLevel: () => void;
  goToLevel: (index: number) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}

function makeEmptyFills(levelIndex: number): Record<string, null> {
  return Object.fromEntries(LEVELS[levelIndex].zones.map(z => [z.id, null]));
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [zoneFills, setZoneFillsState] = useState<Record<string, ZoneFill | null>>(makeEmptyFills(0));
  const [score, setScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [wormMood, setWormMood] = useState<WormMood>('neutral');
  const [wormMessage, setWormMessage] = useState(LEVELS[0].wormIntro);
  const [terminalLogs, setTerminalLogs] = useState<string[]>(['[system] Code Canvas ready. Happy coding!']);
  const [levelComplete, setLevelComplete] = useState(false);

  // Ref so we can read current fills synchronously inside dropBlock
  const zoneFillsRef = useRef<Record<string, ZoneFill | null>>(makeEmptyFills(0));

  function setZoneFills(fills: Record<string, ZoneFill | null>) {
    zoneFillsRef.current = fills;
    setZoneFillsState(fills);
  }

  const addLog = useCallback((msg: string) => {
    setTerminalLogs(prev => [...prev.slice(-30), msg]);
  }, []);

  const dropBlock = useCallback((zoneId: string, code: string) => {
    const level = LEVELS[currentLevelIndex];
    const zone = level.zones.find(z => z.id === zoneId);
    if (!zone) return;

    const correct = code === zone.answer;
    const nextFills: Record<string, ZoneFill | null> = {
      ...zoneFillsRef.current,
      [zoneId]: { code, correct },
    };
    const allCorrect = level.zones.every(z => nextFills[z.id]?.correct === true);

    setZoneFills(nextFills);
    addLog(`[drop] "${code}" → ${zoneId} ${correct ? '✓' : '✗'}`);

    if (allCorrect) {
      setWormMood('celebrating');
      setWormMessage(level.wormCorrectAll);
      setLevelComplete(true);
      setScore(s => s + 100);
      addLog(`[system] Level ${level.id} complete! +100 points`);
      setCompletedLevels(prev => (prev.includes(level.id) ? prev : [...prev, level.id]));
    } else if (correct) {
      setWormMood('happy');
      setWormMessage("Nice drop! That one's correct! Keep going! 🎯");
      const t = setTimeout(() => setWormMood('neutral'), 1500);
      return () => clearTimeout(t);
    } else {
      setWormMood('sad');
      setWormMessage("Hmm, that's not quite right. Try a different block! 🤔");
      const t = setTimeout(() => {
        setWormMood('neutral');
        setWormMessage(level.wormIntro);
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [currentLevelIndex, addLog]);

  const nextLevel = useCallback(() => {
    const next = currentLevelIndex + 1;
    if (next < LEVELS.length) {
      const emptyFills = makeEmptyFills(next);
      setCurrentLevelIndex(next);
      setZoneFills(emptyFills);
      setWormMood('neutral');
      setWormMessage(LEVELS[next].wormIntro);
      setLevelComplete(false);
      addLog(`[system] Starting Level ${next + 1}: ${LEVELS[next].title}`);
    }
  }, [currentLevelIndex, addLog]);

  const resetLevel = useCallback(() => {
    const emptyFills = makeEmptyFills(currentLevelIndex);
    setZoneFills(emptyFills);
    setWormMood('neutral');
    setWormMessage(LEVELS[currentLevelIndex].wormIntro);
    setLevelComplete(false);
    addLog('[system] Level reset.');
  }, [currentLevelIndex, addLog]);

  const goToLevel = useCallback((index: number) => {
    if (index < 0 || index >= LEVELS.length) return;
    const emptyFills = makeEmptyFills(index);
    setCurrentLevelIndex(index);
    setZoneFills(emptyFills);
    setWormMood('neutral');
    setWormMessage(LEVELS[index].wormIntro);
    setLevelComplete(false);
    addLog(`[system] Jumped to Level ${index + 1}: ${LEVELS[index].title}`);
  }, [addLog]);

  return (
    <GameContext.Provider value={{
      currentLevelIndex, zoneFills, score, completedLevels,
      wormMood, wormMessage, terminalLogs, levelComplete,
      dropBlock, nextLevel, resetLevel, goToLevel,
    }}>
      {children}
    </GameContext.Provider>
  );
}
