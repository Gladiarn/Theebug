import { ArrowLeft, Play } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LevelCard } from "@/components/site/level-card";
import { TrackIcon } from "@/components/site/track-icon";
import { getTrack, TRACKS, type Difficulty, type Level } from "@/lib/tracks";

const CATEGORIES: { difficulty: Difficulty; label: string; dotClass: string }[] = [
  { difficulty: "easy", label: "Beginner", dotClass: "bg-accent-green" },
  { difficulty: "medium", label: "Intermediate", dotClass: "bg-accent-yellow" },
  { difficulty: "hard", label: "Advanced", dotClass: "bg-accent-red" },
];

export function generateStaticParams() {
  return TRACKS.filter((t) => !t.comingSoon).map((t) => ({ track: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string }>;
}): Promise<Metadata> {
  const { track } = await params;
  const t = getTrack(track);
  return { title: t ? t.title : "Course not found" };
}

export default async function TrackSyllabusPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  const t = getTrack(track);
  if (!t || t.comingSoon) notFound();

  const byDifficulty = new Map<Difficulty, Level[]>();
  for (const level of t.levels) {
    const bucket = byDifficulty.get(level.difficulty) ?? [];
    bucket.push(level);
    byDifficulty.set(level.difficulty, bucket);
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] box-border px-6 sm:px-12 py-16">
      <Link
        href="/learn"
        className="mb-6 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted transition-colors duration-150 hover:text-accent"
      >
        <ArrowLeft className="h-3 w-3" />
        Browse more courses
      </Link>
      <div className="mb-10">
        <TrackIcon trackId={t.id} className="mb-3 h-9 w-9" style={{ color: t.color }} />
        <h1 className="text-display m-0 mb-2 text-[clamp(28px,4vw,44px)] text-text">{t.title}</h1>
        <p className="max-w-[520px] text-sm leading-relaxed text-text-muted">{t.description}</p>
        <Link
          href={`/play/${t.id}`}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-2.5 font-sans text-sm font-bold text-white transition-transform duration-150 hover:-translate-y-0.5"
        >
          <Play className="h-4 w-4" fill="currentColor" />
          Start Course
        </Link>
      </div>

      <div className="flex flex-col gap-10">
        {CATEGORIES.map(({ difficulty, label, dotClass }) => {
          const levels = byDifficulty.get(difficulty);
          if (!levels || levels.length === 0) return null;
          return (
            <div key={difficulty}>
              <div className="mb-4 flex items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`} />
                <h2 className="m-0 font-mono text-sm font-bold uppercase tracking-wide text-text">{label}</h2>
                <span className="font-mono text-xs text-text-muted">
                  {levels.length} level{levels.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
                {levels.map((level) => (
                  <LevelCard key={level.id} level={level} trackId={t.id} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
