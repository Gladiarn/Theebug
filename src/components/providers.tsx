"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ThemeProvider } from "@/lib/theme-context";

// No `session` prop passed in from the root layout on purpose: awaiting `auth()` there would
// force every route in the app out of static generation (the root layout wraps all of them).
// SessionProvider fetches the session client-side instead — a brief loading flash on
// session-dependent UI, same tradeoff already accepted elsewhere in this app for localStorage
// hydration.
export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <DndProvider backend={HTML5Backend}>{children}</DndProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
