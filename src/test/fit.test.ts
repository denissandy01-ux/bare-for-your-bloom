import { describe, expect, it } from "vitest";
import { matchKind, productById } from "@/lib/data";
describe("match kind", () => {
  it("shade only for colored complexion", () => {
    expect(matchKind(productById("skin-tint")!)).toBe("shade");
    expect(matchKind(productById("lumiere-gel-cleanser")!)).toBe("skin");
    expect(matchKind(productById("curl-defining-cream")!)).toBe("hair");
  });
});
