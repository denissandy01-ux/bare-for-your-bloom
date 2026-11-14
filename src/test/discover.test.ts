import { describe, expect, it } from "vitest";
import { productById, whereSold, lovedBrands, suggestFor } from "@/lib/data";
describe("discover rules", () => {
  it("small brands sold only on their site say Shop on the web", () => expect(whereSold(productById("glow-toner-essence")!).label).toBe("Shop on the web"));
  it("single-retailer products say Only at", () => expect(whereSold(productById("niacinamide-serum")!).label).toBe("Only at Sephora"));
  it("multi-store products list stores and lowest price", () => { const w = whereSold(productById("curl-shampoo")!); expect(w.label).toBe("Walmart & Target"); expect(w.from).toBe(10.97); });
  it("liked posts count as loved brands", () => expect(lovedBrands([], ["p16"])).toEqual(["Mielle"]));
  it("4C hair gets the leave-in suggested", () => expect(suggestFor({ depth: "Deep", undertone: "Cool", hair: "4C Coily" }).map((p) => p.id)).toContain("leave-in-conditioner"));
});
