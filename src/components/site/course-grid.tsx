"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Track } from "@/lib/tracks";
import { TrackCard } from "./track-card";

const INITIAL_VISIBLE = 8;

export function CourseGrid({ tracks }: { tracks: Track[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? tracks : tracks.slice(0, INITIAL_VISIBLE);
  const hiddenCount = tracks.length - INITIAL_VISIBLE;

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
        {visible.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>

      {hiddenCount > 0 && !showAll && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-panel px-5 py-2.5 font-sans text-sm text-text outline-none transition-colors duration-150 hover:border-accent hover:bg-line-hover"
          >
            Show {hiddenCount} more course{hiddenCount === 1 ? "" : "s"}
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}
