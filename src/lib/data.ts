import tube from "@/assets/feed-tube.jpg";
import dropper from "@/assets/amber-dropper.jpg";
import pump from "@/assets/pump-linen.jpg";
import deepSpf from "@/assets/feed-deep-spf.jpg";
import fairBeard from "@/assets/feed-fair-beard.jpg";
import oliveWaves from "@/assets/feed-olive-waves.jpg";
import tanTint from "@/assets/feed-tan-tint.jpg";
import barber from "@/assets/feed-barber.jpg";

export const DEPTHS = ["Fair", "Light", "Medium", "Tan", "Deep"] as const;
export const UNDERTONES = ["Cool", "Neutral", "Warm", "Olive"] as const;
export const SKIN_TYPES = ["Sensitive", "Acne-prone", "Dry", "Oily", "Combination", "Rosacea-prone", "Balanced"] as const;
export const BARRIER = ["Calm", "Sometimes reactive", "Very reactive"] as const;
export const HAIR_TYPES = ["1 Straight", "2 Wavy", "3 Curly", "4A Coily", "4B Coily", "4C Coily", "Shaved / beard focus"] as const;
export const POROSITY = ["Low", "Normal", "High", "Not sure"] as const;

export type Depth = (typeof DEPTHS)[number];
export type Undertone = (typeof UNDERTONES)[number];

/** Skin-tone swatch colours (data, not theme): index matches DEPTHS. */
export const DEPTH_SWATCH: Record<Depth, string> = {
  Fair: "#F1D3BF",
  Light: "#DDB394",
  Medium: "#BE8A66",
  Tan: "#98643F",
  Deep: "#6B4430",
};

export function toneLabel(depth: Depth, undertone: Undertone) {
  return `${depth} ${undertone} (Tone ${DEPTHS.indexOf(depth) + 1})`;
}

export type RetailerName = "Target" | "Walmart" | "Ulta" | "Sephora" | "Boots" | "YesStyle";
export type Stock = "In Stock" | "Low Stock" | "Out of Stock";
export interface Offer { retailer: RetailerName; price: number; stock: Stock }

const SEARCH: Record<RetailerName, string> = {
  Target: "https://www.target.com/s?searchTerm=",
  Walmart: "https://www.walmart.com/search?q=",
  Ulta: "https://www.ulta.com/search?search=",
  Sephora: "https://www.sephora.com/search?keyword=",
  Boots: "https://www.boots.com/sitesearch?searchTerm=",
  YesStyle: "https://www.yesstyle.com/en/list.html?q=",
};
export function retailerUrl(r: RetailerName, p: Product) {
  return SEARCH[r] + encodeURIComponent(`${p.brand} ${p.name}`);
}

export type Category = "Skincare" | "Makeup" | "Hair" | "Body" | "Beard";

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: Category;
  image: string;
  cashbackRate: number;
  offers: Offer[];
  founder: { name: string; title: string; story: string };
  claims: string[];
  launchpad?: boolean;
  trendRank?: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "cosrx-aloe-spf50", brand: "COSRX", name: "Daily Aloe SPF50", category: "Skincare", image: dropper, cashbackRate: 0.08,
    offers: [{ retailer: "Target", price: 14.99, stock: "In Stock" }, { retailer: "Ulta", price: 16.0, stock: "In Stock" }, { retailer: "YesStyle", price: 13.4, stock: "Low Stock" }],
    founder: { name: "COSRX lab team", title: "Seoul, 2013", story: "COSRX began as a small lab answering one question: what does irritated skin actually need? Fewer ingredients, honest percentages. The aloe sunscreen came from customers with deep and olive tones writing in about chalky filters. The team rebuilt the base around aloe and a lightweight chemical filter so it melts clear on every canvas." },
    claims: ["Zero white cast", "Reef-friendly filters", "Fragrance-free"], trendRank: 1,
  },
  {
    id: "lumiere-gel-cleanser", brand: "Lumière", name: "Lumière Gel Cleanser", category: "Skincare", image: pump, cashbackRate: 0.06,
    offers: [{ retailer: "Target", price: 14.99, stock: "In Stock" }, { retailer: "Ulta", price: 16.0, stock: "In Stock" }, { retailer: "Walmart", price: 14.98, stock: "Low Stock" }],
    founder: { name: "Adaeze Okafor", title: "Founder, former esthetician", story: "After ten years treating post-inflammatory hyperpigmentation in her Houston studio, Adaeze wanted a cleanser her clients could not over-use. Lumière is pH 5.5, sulfate-free and tested on reactive skin from Tone 1 to Tone 5 before launch." },
    claims: ["pH 5.5", "Sulfate-free", "Reactive-skin tested"], trendRank: 3, launchpad: true,
  },
  {
    id: "melanin-shield-spf", brand: "Rooted Sun", name: "Melanin Shield SPF 50", category: "Skincare", image: deepSpf, cashbackRate: 0.08,
    offers: [{ retailer: "Target", price: 13.99, stock: "In Stock" }, { retailer: "Walmart", price: 13.49, stock: "In Stock" }, { retailer: "Sephora", price: 18.0, stock: "Out of Stock" }],
    founder: { name: "Kemi Adebayo", title: "Founder, chemist", story: "Kemi spent years watching sunscreen turn her skin grey. Rooted Sun is a sheer, tinted-to-clear SPF built on deep skin first, then tested lighter, not the other way round." },
    claims: ["Clear on deep skin", "No grey cast", "Hydrating"], trendRank: 2, launchpad: true,
  },
  {
    id: "calm-barrier-cream", brand: "La Roche-Posay", name: "Cicaplast Baume B5+", category: "Skincare", image: fairBeard, cashbackRate: 0.05,
    offers: [{ retailer: "Target", price: 17.99, stock: "In Stock" }, { retailer: "Ulta", price: 18.99, stock: "In Stock" }, { retailer: "Walmart", price: 16.97, stock: "In Stock" }, { retailer: "Boots", price: 15.5, stock: "In Stock" }],
    founder: { name: "La Roche-Posay", title: "Thermal spring, France", story: "Built around the selenium-rich water of La Roche-Posay's spring, the B5+ balm is a dermatologist staple for flushed, razor-irritated and rosacea-prone skin." },
    claims: ["Soothes flushing", "Post-shave safe", "Fragrance-free"], trendRank: 4,
  },
  {
    id: "curl-defining-cream", brand: "Pattern", name: "Curl Gel", category: "Hair", image: oliveWaves, cashbackRate: 0.07,
    offers: [{ retailer: "Ulta", price: 25.0, stock: "In Stock" }, { retailer: "Target", price: 25.0, stock: "Low Stock" }, { retailer: "Sephora", price: 25.0, stock: "In Stock" }],
    founder: { name: "Pattern Beauty", title: "Curly, coily & tight-textured hair", story: "Pattern was founded to celebrate the full range of curl patterns. The curl gel gives hold without the crunch, tested from loose 2B waves through 4C coils." },
    claims: ["Defines 2B–4C", "No crunch", "Humidity hold"], trendRank: 5,
  },
  {
    id: "skin-tint", brand: "ILIA", name: "Super Serum Skin Tint SPF 40", category: "Makeup", image: tanTint, cashbackRate: 0.06,
    offers: [{ retailer: "Sephora", price: 48.0, stock: "In Stock" }, { retailer: "Ulta", price: 48.0, stock: "In Stock" }],
    founder: { name: "Sasha Plavsic", title: "Founder", story: "ILIA started in Sasha's garage as a clean lip tint. The skin tint was built to let real skin show through: freckles, texture and all, across 30 shades." },
    claims: ["Sheer, skin-through", "30 shades", "SPF 40"], trendRank: 6,
  },
  {
    id: "bump-patrol", brand: "Bump Patrol", name: "Aftershave Bump Treatment", category: "Beard", image: barber, cashbackRate: 0.08,
    offers: [{ retailer: "Walmart", price: 7.97, stock: "In Stock" }, { retailer: "Target", price: 8.49, stock: "In Stock" }],
    founder: { name: "Bump Patrol", title: "Barbershop staple since 1996", story: "Created with barbers for coarse, curly beard hair that grows back into the skin. A light exfoliating aftershave that keeps razor bumps from forming." },
    claims: ["Prevents razor bumps", "Barber approved", "Coarse beard tested"], trendRank: 7,
  },
  {
    id: "squalane", brand: "The Ordinary", name: "100% Plant-Derived Squalane", category: "Body", image: tube, cashbackRate: 0.05,
    offers: [{ retailer: "Ulta", price: 9.9, stock: "In Stock" }, { retailer: "Sephora", price: 9.9, stock: "In Stock" }, { retailer: "Target", price: 9.9, stock: "In Stock" }, { retailer: "Boots", price: 8.5, stock: "Low Stock" }],
    founder: { name: "Brandon Truaxe", title: "DECIEM founder", story: "The Ordinary was built on clinical honesty: single, labelled ingredients at fair prices. Squalane is the quiet workhorse: an oil that sinks in on face, body, ends of hair and beard." },
    claims: ["Face, body, hair", "Non-comedogenic", "Single ingredient"], trendRank: 8,
  },
];

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);

export interface Creator { handle: string; depth: Depth; undertone: Undertone; skinType: string; hair: string }

export interface FeedPost {
  id: string;
  productId: string;
  media: string;
  wearTest: string;
  creator: Creator;
  swatches: number;
  caption: string;
}

export const FEED: FeedPost[] = [
  { id: "p1", productId: "cosrx-aloe-spf50", media: tube, wearTest: "Wear test · 6 hrs, zero cast", swatches: 240, caption: "Rubbed in, six hours in Houston heat, no grey.", creator: { handle: "@nia.bare", depth: "Deep", undertone: "Neutral", skinType: "Sensitive", hair: "4C Coily" } },
  { id: "p2", productId: "melanin-shield-spf", media: deepSpf, wearTest: "Wear test · 8 hrs, no grey film", swatches: 412, caption: "Sheer enough to wear under nothing at all.", creator: { handle: "@tobi.skin", depth: "Deep", undertone: "Warm", skinType: "Oily", hair: "4C Coily" } },
  { id: "p3", productId: "calm-barrier-cream", media: fairBeard, wearTest: "Wear test · 14 days, redness down", swatches: 188, caption: "Post-shave flush gone by week two.", creator: { handle: "@callum.calm", depth: "Fair", undertone: "Cool", skinType: "Rosacea-prone", hair: "Shaved / beard focus" } },
  { id: "p4", productId: "curl-defining-cream", media: oliveWaves, wearTest: "Wear test · 3 days, curls held", swatches: 305, caption: "Day three hair, still bouncing.", creator: { handle: "@lucia.waves", depth: "Medium", undertone: "Olive", skinType: "Combination", hair: "2 Wavy" } },
  { id: "p5", productId: "skin-tint", media: tanTint, wearTest: "Wear test · 9 hrs, freckles through", swatches: 527, caption: "Shade 7. Skin still looks like skin.", creator: { handle: "@river.tan", depth: "Tan", undertone: "Warm", skinType: "Balanced", hair: "3 Curly" } },
  { id: "p6", productId: "bump-patrol", media: barber, wearTest: "Wear test · 21 days, zero bumps", swatches: 166, caption: "Three weeks, clean lineup, no bumps.", creator: { handle: "@dre.cuts", depth: "Deep", undertone: "Warm", skinType: "Sensitive", hair: "Shaved / beard focus" } },
  { id: "p7", productId: "squalane", media: dropper, wearTest: "Wear test · 30 days, barrier back", swatches: 98, caption: "One oil for face, ends and beard.", creator: { handle: "@mei.light", depth: "Light", undertone: "Neutral", skinType: "Dry", hair: "1 Straight" } },
];

export interface Profile { depth: Depth; undertone: Undertone; skinType?: string; barrier?: string; hair?: string; porosity?: string; goal?: string }

/** Skin Twin score: how closely a wear-test creator's canvas matches yours. */
export function skinTwinScore(creator: Creator, me: Profile) {
  let s = 98;
  s -= Math.abs(DEPTHS.indexOf(creator.depth) - DEPTHS.indexOf(me.depth)) * 12;
  if (creator.undertone !== me.undertone) s -= 8;
  if (me.skinType && creator.skinType !== me.skinType) s -= 5;
  return Math.max(40, s);
}

export const round2 = (n: number) => Math.round(n * 100) / 100;
export const cashbackFor = (price: number, rate: number) => round2(price * rate);
export const money = (n: number) => `$${n.toFixed(2)}`;

export function bestOffer(p: Product) {
  const avail = p.offers.filter((o) => o.stock !== "Out of Stock");
  return (avail.length ? avail : p.offers)[0];
}
export function cheapestOffer(p: Product) {
  return [...p.offers].filter((o) => o.stock !== "Out of Stock").sort((a, b) => a.price - b.price)[0];
}

export interface RoutineStep { title: string; at: string; productId: string; technique: { kicker: string; titleA: string; titleB: string; body: string } }
export interface Pro { id: string; initials: string; name: string; license: string; specialty: string; code: string; discount: number; cashback: number; bio: string }
export interface Routine { id: string; proId: string; title: string; subtitle: string; media: string; duration: string; for: string[]; steps: RoutineStep[] }

export const PROS: Pro[] = [
  { id: "maya-lin", initials: "ML", name: "Maya Lin", license: "Licensed Esthetician", specialty: "Melanin Barrier Care", code: "MAYA10", discount: 0.1, cashback: 0.06, bio: "12 years treating hyperpigmentation and reactive barriers in deep and olive skin." },
  { id: "dre-james", initials: "DJ", name: "Dre James", license: "Master Barber", specialty: "Razor Bump Prevention", code: "DRE10", discount: 0.1, cashback: 0.05, bio: "Coarse-beard specialist. Clean lineups without the bumps." },
  { id: "sofia-reyes", initials: "SR", name: "Sofía Reyes", license: "Licensed Cosmetologist", specialty: "Curl & Wave Definition", code: "SOFIA10", discount: 0.1, cashback: 0.06, bio: "Type 2A to 4C, cut dry, styled with your pattern." },
  { id: "hana-cho", initials: "HC", name: "Dr. Hana Cho", license: "Certified Trichologist", specialty: "Scalp & Rosacea Calm", code: "HANA10", discount: 0.1, cashback: 0.05, bio: "Fair, flushed and reactive skin; scalp health and thinning." },
];
export const proById = (id: string) => PROS.find((p) => p.id === id);

export const ROUTINES: Routine[] = [
  {
    id: "evening-barrier-repair", proId: "maya-lin", title: "Evening Barrier Repair Routine", subtitle: "(Deep Reactive Skin)", media: pump, duration: "6:48", for: ["Deep", "Tan", "Sensitive"],
    steps: [
      { title: "Oil cleanse", at: "0:00", productId: "squalane", technique: { kicker: "Technique", titleA: "Melt first,", titleB: "don't rub", body: "Massage a few drops onto dry skin for 60 seconds. Oil lifts sunscreen and sebum so the next step can stay gentle." } },
      { title: "Gel cleanse", at: "1:52", productId: "lumiere-gel-cleanser", technique: { kicker: "Technique", titleA: "Cleanse twice,", titleB: "never scrub", body: "Deep tones answer friction with pigment. Melting sunscreen with oil first means the second gel pass needs only 30 seconds of fingertip pressure, so no inflammation, no dark spots after." } },
      { title: "Essence", at: "3:40", productId: "calm-barrier-cream", technique: { kicker: "Technique", titleA: "Press,", titleB: "then wait", body: "Press into damp skin with flat palms. Waiting 60 seconds lets the barrier take water in before you seal." } },
      { title: "Seal", at: "5:30", productId: "cosrx-aloe-spf50", technique: { kicker: "Technique", titleA: "Seal lightly,", titleB: "every night", body: "A thin occlusive layer slows water loss overnight. Use a pea-sized amount; more only clogs." } },
    ],
  },
  {
    id: "bump-free-lineup", proId: "dre-james", title: "Bump-Free Lineup", subtitle: "(Coarse Beard)", media: barber, duration: "4:20", for: ["Deep", "Tan", "Beard"],
    steps: [
      { title: "Prep", at: "0:00", productId: "lumiere-gel-cleanser", technique: { kicker: "Technique", titleA: "Soften", titleB: "before the blade", body: "Wash with warm water for two minutes. Softened coarse hair cuts cleanly instead of snapping into the skin." } },
      { title: "With the grain", at: "1:30", productId: "squalane", technique: { kicker: "Technique", titleA: "One pass,", titleB: "with the grain", body: "Going against curly growth cuts hair below the skin, where it curls back in. One pass with the grain prevents that." } },
      { title: "Aftershave", at: "3:10", productId: "bump-patrol", technique: { kicker: "Technique", titleA: "Treat,", titleB: "don't pick", body: "Dab the treatment on the neck only. Its light exfoliation frees trapped hairs before they become bumps." } },
    ],
  },
  {
    id: "wash-day-definition", proId: "sofia-reyes", title: "Wash Day Definition", subtitle: "(Type 2B–4A)", media: oliveWaves, duration: "8:05", for: ["Wavy", "Curly", "Coily"],
    steps: [
      { title: "Hydrate", at: "0:00", productId: "squalane", technique: { kicker: "Technique", titleA: "Ends first,", titleB: "roots last", body: "A drop of oil on the ends before washing protects the oldest hair from stripping." } },
      { title: "Define", at: "3:00", productId: "curl-defining-cream", technique: { kicker: "Technique", titleA: "Soaking wet,", titleB: "then scrunch", body: "Gel applied to soaking wet hair clumps curls together. Scrunch upward, never rake through once it starts to set." } },
      { title: "Set", at: "6:10", productId: "curl-defining-cream", technique: { kicker: "Technique", titleA: "Hands off,", titleB: "until dry", body: "Touching while drying breaks the cast and causes frizz. Scrunch out the crunch only once fully dry." } },
    ],
  },
  {
    id: "flush-calm", proId: "hana-cho", title: "Flush-Calm Evening", subtitle: "(Fair Rosacea-prone)", media: fairBeard, duration: "5:12", for: ["Fair", "Light", "Rosacea-prone"],
    steps: [
      { title: "Cool rinse", at: "0:00", productId: "lumiere-gel-cleanser", technique: { kicker: "Technique", titleA: "Lukewarm,", titleB: "never hot", body: "Heat widens surface vessels. Lukewarm water cleans just as well without triggering flushing." } },
      { title: "Balm", at: "2:30", productId: "calm-barrier-cream", technique: { kicker: "Technique", titleA: "Pat,", titleB: "don't spread", body: "Patting deposits the balm without the friction that turns cheeks red." } },
    ],
  },
];
export const routineById = (id: string) => ROUTINES.find((r) => r.id === id);

/** What a shopper pays and earns back, with an optional pro code discount. */
export function purchaseQuote(price: number, cashbackRate: number, discount = 0) {
  const pay = round2(price * (1 - discount));
  return { pay, cashback: cashbackFor(pay, cashbackRate) };
}

/** Wear tests within one depth step of the chosen tone, best Skin Twin first. */
export function feedForTone(posts: FeedPost[], me: Profile) {
  return posts
    .filter((p) => Math.abs(DEPTHS.indexOf(p.creator.depth) - DEPTHS.indexOf(me.depth)) <= 1)
    .sort((a, b) => skinTwinScore(b.creator, me) - skinTwinScore(a.creator, me));
}

export const PAYOUT_MIN = 10;
export const REVIEW_REWARD = 2;
export const CANVAS_DAYS = 30;
