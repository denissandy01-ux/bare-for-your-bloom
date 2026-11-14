import { describe, expect, it } from "vitest";
import { nearestTone } from "@/lib/shade-photo";
describe("nearestTone", () => {
  it("maps a deep warm sample to Deep Warm", () => { expect(nearestTone(0x73, 0x48, 0x26)).toMatchObject({ depth: "Deep", undertone: "Warm" }); });
  it("maps a fair cool sample to Fair Cool", () => { expect(nearestTone(0xf3, 0xd2, 0xcb)).toMatchObject({ depth: "Fair", undertone: "Cool" }); });
});
