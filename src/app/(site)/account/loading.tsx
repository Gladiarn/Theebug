import { Skeleton } from "@/components/site/skeleton";

export default function AccountLoading() {
  return (
    <div className="mx-auto w-full max-w-[760px] box-border px-6 sm:px-12 py-16">
      <div className="mb-10 flex items-center gap-4">
        <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
        <div className="flex flex-col gap-2">
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-accent">{"// account"}</div>
          <Skeleton className="h-6 w-40 rounded-sm" />
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-[10px] border border-border bg-panel p-4">
            <Skeleton className="h-5 w-5 shrink-0 rounded-sm" />
            <div className="flex-1">
              <Skeleton className="mb-2 h-3.5 w-24 rounded-sm" />
              <Skeleton className="h-[3px] w-full rounded-sm" />
            </div>
            <Skeleton className="h-3 w-10 shrink-0 rounded-sm" />
          </div>
        ))}
      </div>

      <Skeleton className="h-8 w-44 rounded-sm" />
    </div>
  );
}
