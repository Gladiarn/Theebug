import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Why Code Canvas exists and how it teaches by doing.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[760px] box-border px-6 sm:px-12 py-16">
      <div className="mb-10 text-center">
        <div className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
          {"// about"}
        </div>
        <h1 className="text-display m-0 text-[clamp(28px,4vw,44px)] text-text">Why Code Canvas exists</h1>
      </div>
      <div className="flex flex-col gap-6 text-sm leading-relaxed text-text-muted">
        <p>
          Most coding tutorials teach by reading, then ask you to write code on a blank page — the single
          biggest place beginners freeze up. Code Canvas flips that: every level is real, working code with a
          few pieces missing, and your job is to drag the right piece into place.
        </p>
        <p>
          That small shift matters. You&apos;re never staring at an empty editor wondering where to start —
          you&apos;re recognizing patterns, testing hypotheses, and getting instant feedback on every single
          choice. Wrong guesses cost nothing but a second try.
        </p>
        <p>
          <span className="font-bold text-text">Debug the Worm</span> is your coach through all of it. He
          explains each objective in plain English up front, and reacts to every drop — cheering when
          you&apos;re right, gently nudging you back on track when you&apos;re not. He never touches the
          terminal, which stays a clean system log so you can see the difference between the game&apos;s
          console and Debug&apos;s coaching voice.
        </p>
        <p>
          The whole game is styled after VS Code&apos;s Dark+ and Light+ themes on purpose: the moment
          you&apos;re ready to leave the game and open a real editor, everything already looks familiar.
        </p>
      </div>
    </div>
  );
}
