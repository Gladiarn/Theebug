import { Gauge, Rocket, Smartphone, Sparkles, Trophy, Users } from "lucide-react";
import type { Metadata } from "next";
import type { ComponentType } from "react";

export const metadata: Metadata = {
  title: "Updates",
  description: "What's shipped on Theebug, release by release.",
};

interface Release {
  version: string;
  date: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  items: string[];
}

// Real release history, grounded in what actually shipped (see plan.md/upgrade-plan.md at the
// repo root for the full engineering write-up) — no invented features, no fake dates.
const RELEASES: Release[] = [
  {
    version: "v0.5",
    date: "In progress",
    title: "A more inviting site",
    icon: Sparkles,
    items: [
      "New landing page sections: a stats bar, a \"why Theebug\" comparison, and an FAQ preview",
      "A completely reworked About page — visual pillars instead of a wall of text",
      "Gold / silver / bronze styling for the top 3 leaderboard spots",
      "This page.",
    ],
  },
  {
    version: "v0.4",
    date: "2026-07-15",
    title: "Mobile, discoverability, and a smarter scoring system",
    icon: Smartphone,
    items: [
      "Full mobile support for both the docs pages and the gameplay screen — off-canvas panels, a real touch-friendly layout",
      "Difficulty-weighted scoring (hard levels are worth more than easy ones) plus a millisecond-precision leaderboard tiebreaker",
      "The terminal panel is now genuinely functional: real Problems / Output / Debug Console tabs and a resizable height",
      "Open Graph previews, structured data, and a real sitemap so the site is actually findable",
    ],
  },
  {
    version: "v0.3",
    date: "2026-07-15",
    title: "Polish, performance, and going live",
    icon: Gauge,
    items: [
      "Fixed a bundle-size issue that was shipping ~880KB of unused 3D-library JS to every page",
      "Fixed the docs sidebar's scroll-tracking, which could highlight the wrong section while scrolling",
      "A custom domain, a real README, and a professional custom scrollbar",
    ],
  },
  {
    version: "v0.2",
    date: "2026-07-14",
    title: "Accounts, depth, and a reward for finishing",
    icon: Trophy,
    items: [
      "Optional GitHub sign-in with cross-device progress sync, plus an opt-in public leaderboard",
      "A whole second language track (Python), and deep reference docs for JavaScript",
      "Mistakes and a timer now actually affect scoring, instead of every clean run scoring the same",
      "A level-complete reward screen with a star rating and a short recap of what you just learned",
      "Levels grouped into Beginner / Intermediate / Advanced, with more added to every track",
    ],
  },
  {
    version: "v0.1",
    date: "2026-06-10",
    title: "From Figma to a real app",
    icon: Rocket,
    items: [
      "Rebuilt from a static design export into a real Next.js app",
      "The core loop: real code with pieces missing, drag the right block, get instant feedback",
      "JavaScript, HTML, and CSS tracks with anonymous, browser-saved progress",
    ],
  },
];

function ReleaseIcon({ Icon }: { Icon: ComponentType<{ className?: string }> }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-bg">
      <Icon className="h-4 w-4 text-accent" />
    </div>
  );
}

export default function UpdatesPage() {
  return (
    <div className="mx-auto w-full max-w-[720px] box-border px-6 sm:px-12 py-16">
      <div className="mb-12 text-center">
        <div className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
          {"// updates"}
        </div>
        <h1 className="text-display m-0 mb-3 text-[clamp(28px,4vw,44px)] text-text">What&apos;s new</h1>
        <p className="mx-auto max-w-[440px] text-sm leading-relaxed text-text-muted">
          A running history of what&apos;s shipped, release by release — newest first.
        </p>
      </div>

      <div className="relative flex flex-col gap-10">
        <div className="absolute bottom-4 left-[17px] top-4 w-px bg-border" aria-hidden />
        {RELEASES.map((release) => (
          <div key={release.version} className="relative flex gap-4">
            <ReleaseIcon Icon={release.icon} />
            <div className="min-w-0 flex-1 pt-1">
              <div className="mb-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="rounded-full border border-accent bg-badge-bg px-2 py-0.5 font-mono text-[11px] font-bold text-accent">
                  {release.version}
                </span>
                <span className="text-sm font-bold text-text">{release.title}</span>
                <span className="font-mono text-[11px] text-text-muted">{release.date}</span>
              </div>
              <ul className="m-0 mt-2.5 flex list-none flex-col gap-1.5 p-0">
                {release.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] leading-relaxed text-text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex items-center justify-center gap-2 text-center font-mono text-xs text-text-muted">
        <Users className="h-3.5 w-3.5" />
        Built in the open, one release at a time.
      </div>
    </div>
  );
}
