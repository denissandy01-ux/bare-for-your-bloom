import { describe, it, expect } from "vitest";
import { pointsFor, rewardsUnlocked, REVIEW_POINTS, BOOKING_POINTS } from "@/lib/data";
import { studioTeam, specialistById, handleFor } from "@/lib/specialists";
describe("Bare Points", () => {
  it("$14.99 earns 149 pts", () => expect(pointsFor(14.99)).toBe(149));
  it("verified review earns 150", () => expect(REVIEW_POINTS).toBe(150));
  it("booking earns 50", () => expect(BOOKING_POINTS).toBe(50));
  it("420 pts unlocks nothing, 1000 unlocks two $5 rewards", () => { expect(rewardsUnlocked(420)).toBe(0); expect(rewardsUnlocked(1000)).toBe(2); });
});
describe("studio roster", () => {
  it("Soft Set lists Imani first then Lena", () => expect(studioTeam(specialistById("imani-brooks")!).map(s => s.id)).toEqual(["imani-brooks", "lena-ortiz"]));
  it("Imani's handle is @imani.nails", () => expect(handleFor(specialistById("imani-brooks")!)).toBe("@imani.nails"));
});
