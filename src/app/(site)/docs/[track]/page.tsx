import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsTrackView } from "@/components/site/docs-track-view";
import { getReference } from "@/lib/reference";
import { getTrack, TRACKS } from "@/lib/tracks";

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
  return { title: t ? `${t.title} Reference` : "Reference not found" };
}

export default async function DocsTrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  const t = getTrack(track);
  const ref = getReference(track);
  if (!t || t.comingSoon || !ref) notFound();

  return <DocsTrackView track={t} reference={ref} />;
}
