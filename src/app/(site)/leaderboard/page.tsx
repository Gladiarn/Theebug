import { Trophy } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getLeaderboard } from "@/lib/progress-db";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Top learners on Theebug, ranked by score.",
};

// Ranks change as people play — must be queried fresh on every request, not baked in at build time.
export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const entries = await getLeaderboard();

  return (
    <div className="mx-auto w-full max-w-[760px] box-border px-6 sm:px-12 py-16">
      <div className="mb-10 text-center">
        <div className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
          {"// leaderboard"}
        </div>
        <h1 className="text-display m-0 text-[clamp(28px,4vw,44px)] text-text">Top learners</h1>
      </div>

      {entries.length === 0 ? (
        <p className="text-center text-sm text-text-muted">
          No one&apos;s on the board yet — sign in, opt in from your account page, and complete a level.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map((entry, i) => (
            <div
              key={entry.userId}
              className="flex items-center gap-3 rounded-[10px] border border-border bg-panel p-3"
            >
              <div className="flex w-6 shrink-0 items-center justify-center font-mono text-xs text-text-muted">
                {i < 3 ? <Trophy className="h-4 w-4 text-accent-yellow" /> : i + 1}
              </div>
              {entry.image && (
                <Image src={entry.image} alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full" />
              )}
              <div className="flex-1 truncate text-sm font-bold text-text">{entry.name ?? "Anonymous"}</div>
              <div className="shrink-0 font-mono text-xs text-text-muted">{entry.totalCompleted} levels</div>
              <div className="w-16 shrink-0 text-right font-mono text-sm font-bold text-accent-yellow">
                {entry.totalScore}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
