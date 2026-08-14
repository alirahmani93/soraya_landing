"use client";

import { useSearchParams } from "next/navigation";
import HeroVideo from "./HeroVideo";
import Stage, { type StageDrawer } from "./Stage";
import StageFlat from "./StageFlat";

/** The video hero is the default; ?hero=3d serves the CSS 3D box and ?hero=flat the flat
 *  bands. Read on the client so both locales stay statically rendered. */
export default function HeroSwitch({
  drawers,
  hint,
  mark,
  eyebrow,
  lines,
}: {
  drawers: StageDrawer[];
  hint: string;
  mark: string;
  eyebrow: string;
  lines: string[];
}) {
  const hero = useSearchParams().get("hero");
  if (hero === "3d") return <Stage drawers={drawers} hint={hint} mark={mark} />;
  if (hero === "flat") return <StageFlat drawers={drawers} hint={hint} />;
  return <HeroVideo eyebrow={eyebrow} lines={lines} />;
}
