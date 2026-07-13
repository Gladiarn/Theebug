import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { optIn?: boolean };
  if (typeof body.optIn !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const client = await clientPromise;
  await client
    .db()
    .collection("users")
    .updateOne({ _id: new ObjectId(session.user.id) }, { $set: { leaderboardOptIn: body.optIn } });

  return NextResponse.json({ ok: true });
}
