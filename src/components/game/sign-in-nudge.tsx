"use client";

import { X } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useGame } from "@/lib/game-context";
import { getAllProgress } from "@/lib/progress-store";

const DISMISS_KEY = "codecanvas:signin-nudge-dismissed:v1";
const THRESHOLD = 3;

// Anonymous progress lives only in this browser's localStorage — a cleared cache loses hours
// of progress silently. Nudge once, permanently dismissible, only after there's real progress
// at stake (not on someone's very first level).
export function SignInNudge() {
  const { status } = useSession();
  const { justCompleted } = useGame();
  const [visible, setVisible] = useState(false);

  // Re-checks on session-status changes (page load) AND on `justCompleted` (a level finishing
  // live, within the same page — completing a level updates localStorage directly and doesn't
  // touch session status, so without this second trigger the nudge would only ever evaluate
  // progress from *before* the page loaded, never catching up to what just happened).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (status !== "unauthenticated") {
      setVisible(false);
      return;
    }
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
      const totalCompleted = Object.values(getAllProgress()).reduce((sum, p) => sum + p.completedLevels.length, 0);
      setVisible(totalCompleted >= THRESHOLD);
    } catch {
      // localStorage unavailable — nothing to nudge about.
    }
  }, [status, justCompleted]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // localStorage unavailable — dismissal just won't persist across reloads.
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-lg border border-accent bg-panel px-4 py-3 shadow-2xl">
      <div className="flex items-start gap-2.5">
        <div className="flex-1 text-xs leading-relaxed text-text">
          <span className="font-bold">Don&apos;t lose your progress!</span>{" "}
          You&apos;re playing anonymously — it&apos;s only saved in this browser. Sign in with GitHub to keep it
          safe.
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 cursor-pointer text-text-muted transition-colors hover:text-text"
        >
          <X size={14} />
        </button>
      </div>
      <button
        onClick={() => signIn("github")}
        className="mt-2.5 w-full cursor-pointer rounded border border-accent bg-transparent py-1.5 font-mono text-xs font-bold text-accent transition-colors hover:bg-accent hover:text-white"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}
