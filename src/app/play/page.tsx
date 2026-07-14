import { redirect } from "next/navigation";

// No track specified — there's no sensible single default track to jump into, so send
// anonymous "/play" visits to the track picker (/learn) instead of silently always landing on
// JavaScript regardless of what the visitor actually wants to learn.
export default function PlayPage() {
  redirect("/learn");
}
