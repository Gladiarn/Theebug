import type { Metadata } from "next";
import Link from "next/link";
import { TrackIcon } from "@/components/site/track-icon";
import { TRACKS } from "@/lib/tracks";

export const metadata: Metadata = {
  title: "Docs",
  description: "Quick reference cheatsheets for every Theebug course.",
};

export default function DocsPage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] box-border px-6 sm:px-12 py-16">
      <div className="mb-10 text-center">
        <div className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
          {"// docs"}
        </div>
        <h1 className="text-display m-0 text-[clamp(28px,4vw,44px)] text-text">Quick reference</h1>
        <p className="mx-auto mt-3 max-w-[520px] text-sm leading-relaxed text-text-muted">
          Cheatsheets for every concept covered in the game — handy to keep open while you play, or to skim on
          their own.
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {TRACKS.filter((t) => !t.comingSoon).map((track) => (
          <Link
            key={track.id}
            href={`/docs/${track.id}`}
            className="block rounded-[10px] border border-border bg-panel p-6 transition-[border-color,transform,box-shadow] duration-150 hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-card-hover)]"
          >
            <TrackIcon trackId={track.id} className="mb-3 h-7 w-7" style={{ color: track.color }} />
            <div className="mb-1 text-sm font-bold text-text">{track.title} Reference</div>
            <div className="text-xs leading-relaxed text-text-muted">{track.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
