import { cssReference } from "./css";
import { htmlReference } from "./html";
import { javascriptReference } from "./javascript";
import type { TrackReference } from "./types";

export type { ReferenceSection, TrackReference } from "./types";

export const REFERENCES: TrackReference[] = [javascriptReference, htmlReference, cssReference];

const REFERENCES_BY_TRACK: Record<string, TrackReference> = Object.fromEntries(
  REFERENCES.map((r) => [r.trackId, r]),
);

export function getReference(trackId: string): TrackReference | undefined {
  return REFERENCES_BY_TRACK[trackId];
}
