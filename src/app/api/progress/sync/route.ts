import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { getUserProgress, mergeLocalProgress } from "@/lib/progress-db";
import type { ProgressMap } from "@/lib/progress-store";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const localProgress = (await request.json()) as ProgressMap;
  if (typeof localProgress !== "object" || localProgress === null) {
    return NextResponse.json({ error: "Invalid progress payload" }, { status: 400 });
  }

  await mergeLocalProgress(session.user.id, localProgress);
  const merged = await getUserProgress(session.user.id);
  return NextResponse.json(merged);
}
