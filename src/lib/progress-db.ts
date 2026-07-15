import "server-only";

import clientPromise from "@/lib/mongodb";
import { pickHigherScoreProgress } from "@/lib/progress-merge";
import type { ProgressMap, TrackProgress } from "@/lib/progress-store";

interface ProgressDoc extends TrackProgress {
  userId: string;
  trackId: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string | null;
  image: string | null;
  totalScore: number;
  totalCompleted: number;
  totalTimeMs: number;
}

async function progressCollection() {
  const client = await clientPromise;
  const collection = client.db().collection<ProgressDoc>("progress");
  await collection.createIndex({ userId: 1, trackId: 1 }, { unique: true });
  return collection;
}

export async function getUserProgress(userId: string): Promise<ProgressMap> {
  const collection = await progressCollection();
  const docs = await collection.find({ userId }).toArray();
  return Object.fromEntries(
    docs.map(({ trackId, completedLevels, score, lastLevelIndex, updatedAt, totalTimeMs, levelStats }) => [
      trackId,
      { completedLevels, score, lastLevelIndex, updatedAt, totalTimeMs, levelStats },
    ]),
  );
}

export async function getUserTrackProgress(userId: string, trackId: string): Promise<TrackProgress | null> {
  const collection = await progressCollection();
  const doc = await collection.findOne({ userId, trackId });
  if (!doc) return null;
  const { completedLevels, score, lastLevelIndex, updatedAt, totalTimeMs, levelStats } = doc;
  return { completedLevels, score, lastLevelIndex, updatedAt, totalTimeMs, levelStats };
}

export async function upsertTrackProgress(userId: string, trackId: string, progress: TrackProgress): Promise<void> {
  const collection = await progressCollection();
  await collection.updateOne({ userId, trackId }, { $set: { ...progress, userId, trackId } }, { upsert: true });
}

// Merge a client's localStorage progress into the DB on first sign-in. Per track, keep
// whichever side has the higher score (see pickHigherScoreProgress in progress-merge.ts).
export async function mergeLocalProgress(userId: string, localProgress: ProgressMap): Promise<void> {
  const collection = await progressCollection();
  const existing = await getUserProgress(userId);

  const ops = Object.entries(localProgress).map(([trackId, local]) => {
    const current = existing[trackId];
    const winner = pickHigherScoreProgress(local, current);
    return {
      updateOne: {
        filter: { userId, trackId },
        update: { $set: { ...winner, userId, trackId } },
        upsert: true,
      },
    };
  });

  if (ops.length > 0) await collection.bulkWrite(ops);
}

// Public leaderboard: only users who opted in (users.leaderboardOptIn), ranked by total score
// summed across all tracks. The $lookup filters out non-opted-in users itself (pipeline $match +
// the subsequent $unwind drops any progress doc whose user doesn't match), so no separate
// post-filter is needed.
export async function getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  const collection = await progressCollection();
  const rows = await collection
    .aggregate<{
      _id: string;
      totalScore: number;
      totalCompleted: number;
      totalTimeMs: number;
      user: { name?: string; image?: string };
    }>([
      {
        $group: {
          _id: "$userId",
          totalScore: { $sum: "$score" },
          totalCompleted: { $sum: { $size: "$completedLevels" } },
          // $sum treats a missing/undefined field as 0 — progress saved before this field
          // existed just contributes nothing, no migration needed for a tiebreaker this minor.
          totalTimeMs: { $sum: "$totalTimeMs" },
        },
      },
      {
        $lookup: {
          from: "users",
          let: { uid: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", { $toObjectId: "$$uid" }] }, leaderboardOptIn: true } },
            { $project: { name: 1, image: 1 } },
          ],
          as: "user",
        },
      },
      { $unwind: "$user" },
      // Higher score wins; a tied score is broken by whoever's cumulative completion time is
      // lower (faster). Real ties across two different users' total time are vanishingly
      // unlikely at ms precision, but any residual tie just falls back to Mongo's natural order.
      { $sort: { totalScore: -1, totalTimeMs: 1 } },
      { $limit: limit },
    ])
    .toArray();

  return rows.map((row) => ({
    userId: row._id,
    name: row.user.name ?? null,
    image: row.user.image ?? null,
    totalScore: row.totalScore,
    totalCompleted: row.totalCompleted,
    totalTimeMs: row.totalTimeMs,
  }));
}
