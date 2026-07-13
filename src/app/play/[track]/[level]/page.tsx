import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLevelIndexById, getTrack } from "@/lib/tracks";
import { GamePlayShell } from "@/components/game/game-play-shell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string; level: string }>;
}): Promise<Metadata> {
  const { track, level } = await params;
  const t = getTrack(track);
  if (!t) return { title: "Level not found" };
  const idx = getLevelIndexById(t, Number(level));
  const lvl = idx === -1 ? undefined : t.levels[idx];
  return { title: lvl ? `${t.title}: ${lvl.title}` : "Level not found" };
}

export default async function PlayLevelPage({
  params,
}: {
  params: Promise<{ track: string; level: string }>;
}) {
  const { track, level } = await params;
  const t = getTrack(track);
  if (!t || t.comingSoon) notFound();

  const levelId = Number(level);
  if (!Number.isFinite(levelId) || getLevelIndexById(t, levelId) === -1) notFound();

  return <GamePlayShell />;
}
