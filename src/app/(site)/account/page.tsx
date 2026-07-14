import { Award } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { auth } from "../../../../auth";
import { LeaderboardOptInToggle, SignInButton, SignOutButton } from "@/components/site/account-controls";
import { TrackIcon } from "@/components/site/track-icon";
import { computeBadges } from "@/lib/badges";
import { getUserProgress } from "@/lib/progress-db";
import { TRACKS } from "@/lib/tracks";

export const metadata: Metadata = {
  title: "Account",
  description: "Your Theebug profile and progress.",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="mx-auto w-full max-w-[520px] box-border px-6 py-24 text-center">
        <div className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
          {"// account"}
        </div>
        <h1 className="text-display m-0 mb-3 text-[clamp(24px,4vw,32px)] text-text">You&apos;re not signed in</h1>
        <p className="mb-6 text-sm text-text-muted">
          Sign in with GitHub to sync your progress across devices and appear on the leaderboard.
        </p>
        <SignInButton />
      </div>
    );
  }

  const progress = await getUserProgress(session.user.id);
  const badges = computeBadges(progress, TRACKS.filter((t) => !t.comingSoon));

  return (
    <div className="mx-auto w-full max-w-[760px] box-border px-6 sm:px-12 py-16">
      <div className="mb-10 flex items-center gap-4">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-full border border-border"
          />
        )}
        <div>
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
            {"// account"}
          </div>
          <h1 className="text-display m-0 text-[clamp(22px,4vw,30px)] text-text">{session.user.name}</h1>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-3">
        {TRACKS.filter((t) => !t.comingSoon).map((track) => {
          const trackProgress = progress[track.id];
          const completed = trackProgress?.completedLevels.length ?? 0;
          return (
            <div
              key={track.id}
              className="flex items-center gap-3 rounded-[10px] border border-border bg-panel p-4"
            >
              <TrackIcon trackId={track.id} className="h-5 w-5 shrink-0" style={{ color: track.color }} />
              <div className="flex-1">
                <div className="text-sm font-bold text-text">{track.title}</div>
                <div className="h-[3px] w-full overflow-hidden rounded-sm bg-border">
                  <div
                    className="h-full rounded-sm bg-accent transition-[width] duration-500 ease-out"
                    style={{ width: `${(completed / track.levels.length) * 100}%` }}
                  />
                </div>
              </div>
              <div className="shrink-0 font-mono text-xs text-text-muted">
                {completed}/{track.levels.length}
              </div>
            </div>
          );
        })}
      </div>

      {badges.length > 0 && (
        <div className="mb-8">
          <div className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
            {"// badges"}
          </div>
          <div className="flex flex-col gap-2">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-3 rounded-[10px] border border-border bg-panel p-3"
              >
                <Award className="h-5 w-5 shrink-0 text-accent-yellow" />
                <div>
                  <div className="text-sm font-bold text-text">{badge.label}</div>
                  <div className="text-xs text-text-muted">{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <LeaderboardOptInToggle initialOptIn={session.user.leaderboardOptIn} />
      </div>

      <SignOutButton />
    </div>
  );
}
