"use client";

import { useEffect, useRef, useState } from "react";

export const VIDEO_ORIGIN = "https://zdqu7heexgoan44x.public.blob.vercel-storage.com";

const CLIPS = [
  `${VIDEO_ORIGIN}/1-saffron-farm.mp4`,
  `${VIDEO_ORIGIN}/2-saffron-flower.mp4`,
  `${VIDEO_ORIGIN}/3-saffron-tea.mp4`,
];

export default function HeroVideo({
  eyebrow,
  lines,
}: {
  eyebrow: string;
  lines: string[];
}) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const video = refs.current[active];
    if (!video) return;
    for (const [i, other] of refs.current.entries()) {
      if (other && i !== active) other.pause();
    }
    video.currentTime = 0;
    void video.play().catch(() => {});
    const next = refs.current[(active + 1) % CLIPS.length];
    if (next) next.preload = "auto";
  }, [active]);

  return (
    <section className="relative flex min-h-screen items-end overflow-hidden bg-ink px-6 pb-24 pt-32 text-paper sm:px-10">
      {CLIPS.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          src={src}
          muted
          playsInline
          preload={i === 0 ? "auto" : "none"}
          aria-hidden
          poster="/images/saffron-field.jpg"
          onEnded={() => setActive((n) => (n === i ? (n + 1) % CLIPS.length : n))}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:hidden ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-cover bg-center motion-reduce:block"
        style={{ backgroundImage: "url(/images/saffron-field.jpg)" }}
      />

      <div className="pointer-events-none absolute inset-0 bg-ink/45" />
      <div className="pointer-events-none absolute inset-0 bg-saffron/20 mix-blend-soft-light" />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 62% 12%, rgba(227,162,28,0.28), rgba(227,162,28,0.05) 46%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(110% 80% at 50% 45%, transparent 30%, rgba(36,28,23,0.85) 100%), linear-gradient(to top, rgba(36,28,23,0.94) 0%, rgba(36,28,23,0.6) 34%, rgba(36,28,23,0.18) 62%, transparent 78%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl [text-shadow:0_2px_24px_rgba(36,28,23,0.7)]">
        <p className="text-xs uppercase tracking-[0.3em] text-gold [text-shadow:0_1px_8px_rgba(36,28,23,0.95)]">
          {eyebrow}
        </p>
        <h1 className="display mt-7 text-[clamp(2.6rem,9vw,7rem)] leading-[0.95]">
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
