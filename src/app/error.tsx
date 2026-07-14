"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { WormMascot } from "@/components/game/worm-mascot";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-bg px-6 py-20 text-center text-text">
      <WormMascot mood="sad" className="h-20 w-20" />
      <h1 className="m-0 text-2xl font-bold">Debug hit a bug</h1>
      <p className="max-w-[420px] text-sm leading-relaxed text-text-muted">
        Something broke on this page. It&apos;s not you — try again, or head back home.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-md bg-accent-blue px-6 py-2.5 font-sans text-sm font-bold text-white transition-transform duration-150 hover:-translate-y-0.5"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-border px-6 py-2.5 font-sans text-sm font-bold text-text transition-colors hover:border-accent"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
