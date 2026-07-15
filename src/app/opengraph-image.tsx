import { ImageResponse } from "next/og";

export const alt = "Theebug — Learn to Code by Doing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Reuses LogoMark's exact SVG markup (src/components/site/logo-mark.tsx) — fixed brand colors,
// not the app's CSS variables, since ImageResponse renders in an isolated context with no access
// to globals.css.
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e1e1e",
          fontFamily: "monospace",
        }}
      >
        <svg width="140" height="140" viewBox="0 0 64 64" fill="none">
          <rect x="1" y="1" width="62" height="62" rx="15" fill="#1e1e1e" stroke="#4ec9b0" strokeOpacity="0.25" strokeWidth="1.5" />
          <path d="M40 21 C 43 15, 48 13, 51 15" stroke="#4ec9b0" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <circle cx="51.4" cy="14.6" r="2" fill="#4ec9b0" />
          <path d="M35 17 C 35 10, 38 6, 43 5" stroke="#4ec9b0" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <circle cx="43.4" cy="4.8" r="2" fill="#4ec9b0" />
          <circle cx="20" cy="46" r="10.5" fill="#4ec9b0" />
          <circle cx="33.5" cy="37" r="9" fill="#4ec9b0" />
          <circle cx="43.5" cy="24.5" r="8" fill="#4ec9b0" />
          <path d="M14 51 L 8 55" stroke="#4ec9b0" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 54 L 12 59" stroke="#4ec9b0" strokeWidth="2" strokeLinecap="round" />
          <path d="M27 43 L 23 49" stroke="#4ec9b0" strokeWidth="2" strokeLinecap="round" />
          <circle cx="40.5" cy="22" r="1.9" fill="#1e1e1e" />
          <circle cx="46.5" cy="23.5" r="1.9" fill="#1e1e1e" />
          <path d="M41.5 27.5 Q 44 29.5, 46.5 27.5" stroke="#1e1e1e" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </svg>
        <div style={{ display: "flex", fontSize: 80, fontWeight: 700, color: "#ffffff", marginTop: 28 }}>
          Thee<span style={{ color: "#4ec9b0" }}>bug</span>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#9d9d9d", marginTop: 16 }}>
          Learn to code by fixing it, not writing it from scratch.
        </div>
      </div>
    ),
    { ...size },
  );
}
