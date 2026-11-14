import { DEPTHS, type Depth, type Profile, type Undertone } from "./data";

/** Illustrative shade ranges for complexion products. Not manufacturer shade maps. */
export interface ShadeRange { productId: string; shades: { code: string; depth: Depth; undertone: Undertone }[] }

const tones = (prefix: string): ShadeRange["shades"] => {
  const u: Undertone[] = ["Cool", "Neutral", "Warm", "Olive"];
  return DEPTHS.flatMap((d, i) => u.slice(0, i === 0 || i === 4 ? 3 : 4).map((un) => ({ depth: d, undertone: un, code: "" }))).map((s, i) => ({ ...s, code: `${prefix}${i + 1}` }));
};

export const SHADE_RANGES: ShadeRange[] = [{ productId: "skin-tint", shades: tones("ST") }];

export const shadeRangeFor = (productId: string) => SHADE_RANGES.find((r) => r.productId === productId);

/** Closest shade in the range to a canvas: depth first, then undertone. */
export function suggestShade(productId: string, me: Pick<Profile, "depth" | "undertone">) {
  const r = shadeRangeFor(productId);
  if (!r) return null;
  const di = DEPTHS.indexOf(me.depth);
  return [...r.shades].sort((a, b) => {
    const da = Math.abs(DEPTHS.indexOf(a.depth) - di) * 10 + (a.undertone === me.undertone ? 0 : a.undertone === "Neutral" ? 1 : 2);
    const db = Math.abs(DEPTHS.indexOf(b.depth) - di) * 10 + (b.undertone === me.undertone ? 0 : b.undertone === "Neutral" ? 1 : 2);
    return da - db;
  })[0];
}

/** Split a swatch total across depths, weighted to creators' depths. Sample estimate. */
export function swatchSplit(count: number, creatorDepths: Depth[]) {
  const w = DEPTHS.map((d) => creatorDepths.reduce((a, c) => a + Math.max(0, 3 - Math.abs(DEPTHS.indexOf(c) - DEPTHS.indexOf(d))), 0) + 1);
  const total = w.reduce((a, x) => a + x, 0);
  return DEPTHS.map((d, i) => ({ depth: d, share: (w[i] ?? 0) / total, n: Math.round(((w[i] ?? 0) / total) * count) }));
}

/** The depth with the fewest swatches: a representation gap. */
export function shadeGap(split: ReturnType<typeof swatchSplit>) {
  return [...split].sort((a, b) => a.n - b.n)[0]!;
}
