import { notFound, redirect } from "next/navigation";
import { getTrack } from "@/lib/tracks";

export default async function TrackIndexPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;
  const t = getTrack(track);
  if (!t || t.comingSoon) notFound();
  redirect(`/play/${track}/${t.levels[0].id}`);
}
