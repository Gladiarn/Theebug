import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Track } from "@/lib/tracks";
import { TrackIcon } from "./track-icon";

export function TrackCard({ track }: { track: Track }) {
  const href = track.comingSoon ? undefined : `/learn/${track.id}`;
  const content = (
    <>
      <TrackIcon trackId={track.id} className="mb-3 h-7 w-7" style={{ color: track.color }} />
      <div className="mb-1 text-sm font-bold text-text">{track.title}</div>
      <div className="mb-3 text-xs leading-relaxed text-text-muted">{track.description}</div>
      <div className="flex items-center gap-1 font-mono text-xs text-accent">
        {track.comingSoon ? (
          "Coming soon"
        ) : (
          <>
            {track.levels.length} levels <ArrowRight className="h-3.5 w-3.5" />
          </>
        )}
      </div>
    </>
  );

  const className =
    "block rounded-[10px] border border-border bg-panel p-6 transition-[border-color,transform,box-shadow] duration-150" +
    (track.comingSoon ? " opacity-60" : " hover:-translate-y-1 hover:border-accent hover:shadow-[var(--shadow-card-hover)]");

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
