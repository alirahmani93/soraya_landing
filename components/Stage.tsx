"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export type StageDrawer = {
  id: string;
  image: string;
  name: string;
  note: string;
  qty: string;
};

/* Scroll budget per drawer: open over RAMP, hold open for HOLD, shut over RAMP, then a
   short GAP with the box closed before the next one starts. Keeping the phases explicit
   is what stops a half-open drawer from ever sitting under a half-faded caption. */
const RAMP = 0.05;
const HOLD = 0.1;
const GAP = 0.02;
const STEP = RAMP + HOLD + RAMP + GAP;
const FIRST = 0.08;
const NEVER = 9;

function schedule(i: number, count: number) {
  const start = FIRST + i * STEP;
  const last = i === count - 1;
  const close = last ? NEVER : start + RAMP + HOLD;
  return { start, close, captionEnd: last ? NEVER : close + RAMP };
}

/* Starts after the last drawer has settled open and completes before the scroll runs
   out (its own ramp is 0.08). */
const FINALE = 0.86;

export default function Stage({
  drawers,
  hint,
  mark,
}: {
  drawers: StageDrawer[];
  hint: string;
  mark: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="stage relative h-[520vh] bg-ink text-paper"
      style={{ "--ramp": RAMP, "--finale": FINALE } as React.CSSProperties}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 sm:px-10 md:grid-cols-[auto_1fr] md:gap-16">
          <div className="scene mx-auto md:mx-0">
            <div className="box3d">
              <div className="face face-back" />
              <div className="face face-left" />
              <div className="face face-right" />
              <div className="face face-top">
                <span className="display lid-mark">{mark}</span>
              </div>
              <div className="face face-bottom" />

              {drawers.map((drawer, i) => (
                <div
                  key={drawer.id}
                  className="drawer3d"
                  style={
                    {
                      "--i": i,
                      "--start": schedule(i, drawers.length).start,
                      "--close": schedule(i, drawers.length).close,
                    } as React.CSSProperties
                  }
                >
                  <div className="face drawer-floor">
                    <Image
                      src={drawer.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 80vw, 38vh"
                      className="object-cover"
                      priority={i === 0}
                    />
                    <div className="drawer-shade absolute inset-0 bg-[#17110d]" />
                  </div>
                  <div className="face drawer-back" />
                  <div className="face drawer-left" />
                  <div className="face drawer-right" />
                  <div className="face drawer-front">
                    <span className="drawer-pull" />
                  </div>
                </div>
              ))}

              <div className="face rim-top" />
              <div className="face rim-bottom" />
            </div>

            <div className="box-shadow-pad" />
          </div>

          <div className="relative min-h-[11rem] md:min-h-[14rem]">
            {drawers.map((drawer, i) => (
              <figure
                key={drawer.id}
                className="caption absolute inset-0"
                style={
                  {
                    "--a": schedule(i, drawers.length).start,
                    "--b": schedule(i, drawers.length).captionEnd,
                  } as React.CSSProperties
                }
              >
                <figcaption>
                  <p className="text-xs uppercase tracking-[0.3em] text-gold">{drawer.qty}</p>
                  <h2 className="display mt-3 text-[clamp(1.8rem,4.5vw,3rem)] leading-tight">
                    {drawer.name}
                  </h2>
                  <p className="mt-4 max-w-sm leading-relaxed text-paper/60">{drawer.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      <p className="scroll-hint pointer-events-none fixed inset-x-0 bottom-8 text-center text-xs uppercase tracking-[0.3em] text-kakuti-pale">
        {hint}
      </p>
    </section>
  );
}
