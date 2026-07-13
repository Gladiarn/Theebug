import Link from "next/link";

const LINK_GROUPS = [
  {
    key: "learn",
    links: [
      { href: "/learn", label: "Learn" },
      { href: "/docs", label: "Docs" },
    ],
  },
  {
    key: "company",
    links: [
      { href: "/about", label: "About" },
      { href: "/faq", label: "FAQ" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-10 sm:px-12">
      <div className="mx-auto max-w-[1100px]">
        <div className="overflow-hidden rounded-[10px] border border-border bg-bg font-mono text-xs">
          <div className="flex items-center gap-1.5 border-b border-border bg-panel px-3.5 py-2.5">
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <div key={c} className="h-[9px] w-[9px] rounded-full" style={{ background: c }} />
            ))}
            <span className="flex-1 text-center text-[11px] text-text-muted">manifest.json</span>
          </div>

          <div className="px-5 py-4 leading-[1.9] text-text-muted">
            <div>
              <span className="text-code-plain">{"{"}</span>
            </div>
            <div className="pl-4">
              <span className="text-code-string">&quot;product&quot;</span>
              <span className="text-code-plain">: </span>
              <span className="text-code-string">&quot;Code Canvas&quot;</span>
              <span className="text-code-plain">,</span>
            </div>

            {LINK_GROUPS.map((group) => (
              <div key={group.key} className="pl-4">
                <span className="text-code-string">&quot;{group.key}&quot;</span>
                <span className="text-code-plain">: [</span>
                {group.links.map((link, i) => (
                  <span key={link.href}>
                    <Link href={link.href} className="text-accent hover:underline">
                      &quot;{link.label}&quot;
                    </Link>
                    {i < group.links.length - 1 && <span className="text-code-plain">, </span>}
                  </span>
                ))}
                <span className="text-code-plain">],</span>
              </div>
            ))}

            <div className="pl-4">
              <span className="text-code-string">&quot;stack&quot;</span>
              <span className="text-code-plain">: </span>
              <span className="text-code-string">&quot;React + react-dnd, VS Code Dark+/Light+&quot;</span>
            </div>
            <div>
              <span className="text-code-plain">{"}"}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
