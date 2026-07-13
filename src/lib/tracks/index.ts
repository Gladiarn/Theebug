import { cssTrack } from "./css";
import { htmlTrack } from "./html";
import { javascriptTrack } from "./javascript";
import { pythonTrack } from "./python";
import type { Track } from "./types";

export type { Block, Level, Track, ZoneDef } from "./types";

export const TRACKS: Track[] = [javascriptTrack, pythonTrack, htmlTrack, cssTrack];

export const TRACKS_BY_ID: Record<string, Track> = Object.fromEntries(TRACKS.map((t) => [t.id, t]));

export function getTrack(id: string): Track | undefined {
  return TRACKS_BY_ID[id];
}

export function getLevelIndexById(track: Track, levelId: number): number {
  return track.levels.findIndex((l) => l.id === levelId);
}
