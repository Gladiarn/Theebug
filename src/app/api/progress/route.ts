import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { getUserProgress, upsertTrackProgress } from "@/lib/progress-db";
import { getTrack } from "@/lib/tracks";
import type { TrackProgress } from "@/lib/progress-store";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const progress = await getUserProgress(session.user.id);
  return NextResponse.json(progress);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { trackId?: string; progress?: TrackProgress };
  const { trackId, progress } = body;

  if (!trackId || !getTrack(trackId) || !progress) {
    return NextResponse.json({ error: "Invalid track or progress payload" }, { status: 400 });
  }
  if (
    !Array.isArray(progress.completedLevels) ||
    typeof progress.score !== "number" ||
    typeof progress.lastLevelIndex !== "number" ||
    typeof progress.updatedAt !== "string"
  ) {
    return NextResponse.json({ error: "Invalid progress payload" }, { status: 400 });
  }

  await upsertTrackProgress(session.user.id, trackId, progress);
  return NextResponse.json({ ok: true });
}
