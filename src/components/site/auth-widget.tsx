"use client";

import { Github, LogOut, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function AuthWidget() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  if (status === "loading") {
    return <div className="h-6 w-6 shrink-0 rounded-full border border-border" aria-hidden />;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("github")}
        title="Sign in with GitHub"
        className="flex items-center gap-1.5 rounded border border-border px-2 py-1 text-[11px] outline-none transition-colors hover:border-accent"
      >
        <Github className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Sign in</span>
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title={session.user.name ?? "Account"}
        className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border outline-none transition-colors hover:border-accent"
      >
        {session.user.image ? (
          <Image src={session.user.image} alt="" width={24} height={24} className="h-full w-full object-cover" />
        ) : (
          <User className="h-3.5 w-3.5" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-44 overflow-hidden rounded border border-border bg-panel text-xs shadow-[var(--shadow-accent)]">
          <div className="truncate border-b border-border px-3 py-2 text-text-muted">{session.user.name}</div>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-text hover:bg-line-hover"
          >
            <User className="h-3.5 w-3.5" /> Account
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-text hover:bg-line-hover"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
