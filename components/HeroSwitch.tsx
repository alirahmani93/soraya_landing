"use client";

import { useSearchParams } from "next/navigation";
import Stage, { type StageDrawer } from "./Stage";
import StageFlat from "./StageFlat";

/** The flat hero is the default; ?hero=3d serves the CSS 3D box. Read on the client so
 *  both locales stay statically rendered. */
export default function HeroSwitch({
  drawers,
  hint,
  mark,
}: {
  drawers: StageDrawer[];
  hint: string;
  mark: string;
}) {
  const threeD = useSearchParams().get("hero") === "3d";
  return threeD ? (
    <Stage drawers={drawers} hint={hint} mark={mark} />
  ) : (
    <StageFlat drawers={drawers} hint={hint} />
  );
}
