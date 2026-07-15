import type { Metadata } from "next";
import { TrackCard } from "@/components/site/track-card";
import { TRACKS } from "@/lib/tracks";

export const metadata: Metadata = {
  title: "Learn",
  description: "Browse every Theebug course: JavaScript, Python, HTML, CSS, and more.",
};

export default function LearnPage() {
  return (
    <div className="mx-auto w-full max-w-[1100px] box-border px-6 sm:px-12 py-16">
      <div className="mb-10 text-center">
        <div className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
          {"// courses"}
        </div>
        <h1 className="text-display m-0 text-[clamp(28px,4vw,44px)] text-text">Pick a course, start dragging</h1>
        <p className="mx-auto mt-3 max-w-[520px] text-sm leading-relaxed text-text-muted">
          Every course teaches a language through hands-on levels — read the objective, drag the right block,
          get instant feedback.
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
        {TRACKS.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
