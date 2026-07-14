import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Theebug collects, why, and who it's shared with.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-[760px] box-border px-6 sm:px-12 py-16">
      <div className="mb-10 text-center">
        <div className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
          {"// privacy"}
        </div>
        <h1 className="text-display m-0 text-[clamp(28px,4vw,44px)] text-text">Privacy Policy</h1>
      </div>
      <div className="flex flex-col gap-6 text-sm leading-relaxed text-text-muted">
        <p>
          Theebug is a free, personal project — this policy is short because there isn&apos;t much to say.
          You can use every level in <span className="font-bold text-text">/play </span> without an account
          and without anything being sent anywhere beyond your own browser&apos;s local storage.
        </p>
        <p>
          <span className="font-bold text-text">What we collect if you sign in.</span>{" "}
          Signing in uses GitHub OAuth only — no email/password of your own to manage. GitHub shares your public name,
          avatar, and GitHub user ID with us; we store those alongside your level progress (which levels
          you&apos;ve completed, your score) in a MongoDB Atlas database. We don&apos;t see or store your
          GitHub password, and we don&apos;t request access to your repositories, emails, or anything
          beyond basic profile info.
        </p>
        <p>
          <span className="font-bold text-text">Leaderboard.</span>{" "}
          The public leaderboard is opt-in and
          off by default — nothing about you appears on it unless you turn it on yourself from{" "}
          <span className="font-bold text-text">/account</span>. When it&apos;s on, only your display name,
          avatar, and score are shown — the same info already public on your GitHub profile.
        </p>
        <p>
          <span className="font-bold text-text">Who it&apos;s shared with.</span>{" "}
          Nobody. We don&apos;t sell
          data, run ads, or share anything with third parties beyond the infrastructure that makes the site
          work: GitHub (for sign-in) and MongoDB Atlas (for storage), both of which only see what&apos;s
          described above.
        </p>
        <p>
          <span className="font-bold text-text">Cookies.</span>{" "}
          Just one: a session cookie from Auth.js to
          keep you signed in. No tracking or advertising cookies.
        </p>
        <p>
          <span className="font-bold text-text">Deleting your data.</span>{" "}
          Since there&apos;s no account
          dashboard for this yet, email the address in the footer below and we&apos;ll remove your account
          and progress data.
        </p>
        <p>
          Questions about this policy? Reach out via the email or GitHub link in the footer.
        </p>
      </div>
    </div>
  );
}
