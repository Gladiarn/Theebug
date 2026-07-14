import type { WormMood } from "@/lib/game-context";

// Wider than the in-game WormMood union — "proud" is a presentation-only expression used
// outside gameplay (e.g. the landing page's "meet your coach" hero), not a real game state.
export type MascotMood = WormMood | "proud";

// The head (antennae + skull + face) moves as one rigid group so mood-specific posture reads
// clearly: "sad" hangs/tilts the head down like a disappointed bow, "celebrating" offsets it
// sideways to zigzag against the shifted mid-segment below for a wiggling-dance look.
function headTransform(mood: MascotMood): string | undefined {
  if (mood === "sad") return "translate(-4 9) rotate(-16 50 45)";
  if (mood === "celebrating") return "translate(4 1) rotate(6 50 45)";
  return undefined;
}

function LowerBody({ mood }: { mood: MascotMood }) {
  const midX = mood === "celebrating" ? 42 : 50;
  return (
    <>
      <path d="M28 84 L21 91" className="stroke-accent" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 89 L31 96" className="stroke-accent" strokeWidth="3" strokeLinecap="round" />
      <path d="M64 89 L69 96" className="stroke-accent" strokeWidth="3" strokeLinecap="round" />
      <path d="M72 84 L79 91" className="stroke-accent" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="50" cy="76" rx="25" ry="19" className="fill-accent" />
      <circle cx={midX} cy="51" r="19" className="fill-accent" />
      {mood === "proud" && (
        <>
          <path d="M35 47 L58 58" className="stroke-accent" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M65 47 L42 58" className="stroke-accent" strokeWidth="4.5" strokeLinecap="round" />
        </>
      )}
    </>
  );
}

function Antennae({ mood }: { mood: MascotMood }) {
  if (mood === "sad") {
    return (
      <>
        <path d="M38 13 C 33 18, 30 24, 31 29" className="stroke-accent" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <circle cx="31.3" cy="29.5" r="2.1" className="fill-accent" />
        <path d="M62 13 C 67 18, 70 24, 69 29" className="stroke-accent" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <circle cx="68.7" cy="29.5" r="2.1" className="fill-accent" />
      </>
    );
  }
  if (mood === "celebrating") {
    return (
      <>
        <path d="M40 12 C 34 2, 26 -2, 19 1" className="stroke-accent" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <circle cx="18.4" cy="1.4" r="2.3" className="fill-accent-yellow" />
        <path d="M60 12 C 66 2, 74 -2, 81 1" className="stroke-accent" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <circle cx="81.6" cy="1.4" r="2.3" className="fill-accent-yellow" />
      </>
    );
  }
  if (mood === "proud") {
    return (
      <>
        <path d="M40 12 C 38 3, 35 -4, 30 -8" className="stroke-accent" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <circle cx="29.3" cy="-8.4" r="2.1" className="fill-accent" />
        <path d="M60 12 C 62 3, 65 -4, 70 -8" className="stroke-accent" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <circle cx="70.7" cy="-8.4" r="2.1" className="fill-accent" />
      </>
    );
  }
  return (
    <>
      <path d="M39 11 C 36 4, 31 -1, 25 -2" className="stroke-accent" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <circle cx="24.4" cy="-2.2" r="2.1" className="fill-accent" />
      <path d="M61 11 C 64 4, 69 -1, 75 -2" className="stroke-accent" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      <circle cx="75.6" cy="-2.2" r="2.1" className="fill-accent" />
    </>
  );
}

function Face({ mood }: { mood: MascotMood }) {
  const dark = "#1e1e1e";

  if (mood === "happy") {
    return (
      <>
        <circle cx="43" cy="25" r="2.6" fill={dark} />
        <circle cx="57" cy="25" r="2.6" fill={dark} />
        <path d="M41 31 Q50 40 59 31" stroke={dark} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      </>
    );
  }
  if (mood === "sad") {
    return (
      <>
        <path d="M39 21 L45 23.5" stroke={dark} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M61 21 L55 23.5" stroke={dark} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="43.5" cy="27" r="2.3" fill={dark} />
        <circle cx="56.5" cy="27" r="2.3" fill={dark} />
        <path d="M43 36 Q50 30 57 36" stroke={dark} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </>
    );
  }
  if (mood === "celebrating") {
    return (
      <>
        <path d="M39 25 Q43 21 47 25" stroke={dark} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M53 25 Q57 21 61 25" stroke={dark} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <ellipse cx="50" cy="34" rx="6.5" ry="5" fill={dark} />
        <path d="M14 20 L17 23 M14 27 L18 26" className="stroke-accent-yellow" strokeWidth="2" strokeLinecap="round" />
        <path d="M86 20 L83 23 M86 27 L82 26" className="stroke-accent-yellow" strokeWidth="2" strokeLinecap="round" />
      </>
    );
  }
  if (mood === "proud") {
    return (
      <>
        <path d="M38 19.5 L45 21.5" stroke={dark} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M62 19.5 L55 21.5" stroke={dark} strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="43" cy="25.5" rx="2.8" ry="1.1" fill={dark} transform="rotate(-6 43 25.5)" />
        <ellipse cx="57" cy="25.5" rx="2.8" ry="1.1" fill={dark} transform="rotate(6 57 25.5)" />
        <path d="M42 32 Q48 34.5 58 29" stroke={dark} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </>
    );
  }
  return (
    <>
      <circle cx="43" cy="25" r="2.4" fill={dark} />
      <circle cx="57" cy="25" r="2.4" fill={dark} />
      <path d="M44 33 Q50 35.5 56 33" stroke={dark} strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  );
}

function Head({ mood }: { mood: MascotMood }) {
  return (
    <g transform={headTransform(mood)}>
      <Antennae mood={mood} />
      <circle cx="50" cy="27" r="18" className="fill-accent" />
      <Face mood={mood} />
    </g>
  );
}

export function WormMascot({ mood, className }: { mood: MascotMood; className?: string }) {
  return (
    <svg viewBox="0 -12 100 108" className={className} aria-hidden>
      <LowerBody mood={mood} />
      <Head mood={mood} />
    </svg>
  );
}
