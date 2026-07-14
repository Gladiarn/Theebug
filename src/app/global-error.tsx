"use client";

import { useEffect } from "react";

// This replaces the ENTIRE root layout when the layout itself throws, so it can't rely on
// ThemeProvider, fonts, or globals.css context being intact — inline styles only, hardcoded
// dark-theme colors matching the brand, no dependency on anything that might be what broke.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "24px",
          textAlign: "center",
          background: "#1e1e1e",
          color: "#d4d4d4",
          fontFamily: "ui-monospace, 'JetBrains Mono', Consolas, monospace",
        }}
      >
        <div style={{ fontSize: "48px", lineHeight: 1 }}>🐛</div>
        <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>Theebug hit a critical error</h1>
        <p style={{ maxWidth: "420px", fontSize: "14px", lineHeight: 1.6, color: "#9d9d9d" }}>
          Something broke at the top level. Reloading usually fixes it.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "8px",
            borderRadius: "6px",
            border: "none",
            background: "#007acc",
            color: "#ffffff",
            padding: "10px 24px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
