import { describe, expect, it } from "vitest";
import { cashbackFor, purchaseQuote, skinTwinScore } from "@/lib/data";
describe("money rules", () => {
  it("8% of $14.99 is $1.20 back", () => expect(cashbackFor(14.99, 0.08)).toBe(1.2));
  it("MAYA10 takes 10% off then 6% back", () => expect(purchaseQuote(14.99, 0.06, 0.1)).toEqual({ pay: 13.49, cashback: 0.81 }));
  it("same tone twin scores 98%", () => expect(skinTwinScore({ handle: "", depth: "Deep", undertone: "Neutral", skinType: "Sensitive", hair: "" }, { depth: "Deep", undertone: "Neutral" })).toBe(98));
});
