import { Skeleton } from "@/components/site/skeleton";

export default function LeaderboardLoading() {
  return (
    <div className="mx-auto w-full max-w-[760px] box-border px-6 sm:px-12 py-16">
      <div className="mb-10 text-center">
        <div className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
          {"// leaderboard"}
        </div>
        <h1 className="text-display m-0 text-[clamp(28px,4vw,44px)] text-text">Top learners</h1>
      </div>

      <div className="flex flex-col gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-[10px] border border-border bg-panel p-3">
            <Skeleton className="h-4 w-4 shrink-0 rounded-sm" />
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <Skeleton className="h-3.5 flex-1 rounded-sm" style={{ maxWidth: `${140 - i * 6}px` }} />
            <Skeleton className="h-3 w-14 shrink-0 rounded-sm" />
            <Skeleton className="h-4 w-10 shrink-0 rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
