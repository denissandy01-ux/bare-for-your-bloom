import { describe, expect, it } from "vitest";
import { shadeGap, suggestShade, swatchSplit } from "@/lib/shades";
describe("shade match", () => {
  it("suggests a shade at the user's depth and undertone", () => {
    const s = suggestShade("skin-tint", { depth: "Deep", undertone: "Neutral" });
    expect(s?.depth).toBe("Deep"); expect(s?.undertone).toBe("Neutral");
  });
  it("no suggestion for non-complexion products", () => { expect(suggestShade("squalane", { depth: "Deep", undertone: "Warm" })).toBeNull(); });
  it("flags the least represented depth as the gap", () => { expect(shadeGap(swatchSplit(500, ["Fair", "Fair"])).depth).toBe("Deep"); });
});
