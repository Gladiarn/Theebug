"use client";

import { Lightbulb } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { TrackReference } from "@/lib/reference";
import { TRACKS, type Track } from "@/lib/tracks";
import { TrackIcon } from "./track-icon";

export function DocsTrackView({ track, reference }: { track: Track; reference: TrackReference }) {
  const [active, setActive] = useState(reference.sections[0]?.id);
  const otherTracks = TRACKS.filter((t) => t.id !== track.id && !t.comingSoon);

  useEffect(() => {
    const sections = reference.sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [reference]);

  return (
    <div className="mx-auto flex w-full max-w-[1160px] gap-10 px-6 py-10 sm:px-12">
      <aside className="hidden w-[200px] shrink-0 lg:block">
        <div className="sticky top-6">
          <div className="mb-4 flex items-center gap-2">
            <TrackIcon trackId={track.id} className="h-5 w-5" style={{ color: track.color }} />
            <span className="text-sm font-bold text-text">{track.title}</span>
          </div>

          <nav className="flex flex-col gap-0.5 border-l border-border">
            {reference.sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`-ml-px border-l-2 py-1 pl-3 text-xs transition-colors ${
                  active === section.id
                    ? "border-accent font-bold text-accent"
                    : "border-transparent text-text-muted hover:text-text"
                }`}
              >
                {section.title}
              </a>
            ))}
          </nav>

          {otherTracks.length > 0 && (
            <div className="mt-8 border-t border-border pt-4">
              <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wide text-text-muted">
                Other references
              </div>
              <div className="flex flex-col gap-1.5">
                {otherTracks.map((t) => (
                  <Link
                    key={t.id}
                    href={`/docs/${t.id}`}
                    className="flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-accent"
                  >
                    <TrackIcon trackId={t.id} className="h-3.5 w-3.5" style={{ color: t.color }} />
                    {t.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-10">
          <TrackIcon trackId={track.id} className="mb-3 h-9 w-9" style={{ color: track.color }} />
          <h1 className="text-display m-0 mb-2 text-[clamp(28px,4vw,40px)] text-text">{track.title} Reference</h1>
          <p className="text-sm leading-relaxed text-text-muted">{track.description}</p>
        </div>

        <div className="flex flex-col gap-10">
          {reference.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              <h2 className="m-0 mb-2 font-mono text-base font-bold text-text">
                <span className="text-code-comment">{"/** "}</span>
                {section.title}
                <span className="text-code-comment">{" */"}</span>
              </h2>
              <div className="flex flex-col gap-3 text-sm leading-relaxed text-text-muted">
                {section.body.map((paragraph, i) => (
                  <p key={i} className="m-0">
                    {paragraph}
                  </p>
                ))}
              </div>

              {section.examples && section.examples.length > 0 && (
                <div className="mt-3 flex flex-col gap-3">
                  {section.examples.map((example, i) => (
                    <div key={i}>
                      {example.title && (
                        <div className="mb-1 font-mono text-[10px] uppercase tracking-wide text-text-muted">
                          {example.title}
                        </div>
                      )}
                      <pre className="overflow-x-auto rounded border border-border bg-bg p-3 font-mono text-xs text-code-plain">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              {section.tip && (
                <div className="mt-3 flex items-start gap-2 rounded border border-accent/30 bg-icon-circle-bg px-3 py-2.5 text-xs leading-relaxed text-text">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                  <span>{section.tip}</span>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
