import { notFound } from "next/navigation";
import { getTrack } from "@/lib/tracks";
import { GameProviderShell } from "@/components/game/game-provider-shell";

export default async function TrackLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  const t = getTrack(track);
  if (!t || t.comingSoon) notFound();

  return <GameProviderShell trackId={track}>{children}</GameProviderShell>;
}
