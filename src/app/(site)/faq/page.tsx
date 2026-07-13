import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { FAQ } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Theebug.",
};

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-[760px] box-border px-6 sm:px-12 py-16">
      <div className="mb-10 text-center">
        <div className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
          {"// faq"}
        </div>
        <h1 className="text-display m-0 text-[clamp(28px,4vw,44px)] text-text">Frequently asked questions</h1>
      </div>
      <div className="flex flex-col gap-3">
        {FAQ.map(({ q, a }) => (
          <details key={q} className="group rounded-[10px] border border-border bg-panel px-5 py-4 open:border-accent">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-text [&::-webkit-details-marker]:hidden">
              {q}
              <Plus
                className="h-4 w-4 shrink-0 text-accent-green transition-transform duration-150 group-open:rotate-45"
                strokeWidth={2.5}
              />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
