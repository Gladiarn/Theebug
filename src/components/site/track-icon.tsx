import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import { SiCss, SiHtml5, SiJavascript, SiPython, SiReact } from "react-icons/si";

const TRACK_ICONS: Record<string, IconType> = {
  javascript: SiJavascript,
  python: SiPython,
  html: SiHtml5,
  css: SiCss,
  react: SiReact,
};

export function TrackIcon({ trackId, className, style }: { trackId: string; className?: string; style?: CSSProperties }) {
  const Icon = TRACK_ICONS[trackId] ?? SiJavascript;
  return <Icon className={className} style={style} />;
}
