import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { WormMascot } from "@/components/game/worm-mascot";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-bg px-6 py-20 text-center text-text">
      <WormMascot mood="sad" className="h-20 w-20" />
      <h1 className="m-0 text-2xl font-bold">Debug couldn&apos;t find that page</h1>
      <p className="max-w-[420px] text-sm leading-relaxed text-text-muted">
        The page you&apos;re looking for doesn&apos;t exist, or the level ID isn&apos;t valid. Let&apos;s get you
        back on track.
      </p>
      <Link
        href="/"
        className="mt-2 flex items-center gap-2 rounded-md bg-accent-blue px-6 py-2.5 font-sans text-sm font-bold text-white transition-transform duration-150 hover:-translate-y-0.5"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  );
}
