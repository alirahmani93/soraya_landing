"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { StageDrawer } from "./Stage";

/** The first hero: drawers as flat photographic bands sliding sideways out of a 2D
 *  board. Kept for comparison against the 3D box — reachable at ?hero=flat. */

const FIRST = 0.1;
const STEP = 0.18;

export default function StageFlat({ drawers, hint }: { drawers: StageDrawer[]; hint: string }) {
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
    <section ref={ref} className="stage stage-flat relative h-[420vh] bg-ink text-paper">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-[min(96%,74vh)]">
          <div className="flat-body relative flex aspect-[2/3] w-[60%] flex-col gap-[2%] rounded-[3px] bg-gradient-to-b from-paper via-paper-deep to-[#d8cab2] p-[4%] shadow-[0_70px_140px_-30px_rgba(0,0,0,0.95)] sm:aspect-[5/6]">
            {drawers.map((drawer, i) => (
              <div
                key={drawer.id}
                className="relative flex-1 rounded-[2px] bg-[#100c09] shadow-[inset_0_3px_14px_rgba(0,0,0,0.9)]"
              >
                <div
                  className="flat-drawer absolute inset-0 flex items-stretch rounded-[2px] bg-ink-soft shadow-[0_18px_36px_-12px_rgba(0,0,0,0.9)]"
                  style={{ "--start": FIRST + i * STEP } as React.CSSProperties}
                >
                  <Image
                    src={drawer.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 80vw, 56vh"
                    className="rounded-[2px] object-cover"
                    priority={i === 0}
                  />
                  <div className="flat-dim pointer-events-none absolute inset-0 bg-[#100c09]" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-ink/95 via-ink/35 to-transparent rtl:bg-gradient-to-r" />
                  <div className="pointer-events-none absolute inset-y-0 end-0 w-[2.5%] bg-gradient-to-b from-paper via-paper-deep to-[#cbb99c]" />
                  <div className="flat-label relative flex w-full flex-col items-end justify-center gap-1 pe-[7%]">
                    <span className="display text-[clamp(0.85rem,2.4vh,1.6rem)] leading-none text-paper">
                      {drawer.name}
                    </span>
                    <span className="text-[clamp(0.5rem,1.1vh,0.72rem)] uppercase tracking-[0.18em] text-gold">
                      {drawer.qty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div className="pointer-events-none absolute inset-y-0 end-0 z-30 w-[2.5%] bg-gradient-to-b from-paper via-paper-deep to-[#d0c0a5] shadow-[-18px_0_30px_-10px_rgba(0,0,0,0.8)] rtl:shadow-[18px_0_30px_-10px_rgba(0,0,0,0.8)]" />
          </div>
        </div>
      </div>

      <p className="scroll-hint pointer-events-none fixed inset-x-0 bottom-8 text-center text-xs uppercase tracking-[0.3em] text-kakuti-pale">
        {hint}
      </p>
    </section>
  );
}
