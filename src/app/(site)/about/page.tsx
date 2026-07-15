import { FileCode2, Monitor, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { WormMascot } from "@/components/game/worm-mascot";

export const metadata: Metadata = {
  title: "About",
  description: "Why Theebug exists and how it teaches by doing.",
};

const PILLARS = [
  {
    icon: FileCode2,
    title: "No blank page",
    body: "Every level is real, working code with just a few pieces missing. You're never staring at an empty editor wondering where to start — you're recognizing patterns and completing something real.",
  },
  {
    icon: Zap,
    title: "Instant feedback",
    body: "Every block you drag is checked the moment it lands. Right or wrong, you know immediately — wrong guesses cost nothing but a second try, not a broken build hours later.",
  },
  {
    icon: Monitor,
    title: "Feels like the real thing",
    body: "The whole game is styled after VS Code's Dark+ and Light+ themes on purpose — the moment you're ready to open a real editor, everything already looks familiar.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[900px] box-border px-6 sm:px-12 py-16">
      <div className="mb-12 max-w-[620px]">
        <div className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
          {"// about"}
        </div>
        <h1 className="text-display m-0 mb-4 text-[clamp(28px,4vw,44px)] text-text">
          Built for people who learn by <span className="text-accent text-accent-emphasis">doing</span>
        </h1>
        <p className="text-sm leading-relaxed text-text-muted">
          Most coding tutorials teach by reading, then ask you to write code on a blank page — the
          single biggest place beginners freeze up. Theebug flips that: your job is to drag the
          right piece into place, not invent one from nothing.
        </p>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PILLARS.map((pillar) => (
          <div key={pillar.title} className="rounded-[10px] border border-border bg-panel p-5">
            <pillar.icon className="mb-3 h-6 w-6 text-accent" strokeWidth={1.75} />
            <div className="mb-1.5 text-sm font-bold text-text">{pillar.title}</div>
            <p className="m-0 text-[13px] leading-relaxed text-text-muted">{pillar.body}</p>
          </div>
        ))}
      </div>

      <div className="mb-12 flex flex-wrap items-center gap-6 rounded-[10px] border border-border bg-bg p-6">
        <WormMascot mood="proud" className="h-16 w-16 shrink-0" />
        <div className="min-w-[240px] flex-1">
          <div className="mb-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-accent">
            Meet your coach
          </div>
          <p className="m-0 text-sm leading-relaxed text-text-muted">
            <span className="font-bold text-text">Debug the Worm</span>{" "}
            explains each objective in plain English up front, then reacts to every drop —
            cheering when you&apos;re right,
            gently nudging you back on track when you&apos;re not. He never touches the terminal,
            which stays a clean system log so you can always tell the difference between the
            game&apos;s console and Debug&apos;s coaching voice.
          </p>
        </div>
      </div>

      <div className="rounded-[10px] border border-accent bg-bg p-6 text-center shadow-[var(--shadow-accent)]">
        <div className="mb-1.5 text-base font-bold text-text">Ready to try it?</div>
        <p className="mx-auto mb-4 max-w-[420px] text-[13px] leading-relaxed text-text-muted">
          No account needed — pick a language and start dragging.
        </p>
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 rounded-md border-none bg-accent px-6 py-2.5 font-sans text-sm font-bold text-white shadow-[var(--shadow-accent)] outline-none transition-transform duration-150 hover:-translate-y-0.5"
        >
          Browse courses
        </Link>
      </div>
    </div>
  );
}
