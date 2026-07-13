"use client";

import { Github, LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";

export function LeaderboardOptInToggle({ initialOptIn }: { initialOptIn: boolean }) {
  const [optIn, setOptIn] = useState(initialOptIn);
  const [pending, setPending] = useState(false);

  const toggle = async () => {
    const next = !optIn;
    setOptIn(next);
    setPending(true);
    try {
      await fetch("/api/account/leaderboard-opt-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optIn: next }),
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <label className="flex items-center justify-between gap-4 rounded-[10px] border border-border bg-panel p-4">
      <div>
        <div className="text-sm font-bold text-text">Show me on the leaderboard</div>
        <div className="text-xs text-text-muted">
          Your GitHub name and avatar will be visible to anyone who views the public leaderboard.
        </div>
      </div>
      <input
        type="checkbox"
        checked={optIn}
        disabled={pending}
        onChange={toggle}
        className="h-4 w-4 shrink-0 accent-[var(--accent)]"
      />
    </label>
  );
}

export function SignInButton() {
  return (
    <button
      onClick={() => signIn("github")}
      className="inline-flex items-center gap-2 rounded bg-accent px-4 py-2 text-xs font-bold text-white transition-transform duration-150 hover:-translate-y-0.5"
    >
      <Github className="h-4 w-4" /> Sign in with GitHub
    </button>
  );
}

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs text-text-muted outline-none transition-colors hover:border-accent hover:text-text"
    >
      <LogOut className="h-3.5 w-3.5" /> Sign out
    </button>
  );
}
