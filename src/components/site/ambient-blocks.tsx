interface Chip {
  code: string;
  top: string;
  left: string;
  float: string;
}

// Sparse and faint on purpose — texture, not decoration. Positions hug the
// edges so they never sit under a headline or a card.
const CHIPS: Chip[] = [
  { code: "let x", top: "10%", left: "5%", float: "float-1" },
  { code: "=>", top: "18%", left: "92%", float: "float-2" },
  { code: ".map()", top: "62%", left: "4%", float: "float-3" },
  { code: "<div>", top: "72%", left: "90%", float: "float-4" },
  { code: "color: teal", top: "40%", left: "96%", float: "float-5" },
];

const ZONES: Chip[] = [
  { code: "______", top: "30%", left: "8%", float: "float-3" },
  { code: "______", top: "85%", left: "94%", float: "float-6" },
];

export function AmbientBlocks() {
  return (
    // No z-index: relies on being the first child wherever it's mounted, so
    // normal stacking order alone keeps it behind everything rendered after
    // it — negative z-index fought unpredictably with ancestors' opaque
    // backgrounds and made the layer invisible in practice.
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {CHIPS.map((chip) => (
        <span
          key={chip.code + chip.top}
          className={`absolute rounded border border-block-border bg-block-bg px-3 py-1 font-mono text-xs text-text opacity-[0.22] ${chip.float}`}
          style={{ top: chip.top, left: chip.left }}
        >
          {chip.code}
        </span>
      ))}
      {ZONES.map((zone) => (
        <span
          key={zone.code + zone.top}
          className={`absolute inline-flex min-w-[64px] justify-center rounded-[3px] border-[1.5px] border-dashed border-drop-empty-border px-2.5 py-1 font-mono text-[11px] tracking-[2px] text-accent opacity-[0.22] ${zone.float}`}
          style={{ top: zone.top, left: zone.left }}
        >
          {zone.code}
        </span>
      ))}
    </div>
  );
}
