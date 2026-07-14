"use client";

import {
  ArrowDown,
  ArrowRight,
  CircleCheckBig,
  Eye,
  MousePointerClick,
  Play,
  Plus,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { WormMascot, type MascotMood } from "@/components/game/worm-mascot";
import { DebugWormScene } from "@/components/site/debug-worm-scene";
import { TrackCard } from "@/components/site/track-card";
import { TRACKS } from "@/lib/tracks";

const TOTAL_LEVELS = TRACKS.reduce((sum, t) => sum + t.levels.length, 0);

const STEPS = [
  {
    icon: Eye,
    title: "Read the objective",
    desc: "Debug explains the challenge in plain English in the right panel — no jargon.",
  },
  {
    icon: MousePointerClick,
    title: "Drag the right block",
    desc: "Pick a code block from the tray and drop it into the glowing empty slot.",
  },
  {
    icon: CircleCheckBig,
    title: "Get instant feedback",
    desc: "Correct turns green and Debug cheers. Wrong turns red — try again, no judgment.",
  },
];

const FEATURES = [
  "Full syntax highlighting in dark & light themes",
  "Drop zones inline inside real code structure",
  "Terminal shows system logs (not the coach!)",
  "File sidebar tracks your progress",
];

const MOODS: { mood: MascotMood; label: string }[] = [
  { mood: "sad", label: "Sad" },
  { mood: "neutral", label: "Neutral" },
  { mood: "celebrating", label: "Party" },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
      {"// "}
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-display m-0 text-[clamp(24px,3.5vw,36px)] text-text">{children}</h2>
  );
}

export function LandingPage() {
  const router = useRouter();
  const goToPlay = () => router.push("/play/javascript");

  return (
    <div>
      <section className="mx-auto w-full max-w-[1100px] box-border px-6 py-12 sm:px-12 sm:py-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
              {"// index.tsx"}
            </div>

            <h1 className="text-display m-0 mb-5 text-[clamp(32px,5vw,54px)] text-text">
              You don&apos;t write the code.
              <br />
              <span className="text-accent">You finish it.</span>
            </h1>

            <p className="mb-8 max-w-[460px] text-[15px] leading-relaxed text-text-muted">
              Real JavaScript, Python, HTML, and CSS with a few pieces missing. Drag the right
              block into place and watch it resolve — Debug the Worm coaches every drop.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={goToPlay}
                className="flex items-center gap-2 rounded-md border-none bg-accent px-7 py-3 font-sans text-sm font-bold text-white shadow-[var(--shadow-accent)] outline-none transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-accent-hover)]"
              >
                <Play className="h-4 w-4" fill="currentColor" />
                Start Playing
              </button>

              <button
                onClick={() => document.getElementById("courses-section")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2 rounded-md border border-border bg-panel px-5 py-3 font-sans text-sm text-text outline-none transition-colors duration-150 hover:border-accent hover:bg-line-hover"
              >
                Browse courses
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] border border-border bg-bg">
            <div className="pointer-events-none absolute left-3 top-3 z-10 font-mono text-[10px] text-text-muted">
              {"// click Debug"}
            </div>
            <DebugWormScene />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1100px] box-border px-6 py-[72px] sm:px-12">
        <div className="mb-10">
          <SectionLabel>how it works</SectionLabel>
          <SectionHeading>
            Three steps, <span className="text-accent">every level</span>
          </SectionHeading>
        </div>
        <div className="flex flex-wrap gap-8">
          <div className="min-w-[280px] flex-1 overflow-hidden rounded-[10px] border border-border bg-bg">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-line-hover ${
                  i < STEPS.length - 1 ? "border-b border-border-light" : ""
                }`}
              >
                <span className="w-5 shrink-0 pt-0.5 text-right font-mono text-sm text-line-num">{i + 1}</span>
                <step.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div>
                  <div className="text-sm font-bold text-text">{step.title}</div>
                  <div className="mt-0.5 text-xs leading-relaxed text-text-muted">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="min-w-[240px] flex-1">
            <div className="mb-3 font-mono text-[11px] font-bold uppercase tracking-wide text-text-muted">
              Built with the real thing
            </div>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {FEATURES.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13px] text-text-muted">
                  <Plus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-green" strokeWidth={3} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="courses-section" className="border-t border-border bg-section-alt px-6 py-[72px] sm:px-12">
        <div className="mx-auto w-full max-w-[1100px] box-border">
          <div className="mb-10">
            <SectionLabel>courses</SectionLabel>
            <SectionHeading>
              Pick a language, <span className="text-accent">start dragging</span>
            </SectionHeading>
            <p className="mt-2.5 text-sm leading-relaxed text-text-muted">
              {TRACKS.length} courses, {TOTAL_LEVELS} levels total. Jump into any track, or browse the full
              catalog.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            {TRACKS.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 font-mono text-sm text-accent hover:underline"
            >
              Browse all courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-[72px] sm:px-12">
        <div className="mx-auto flex max-w-[900px] flex-wrap items-center justify-center gap-12">
          <div className="flex shrink-0 flex-col items-center gap-4">
            <WormMascot mood="proud" className="hero-worm h-24 w-24" />
            <div className="font-mono text-xs text-text-muted">Debug the Worm</div>
            <div className="flex gap-4">
              {MOODS.map(({ mood, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <WormMascot mood={mood} className="h-6 w-6" />
                  <span className="text-[10px] text-text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-[260px] flex-1">
            <SectionLabel>meet your coach</SectionLabel>
            <SectionHeading>
              <span className="text-accent">Debug</span> never leaves your side
            </SectionHeading>
            <p className="my-3.5 text-sm leading-relaxed text-text-muted">
              Every action triggers a reaction from Debug. Correct answer? He wiggles with joy. Wrong block? He
              gives you a gentle nudge. Level complete? Pure celebration. All dialogue lives in the right panel —
              the terminal is strictly for system logs.
            </p>
            <div className="flex flex-col gap-2.5">
              {(
                [
                  {
                    mood: "neutral",
                    borderClass: "border-accent",
                    text: '"Drag the return block into the empty slot to complete the function!"',
                  },
                  {
                    mood: "happy",
                    borderClass: "border-accent-green",
                    text: "\"Perfect! a + b adds both parameters! You're getting it!\"",
                  },
                  {
                    mood: "sad",
                    borderClass: "border-accent-red",
                    text: '"Hmm, that\'s not quite right. Try a different block!"',
                  },
                ] as { mood: MascotMood; borderClass: string; text: string }[]
              ).map(({ mood, borderClass, text }) => (
                <div
                  key={text}
                  className={`flex items-start gap-2 rounded-lg border bg-bubble px-3.5 py-2.5 font-mono text-xs leading-relaxed text-text ${borderClass}`}
                >
                  <WormMascot mood={mood} className="mt-0.5 h-4 w-4 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-20 text-center sm:px-12">
        <Trophy className="mx-auto mb-5 h-12 w-12 text-accent" strokeWidth={1.5} />
        <div>
          <SectionHeading>
            Your next level is <span className="text-accent">one drag away</span>
          </SectionHeading>
          <p className="mx-auto my-4 mb-9 max-w-[420px] text-[15px] leading-relaxed text-text-muted">
            {TOTAL_LEVELS} levels across {TRACKS.length} languages — free, no account needed.
          </p>
          <button
            onClick={goToPlay}
            className="inline-flex items-center gap-2 rounded-md border-none bg-accent px-11 py-[15px] font-sans text-base font-bold text-white shadow-[var(--shadow-accent)] outline-none transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-accent-hover)]"
          >
            <Play className="h-4 w-4" fill="currentColor" />
            Launch Theebug
          </button>
        </div>
      </section>
    </div>
  );
}
