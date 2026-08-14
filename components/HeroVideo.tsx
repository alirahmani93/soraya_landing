"use client";

export default function HeroVideo({
  eyebrow,
  lines,
}: {
  eyebrow: string;
  lines: string[];
}) {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden bg-ink px-6 pb-24 pt-32 text-paper sm:px-10">
      <video
        src="/videos/soraya-hero.mp4"
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
        aria-hidden
        poster="/images/saffron-field.jpg"
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
      />
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-cover bg-center motion-reduce:block"
        style={{ backgroundImage: "url(/images/saffron-field.jpg)" }}
      />

      <div className="pointer-events-none absolute inset-0 bg-saffron/20 mix-blend-soft-light" />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 62% 12%, rgba(227,162,28,0.34), rgba(227,162,28,0.06) 46%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(110% 80% at 50% 45%, transparent 40%, rgba(36,28,23,0.72) 100%), linear-gradient(to top, rgba(36,28,23,0.82) 0%, rgba(36,28,23,0.28) 32%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
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
