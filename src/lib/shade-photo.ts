import { DEPTHS, UNDERTONES, UNDERTONE_SWATCH, type Depth, type Undertone } from "@/lib/data";

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Nearest depth × undertone swatch to a sampled skin colour. */
export function nearestTone(r: number, g: number, b: number): { depth: Depth; undertone: Undertone; distance: number } {
  let best = { depth: DEPTHS[0] as Depth, undertone: UNDERTONES[0] as Undertone, distance: Infinity };
  for (const d of DEPTHS) for (const u of UNDERTONES) {
    const [R, G, B] = rgb(UNDERTONE_SWATCH[d][u]);
    const dist = Math.sqrt(2 * (r - R) ** 2 + 4 * (g - G) ** 2 + 3 * (b - B) ** 2);
    if (dist < best.distance) best = { depth: d, undertone: u, distance: dist };
  }
  return best;
}
