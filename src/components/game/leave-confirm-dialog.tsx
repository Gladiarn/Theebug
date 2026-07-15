"use client";

import { TriangleAlert } from "lucide-react";
import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Same accessible-dialog shape as LevelCompleteModal (focus-trap, Escape-to-dismiss, restore
// focus on close) — but unlike that modal, this one defaults focus onto the *safe* action
// (Stay) rather than the dialog container, since a mis-timed Enter here would discard progress.
export function LeaveConfirmDialog({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stayButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    stayButtonRef.current?.focus();
    return () => previouslyFocusedRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
        return;
      }
      if (e.key !== "Tab" || !containerRef.current) return;
      const focusables = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Leave level"
    >
      <div className="w-full max-w-sm rounded-lg border border-border bg-panel text-text shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border bg-badge-bg px-4 py-3">
          <TriangleAlert size={16} className="shrink-0 text-accent-yellow" />
          <span className="font-mono text-sm font-bold text-text">Leave this level?</span>
        </div>

        <div className="px-4 py-4 text-sm leading-relaxed text-text-muted">
          This attempt hasn&apos;t been completed yet, so it won&apos;t be saved unless you
          finish it first.
        </div>

        <div className="flex gap-2 border-t border-border px-4 py-3">
          <button
            ref={stayButtonRef}
            onClick={onCancel}
            className="flex-1 cursor-pointer rounded border border-accent bg-bg py-2 font-mono text-[13px] text-text transition-colors hover:bg-badge-bg"
          >
            Stay and finish
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded border border-border bg-bg py-2 font-mono text-[13px] text-accent-red transition-colors hover:bg-badge-bg"
          >
            Leave anyway
          </button>
        </div>
      </div>
    </div>
  );
}
