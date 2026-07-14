"use client";

import { Lightbulb } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { TrackReference } from "@/lib/reference";
import { TRACKS, type Track } from "@/lib/tracks";
import { TrackIcon } from "./track-icon";

export function DocsTrackView({ track, reference }: { track: Track; reference: TrackReference }) {
  const [active, setActive] = useState(reference.sections[0]?.id);
  const otherTracks = TRACKS.filter((t) => t.id !== track.id && !t.comingSoon);

  // Three bugs came out of the original version of this effect, all from trusting
  // IntersectionObserver's own per-entry data too much:
  //
  // 1. Its callback only reports entries whose intersecting *state changed* since the last
  //    check, not a snapshot of every observed section. Deriving "active" from just that batch
  //    meant a short/quickly-scrolled-past section's enter+exit could coalesce into one
  //    callback and never register as the topmost intersecting one.
  // 2. `entry.boundingClientRect` is a snapshot frozen at whatever moment *that* entry last
  //    fired — if a section's intersecting status hasn't changed recently, its cached rect can
  //    be stale relative to a *different* section's freshly-fired entry, so comparing rects
  //    across entries from different callback times silently compares stale-vs-fresh geometry
  //    (confirmed live: after clicking two sections in a row, the first section's stale
  //    left-over sliver kept winning over the second section's fresh, larger, correct one).
  // 3. On short docs pages (few/short sections), the container can hit its max scroll before
  //    the last section's top ever reaches the observed band at all — it gets stuck exactly at
  //    the band's bottom edge (confirmed: rect.top === bandBottom, excluded by a strict `<`),
  //    so nothing in the band ever matches and the last section never activates.
  //
  // Fix: IntersectionObserver is used purely as an efficient "something changed, go recheck"
  // trigger — the actual decision always re-measures every section's *current*
  // `getBoundingClientRect()` live (never a cached entry rect), and explicitly treats "scrolled
  // to the bottom of the container" as "the last section is active" rather than relying on band
  // math that has nowhere left to scroll into.
  useEffect(() => {
    const sections = reference.sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const getScrollParent = (el: HTMLElement): HTMLElement | Window => {
      let node = el.parentElement;
      while (node) {
        const style = getComputedStyle(node);
        if (/(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight) return node;
        node = node.parentElement;
      }
      return window;
    };
    const scrollParent = getScrollParent(sections[0]);

    const BAND_TOP = 96;

    const recompute = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollParent === window
          ? { scrollTop: window.scrollY, scrollHeight: document.documentElement.scrollHeight, clientHeight: window.innerHeight }
          : (scrollParent as HTMLElement);
      if (scrollTop + clientHeight >= scrollHeight - 2) {
        setActive(sections[sections.length - 1].id);
        return;
      }

      const bandBottom = window.innerHeight * 0.3;
      const inBand = sections
        .map((el) => ({ id: el.id, rect: el.getBoundingClientRect() }))
        .filter(({ rect }) => rect.bottom > BAND_TOP && rect.top < bandBottom)
        // Prefer whichever section's top is closest to (but not below) the band's bottom edge
        // — the one most recently entered, i.e. actually being read — over one that's mostly
        // scrolled past and just has a trailing sliver still poking into the band.
        .sort((a, b) => b.rect.top - a.rect.top);
      if (inBand[0]) setActive(inBand[0].id);
    };

    const observer = new IntersectionObserver(recompute, { rootMargin: "-96px 0px -70% 0px", threshold: 0 });
    sections.forEach((el) => observer.observe(el));

    // Belt-and-suspenders: IntersectionObserver only calls back on a threshold *crossing*, not
    // on every scroll movement. Arriving at the exact bottom via several small incremental
    // scroll steps (confirmed live) can settle without any further crossing firing on the last
    // step, leaving `active` stuck on stale state — a plain `scroll` listener (rAF-throttled)
    // guarantees `recompute` still runs on every scroll frame regardless of whether anything
    // crossed a threshold.
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        recompute();
      });
    };
    const scrollTarget: HTMLElement | Window = scrollParent;
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      scrollTarget.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
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

        <div className="flex flex-col gap-16">
          {reference.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
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
