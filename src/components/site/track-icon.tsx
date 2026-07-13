import { Braces, CodeXml, Palette, type LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";

const TRACK_ICONS: Record<string, LucideIcon> = {
  javascript: Braces,
  html: CodeXml,
  css: Palette,
};

export function TrackIcon({ trackId, className, style }: { trackId: string; className?: string; style?: CSSProperties }) {
  const Icon = TRACK_ICONS[trackId] ?? Braces;
  return <Icon className={className} style={style} />;
}
