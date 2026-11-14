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
export const SKIN_BEHAVIORS = ["Balanced", "Dry", "Oily", "Combination"] as const;
export const SKIN_CONCERNS = ["Sensitive", "Acne-prone", "Rosacea-prone", "Dehydrated", "Reactive / easily irritated"] as const;
export const BARRIER = ["Calm", "Sometimes reactive", "Very reactive"] as const;
export const HAIR_TYPES = ["1 Straight", "2 Wavy", "3 Curly", "4A Coily", "4B Coily", "4C Coily", "Starter locs", "Traditional locs", "Sisterlocks / microlocs", "Silver / grey texture", "Shaved / beard focus"] as const;
export const HAIR_LENGTHS = ["Short / TWA", "Chin length", "Shoulder length", "Long"] as const;
/** Private life stage; only used to quietly rank content, never shown on posts. */
export const AGE_STAGES = ["18–24", "25–34", "35–44", "45–54", "55+"] as const;
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

/** Undertone swatches per depth (data, not theme): cool = pink, neutral = beige, warm = golden, olive = green-grey. */
export const UNDERTONE_SWATCH: Record<Depth, Record<Undertone, string>> = {
  Fair: { Cool: "#F3D2CB", Neutral: "#F1D3BF", Warm: "#F2D1AE", Olive: "#E6D2B2" },
  Light: { Cool: "#E0B2A2", Neutral: "#DDB394", Warm: "#DFB07F", Olive: "#CDB088" },
  Medium: { Cool: "#BF8775", Neutral: "#BE8A66", Warm: "#C38A55", Olive: "#A98A5E" },
  Tan: { Cool: "#97604F", Neutral: "#98643F", Warm: "#A06733", Olive: "#85683E" },
  Deep: { Cool: "#6A4038", Neutral: "#6B4430", Warm: "#734826", Olive: "#5E4A2E" },
};

export function toneLabel(depth: Depth, undertone: Undertone) {
  return `${depth} ${undertone} (Tone ${DEPTHS.indexOf(depth) + 1})`;
}

export type RetailerName = "Target" | "Walmart" | "Ulta" | "Sephora" | "Boots" | "YesStyle" | "Brand site";
export type Stock = "In Stock" | "Low Stock" | "Out of Stock";
export interface Offer { retailer: RetailerName; price: number; stock: Stock }

const SEARCH: Record<RetailerName, string> = {
  Target: "https://www.target.com/s?searchTerm=",
  Walmart: "https://www.walmart.com/search?q=",
  Ulta: "https://www.ulta.com/search?search=",
  Sephora: "https://www.sephora.com/search?keyword=",
  Boots: "https://www.boots.com/sitesearch?searchTerm=",
  YesStyle: "https://www.yesstyle.com/en/list.html?q=",
  "Brand site": "https://www.google.com/search?q=",
};
export function retailerUrl(r: RetailerName, p: Product) {
  return SEARCH[r] + encodeURIComponent(`${p.brand} ${p.name}`);
}

export type Category = "Skincare" | "Makeup" | "Hair" | "Body" | "Beard" | "Nails" | "Tools & Accessories";

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
  /** Subcategory within category. */
  sub?: string;
  /** Canvas the product is aimed at, used for suggestions. */
  fits?: { depths?: Depth[]; skinTypes?: string[]; hair?: string[] };
}

export const SUBCATEGORIES: Record<Category, string[]> = {
  Skincare: ["Cleansers", "Toners & Essences", "Serums", "Moisturizers", "Sun Care"],
  Makeup: ["Face", "Eyes", "Lips", "Cheeks"],
  Hair: ["Shampoo", "Conditioner", "Leave-in", "Styling", "Hair Tools"],
  Body: ["Oils", "Body Wash"],
  Beard: ["Aftershave", "Beard Oil"],
  Nails: ["Nail Color", "Nail Care", "Press-ons"],
  "Tools & Accessories": ["Hair Tools", "Face Tools", "Brushes"],
};

export const PRODUCTS: Product[] = [
  {
    id: "cosrx-aloe-spf50", sub: "Sun Care", brand: "COSRX", name: "Daily Aloe SPF50", category: "Skincare", image: dropper, cashbackRate: 0.08,
    offers: [{ retailer: "Target", price: 14.99, stock: "In Stock" }, { retailer: "Ulta", price: 16.0, stock: "In Stock" }, { retailer: "YesStyle", price: 13.4, stock: "Low Stock" }],
    founder: { name: "COSRX lab team", title: "Seoul, 2013", story: "COSRX began as a small lab answering one question: what does irritated skin actually need? Fewer ingredients, honest percentages. The aloe sunscreen came from customers with deep and olive tones writing in about chalky filters. The team rebuilt the base around aloe and a lightweight chemical filter so it melts clear on every canvas." },
    claims: ["Zero white cast", "Reef-friendly filters", "Fragrance-free"], trendRank: 1,
  },
  {
    id: "lumiere-gel-cleanser", sub: "Cleansers", brand: "Lumière", name: "Lumière Gel Cleanser", category: "Skincare", image: pump, cashbackRate: 0.06,
    offers: [{ retailer: "Target", price: 14.99, stock: "In Stock" }, { retailer: "Ulta", price: 16.0, stock: "In Stock" }, { retailer: "Walmart", price: 14.98, stock: "Low Stock" }],
    founder: { name: "Adaeze Okafor", title: "Founder, former esthetician", story: "After ten years treating post-inflammatory hyperpigmentation in her Houston studio, Adaeze wanted a cleanser her clients could not over-use. Lumière is pH 5.5, sulfate-free and tested on reactive skin from Tone 1 to Tone 5 before launch." },
    claims: ["pH 5.5", "Sulfate-free", "Reactive-skin tested"], trendRank: 3, launchpad: true,
  },
  {
    id: "melanin-shield-spf", sub: "Sun Care", brand: "Rooted Sun", name: "Melanin Shield SPF 50", category: "Skincare", image: deepSpf, cashbackRate: 0.08,
    offers: [{ retailer: "Target", price: 13.99, stock: "In Stock" }, { retailer: "Walmart", price: 13.49, stock: "In Stock" }, { retailer: "Sephora", price: 18.0, stock: "Out of Stock" }],
    founder: { name: "Kemi Adebayo", title: "Founder, chemist", story: "Kemi spent years watching sunscreen turn her skin grey. Rooted Sun is a sheer, tinted-to-clear SPF built on deep skin first, then tested lighter, not the other way round." },
    claims: ["Clear on deep skin", "No grey cast", "Hydrating"], trendRank: 2, launchpad: true, fits: { depths: ["Tan", "Deep"] },
  },
  {
    id: "calm-barrier-cream", sub: "Moisturizers", brand: "La Roche-Posay", name: "Cicaplast Baume B5+", category: "Skincare", image: fairBeard, cashbackRate: 0.05,
    offers: [{ retailer: "Target", price: 17.99, stock: "In Stock" }, { retailer: "Ulta", price: 18.99, stock: "In Stock" }, { retailer: "Walmart", price: 16.97, stock: "In Stock" }, { retailer: "Boots", price: 15.5, stock: "In Stock" }],
    founder: { name: "La Roche-Posay", title: "Thermal spring, France", story: "Built around the selenium-rich water of La Roche-Posay's spring, the B5+ balm is a dermatologist staple for flushed, razor-irritated and rosacea-prone skin." },
    claims: ["Soothes flushing", "Post-shave safe", "Fragrance-free"], trendRank: 4, fits: { skinTypes: ["Sensitive", "Rosacea-prone", "Dry"] },
  },
  {
    id: "curl-defining-cream", sub: "Styling", brand: "Pattern", name: "Curl Gel", category: "Hair", image: oliveWaves, cashbackRate: 0.07,
    offers: [{ retailer: "Ulta", price: 25.0, stock: "In Stock" }, { retailer: "Target", price: 25.0, stock: "Low Stock" }, { retailer: "Sephora", price: 25.0, stock: "In Stock" }],
    founder: { name: "Pattern Beauty", title: "Curly, coily & tight-textured hair", story: "Pattern was founded to celebrate the full range of curl patterns. The curl gel gives hold without the crunch, tested from loose 2B waves through 4C coils." },
    claims: ["Defines 2B–4C", "No crunch", "Humidity hold"], trendRank: 5, fits: { hair: ["2 Wavy", "3 Curly", "4A Coily", "4B Coily", "4C Coily"] },
  },
  {
    id: "skin-tint", sub: "Skin Tint", brand: "ILIA", name: "Super Serum Skin Tint SPF 40", category: "Makeup", image: tanTint, cashbackRate: 0.06,
    offers: [{ retailer: "Sephora", price: 48.0, stock: "In Stock" }, { retailer: "Ulta", price: 48.0, stock: "In Stock" }],
    founder: { name: "Sasha Plavsic", title: "Founder", story: "ILIA started in Sasha's garage as a clean lip tint. The skin tint was built to let real skin show through: freckles, texture and all, across 30 shades." },
    claims: ["Sheer, skin-through", "30 shades", "SPF 40"], trendRank: 6, fits: { depths: ["Light", "Medium", "Tan"] },
  },
  {
    id: "bump-patrol", sub: "Aftershave", brand: "Bump Patrol", name: "Aftershave Bump Treatment", category: "Beard", image: barber, cashbackRate: 0.08,
    offers: [{ retailer: "Walmart", price: 7.97, stock: "In Stock" }, { retailer: "Target", price: 8.49, stock: "In Stock" }],
    founder: { name: "Bump Patrol", title: "Barbershop staple since 1996", story: "Created with barbers for coarse, curly beard hair that grows back into the skin. A light exfoliating aftershave that keeps razor bumps from forming." },
    claims: ["Prevents razor bumps", "Barber approved", "Coarse beard tested"], trendRank: 7,
  },
  {
    id: "squalane", sub: "Oils", brand: "The Ordinary", name: "100% Plant-Derived Squalane", category: "Body", image: tube, cashbackRate: 0.05,
    offers: [{ retailer: "Ulta", price: 9.9, stock: "In Stock" }, { retailer: "Sephora", price: 9.9, stock: "In Stock" }, { retailer: "Target", price: 9.9, stock: "In Stock" }, { retailer: "Boots", price: 8.5, stock: "Low Stock" }],
    founder: { name: "Brandon Truaxe", title: "DECIEM founder", story: "The Ordinary was built on clinical honesty: single, labelled ingredients at fair prices. Squalane is the quiet workhorse: an oil that sinks in on face, body, ends of hair and beard." },
    claims: ["Face, body, hair", "Non-comedogenic", "Single ingredient"], trendRank: 8,
  },
  {
    id: "cerave-hydrating-cleanser", sub: "Cleansers", brand: "CeraVe", name: "Hydrating Facial Cleanser", category: "Skincare", image: pump, cashbackRate: 0.05,
    offers: [{ retailer: "Walmart", price: 14.97, stock: "In Stock" }, { retailer: "Target", price: 15.99, stock: "In Stock" }, { retailer: "Ulta", price: 16.99, stock: "In Stock" }],
    founder: { name: "CeraVe", title: "Developed with dermatologists", story: "A non-foaming cream cleanser built around three essential ceramides, made to wash without stripping dry or reactive skin." },
    claims: ["Non-stripping", "Ceramides", "Dry & sensitive skin"], trendRank: 9, fits: { skinTypes: ["Dry", "Sensitive", "Rosacea-prone"] },
  },
  {
    id: "glow-toner-essence", sub: "Toners & Essences", brand: "Kanaval Skin", name: "Moringa Calm Essence", category: "Skincare", image: dropper, cashbackRate: 0.1,
    offers: [{ retailer: "Brand site", price: 28.0, stock: "In Stock" }],
    founder: { name: "Sample founder", title: "Small-batch brand (sample)", story: "An illustrative small-business essence that shows how indie brands selling only on their own website appear on Becoming Bare." },
    claims: ["Small batch", "Moringa", "Fragrance-free"], launchpad: true, fits: { depths: ["Tan", "Deep"], skinTypes: ["Sensitive", "Combination"] },
  },
  {
    id: "niacinamide-serum", sub: "Serums", brand: "The Inkey List", name: "Niacinamide Serum", category: "Skincare", image: dropper, cashbackRate: 0.06,
    offers: [{ retailer: "Sephora", price: 9.99, stock: "In Stock" }],
    founder: { name: "The Inkey List", title: "London, 2018", story: "Built on plain ingredient names and fair prices, so you know exactly what you are putting on your skin." },
    claims: ["Fades dark spots", "Oil balance", "Under $10"], trendRank: 10, fits: { skinTypes: ["Oily", "Acne-prone", "Combination"], depths: ["Medium", "Tan", "Deep"] },
  },
  {
    id: "brow-gel", sub: "Brows", brand: "Benefit", name: "24-HR Brow Setter", category: "Makeup", image: tube, cashbackRate: 0.05,
    offers: [{ retailer: "Ulta", price: 26.0, stock: "In Stock" }, { retailer: "Sephora", price: 26.0, stock: "In Stock" }],
    founder: { name: "Benefit Cosmetics", title: "San Francisco, 1976", story: "Clear brow gel that holds every brow type, from fine and light to coarse and dark, without flaking." },
    claims: ["Clear hold", "All brow types", "No flakes"], trendRank: 12,
  },
  {
    id: "curl-shampoo", sub: "Shampoo", brand: "SheaMoisture", name: "Curl & Shine Shampoo", category: "Hair", image: pump, cashbackRate: 0.07,
    offers: [{ retailer: "Walmart", price: 10.97, stock: "In Stock" }, { retailer: "Target", price: 11.99, stock: "In Stock" }],
    founder: { name: "Richelieu Dennis", title: "Co-founder", story: "Started from his grandmother's shea butter recipes, sold on the streets of Harlem, made for coily and curly hair first." },
    claims: ["Sulfate-free", "Coconut & shea", "3A–4C"], trendRank: 11, fits: { hair: ["3 Curly", "4A Coily", "4B Coily", "4C Coily"] },
  },
  {
    id: "moisture-conditioner", sub: "Conditioner", brand: "Briogeo", name: "Don't Despair, Repair! Conditioner", category: "Hair", image: oliveWaves, cashbackRate: 0.06,
    offers: [{ retailer: "Sephora", price: 32.0, stock: "In Stock" }],
    founder: { name: "Nancy Twine", title: "Founder", story: "Nancy left Wall Street to build hair care inspired by her grandmother's kitchen formulas, for every texture." },
    claims: ["Repairs breakage", "All textures", "Silicone-free"], fits: { hair: ["1 Straight", "2 Wavy", "3 Curly"] },
  },
  {
    id: "leave-in-conditioner", sub: "Leave-in", brand: "Mielle", name: "Pomegranate & Honey Leave-In", category: "Hair", image: pump, cashbackRate: 0.07,
    offers: [{ retailer: "Target", price: 9.99, stock: "In Stock" }, { retailer: "Walmart", price: 9.47, stock: "In Stock" }, { retailer: "Ulta", price: 11.0, stock: "Low Stock" }],
    founder: { name: "Monique Rodriguez", title: "Founder, registered nurse", story: "Monique started Mielle from her kitchen to restore her own hair, then grew it into a staple for coily and curly textures." },
    claims: ["Slip for detangling", "Moisture retention", "4A–4C"], trendRank: 13, fits: { hair: ["4A Coily", "4B Coily", "4C Coily", "3 Curly"] },
  },
  {
    id: "blowout-brush", sub: "Hair Tools", brand: "Revlon", name: "One-Step Volumizer", category: "Hair", image: oliveWaves, cashbackRate: 0.04,
    offers: [{ retailer: "Walmart", price: 39.88, stock: "In Stock" }, { retailer: "Target", price: 44.99, stock: "In Stock" }, { retailer: "Ulta", price: 49.99, stock: "In Stock" }],
    founder: { name: "Revlon", title: "New York, 1932", story: "The hot-air brush that brought salon blowouts home, used on straight, wavy and coily hair." },
    claims: ["At-home blowout", "Less frizz", "All lengths"],
  },
  {
    id: "beard-oil", sub: "Beard Oil", brand: "Scotch Porter", name: "Smoothing Beard Serum", category: "Beard", image: barber, cashbackRate: 0.07,
    offers: [{ retailer: "Target", price: 16.99, stock: "In Stock" }, { retailer: "Walmart", price: 15.98, stock: "In Stock" }],
    founder: { name: "Calvin Quallis", title: "Founder", story: "Built a grooming line for coarse and curly beards, sold first in his Newark shop." },
    claims: ["Softens coarse beards", "No greasy feel", "Skin under beard"], fits: { hair: ["Shaved / beard focus"] },
  },
];

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);

export interface Creator { handle: string; depth: Depth; undertone: Undertone; skinType: string; hair: string; shade?: string; ageStage?: string }

export interface FeedPost {
  id: string;
  productId: string;
  media: string;
  wearTest: string;
  creator: Creator;
  swatches: number;
  caption: string;
  /** Sample like count before this user likes it. */
  likes?: number;
  /** Posted by the brand itself rather than a creator co-post. */
  official?: boolean;
}

export const FEED: FeedPost[] = [
  { id: "b-ilia", official: true, productId: "skin-tint", media: tanTint, wearTest: "Official · shade campaign", swatches: 30, caption: "Thirty shades, one rule: your skin still shows through.", likes: 3120, creator: { handle: "@iliabeauty", depth: "Tan", undertone: "Warm", skinType: "Combination", hair: "2B Wavy" } },
  { id: "p1", productId: "cosrx-aloe-spf50", media: tube, wearTest: "Wear test · 6 hrs, zero cast", swatches: 240, caption: "Rubbed in, six hours in Houston heat, no grey.", creator: { handle: "@nia.bare", depth: "Deep", undertone: "Neutral", skinType: "Sensitive", hair: "4C Coily" } },
  { id: "p2", productId: "melanin-shield-spf", media: deepSpf, wearTest: "Wear test · 8 hrs, no grey film", swatches: 412, caption: "Sheer enough to wear under nothing at all.", creator: { handle: "@tobi.skin", depth: "Deep", undertone: "Warm", skinType: "Oily", hair: "4C Coily" } },
  { id: "p3", productId: "calm-barrier-cream", media: fairBeard, wearTest: "Wear test · 14 days, redness down", swatches: 188, caption: "Post-shave flush gone by week two.", creator: { handle: "@callum.calm", depth: "Fair", undertone: "Cool", skinType: "Rosacea-prone", hair: "Shaved / beard focus" } },
  { id: "p4", productId: "curl-defining-cream", media: oliveWaves, wearTest: "Wear test · 3 days, curls held", swatches: 305, caption: "Day three hair, still bouncing.", creator: { handle: "@lucia.waves", depth: "Medium", undertone: "Olive", skinType: "Combination", hair: "2 Wavy" } },
  { id: "p5", productId: "skin-tint", media: tanTint, wearTest: "Wear test · 9 hrs, freckles through", swatches: 527, caption: "Shade 7. Skin still looks like skin.", creator: { handle: "@river.tan", depth: "Tan", undertone: "Warm", skinType: "Balanced", hair: "3 Curly", shade: "ST15" } },
  { id: "p6", productId: "bump-patrol", media: barber, wearTest: "Wear test · 21 days, zero bumps", swatches: 166, caption: "Three weeks, clean lineup, no bumps.", creator: { handle: "@dre.cuts", depth: "Deep", undertone: "Warm", skinType: "Sensitive", hair: "Shaved / beard focus" } },
  { id: "p7", productId: "squalane", media: dropper, wearTest: "Wear test · 30 days, barrier back", swatches: 98, caption: "One oil for face, ends and beard.", creator: { handle: "@mei.light", depth: "Light", undertone: "Neutral", skinType: "Dry", hair: "1 Straight" } },
  { id: "p8", productId: "cerave-hydrating-cleanser", media: pump, likes: 1840, wearTest: "Wear test · 14 days, no tightness", swatches: 132, caption: "Morning and night, skin never felt squeaky.", creator: { handle: "@ava.fair", depth: "Fair", undertone: "Neutral", skinType: "Dry", hair: "2 Wavy" } },
  { id: "p9", productId: "brow-gel", media: tube, likes: 960, wearTest: "Wear test · 12 hrs, brows held", swatches: 88, caption: "Fine blonde brows, still brushed up at dinner.", creator: { handle: "@saoirse.f", depth: "Fair", undertone: "Cool", skinType: "Balanced", hair: "1 Straight" } },
  { id: "p10", productId: "moisture-conditioner", media: oliveWaves, likes: 1220, wearTest: "Wear test · 4 washes, less breakage", swatches: 74, caption: "Bleached ends finally feel soft again.", creator: { handle: "@jun.light", depth: "Light", undertone: "Warm", skinType: "Combination", hair: "2 Wavy" } },
  { id: "p11", productId: "blowout-brush", media: oliveWaves, likes: 2410, wearTest: "Wear test · 3 days, blowout lasted", swatches: 61, caption: "Salon bounce, my bathroom, 25 minutes.", creator: { handle: "@layla.olive", depth: "Light", undertone: "Olive", skinType: "Oily", hair: "3 Curly" } },
  { id: "p12", productId: "niacinamide-serum", media: dropper, likes: 3105, wearTest: "Wear test · 30 days, spots lighter", swatches: 214, caption: "Week four, the dark marks from breakouts are fading.", creator: { handle: "@priya.glow", depth: "Medium", undertone: "Warm", skinType: "Acne-prone", hair: "1 Straight" } },
  { id: "p13", productId: "cosrx-aloe-spf50", media: tube, likes: 1490, wearTest: "Wear test · 7 hrs, no pilling", swatches: 240, caption: "Layers under makeup without balling up.", creator: { handle: "@marco.med", depth: "Medium", undertone: "Olive", skinType: "Oily", hair: "Shaved / beard focus" } },
  { id: "p14", productId: "curl-shampoo", media: pump, likes: 2780, wearTest: "Wear test · 6 washes, curls defined", swatches: 190, caption: "Clean scalp, no squeak, curls clump right away.", creator: { handle: "@isa.tan", depth: "Tan", undertone: "Neutral", skinType: "Combination", hair: "3 Curly" } },
  { id: "p15", productId: "glow-toner-essence", media: dropper, likes: 640, wearTest: "Wear test · 14 days, calmer skin", swatches: 42, caption: "Small-batch find. Redness down after two weeks.", creator: { handle: "@nadia.tan", depth: "Tan", undertone: "Olive", skinType: "Sensitive", hair: "4A Coily" } },
  { id: "p16", productId: "leave-in-conditioner", media: deepSpf, likes: 4320, wearTest: "Wear test · 5 days, moisture held", swatches: 356, caption: "Wash day to day five, 4C still soft.", creator: { handle: "@amara.coils", depth: "Deep", undertone: "Cool", skinType: "Dry", hair: "4C Coily" } },
  { id: "p17", productId: "beard-oil", media: barber, likes: 1170, wearTest: "Wear test · 10 days, no itch", swatches: 97, caption: "Coarse beard, soft by day three, no flakes.", creator: { handle: "@kwame.groom", depth: "Deep", undertone: "Olive", skinType: "Oily", hair: "Shaved / beard focus" } },
];

export interface Profile { depth: Depth; undertone: Undertone; skinType?: string; skinTypes?: string[]; barrier?: string; hair?: string; hairLength?: string; ageStage?: string; porosity?: string; goal?: string; fragrance?: string; silicone?: string; exclusions?: string; referenceShade?: string }

/** Skin Twin score: how closely a wear-test creator's canvas matches yours. */
export function skinTwinScore(creator: Creator, me: Profile) {
  let s = 98;
  s -= Math.abs(DEPTHS.indexOf(creator.depth) - DEPTHS.indexOf(me.depth)) * 12;
  if (creator.undertone !== me.undertone) s -= 8;
  if (skinTags(me).length && !skinTags(me).includes(creator.skinType)) s -= 5;
  return Math.max(40, s);
}

export const round2 = (n: number) => Math.round(n * 100) / 100;
export const cashbackFor = (price: number, rate: number) => round2(price * rate);
export const money = (n: number) => `$${n.toFixed(2)}`;

export function bestOffer(p: Product) {
  const avail = p.offers.filter((o) => o.stock !== "Out of Stock");
  return (avail.length ? avail : p.offers)[0]!;
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
    .filter((p) => { const product = productById(p.productId); return product && (matchKind(product) === "hair" ? !me.hair || p.creator.hair === me.hair : Math.abs(DEPTHS.indexOf(p.creator.depth) - DEPTHS.indexOf(me.depth)) <= 1); })
    .sort((a, b) => { const ap = productById(a.productId), bp = productById(b.productId); return (bp ? fitScore(bp, b.creator, me) : 0) + lifeStageBoost(b.creator, me) - (ap ? fitScore(ap, a.creator, me) : 0) - lifeStageBoost(a.creator, me); });
}

// Bare Points: brand-funded rewards, not bank cashback.
export const POINTS_PER_DOLLAR = 10;
export const REVIEW_POINTS = 150;
export const BOOKING_POINTS = 50;
export const REDEEM_POINTS = 500;
export const REDEEM_VALUE = 5;
export const pointsFor = (price: number) => Math.floor(price * POINTS_PER_DOLLAR);
export const pts = (n: number) => `${Math.round(n).toLocaleString()} pts`;
/** Whole $5 rewards unlocked by an available balance. */
export const rewardsUnlocked = (points: number) => Math.floor(points / REDEEM_POINTS);
export const PAYOUT_MIN = REDEEM_POINTS;
export const REVIEW_REWARD = REVIEW_POINTS;
export const CANVAS_DAYS = 30;

/** Where a product is sold, without implying one fixed price everywhere. */
export function whereSold(p: Product) {
  const shops = [...new Set(p.offers.map((o) => o.retailer))];
  const from = Math.min(...p.offers.map((o) => o.price));
  if (shops.length === 1 && shops[0] === "Brand site") return { label: "Shop on the web", web: true, from, shops };
  if (shops.length === 1) return { label: `Only at ${shops[0]}`, web: false, from, shops };
  const label = shops.length > 2 ? `${shops.slice(0, 2).join(" & ")} +${shops.length - 2}` : shops.join(" & ");
  return { label, web: false, from, shops };
}

export const TRENDING_RANK = 6;
export const isTrending = (p: Product) => (p.trendRank ?? 99) <= TRENDING_RANK;

/** Products suggested for a canvas: depth, skin type, hair fit, loved brands and Skin Twin wear tests. */
export function suggestFor(me: Profile, lovedBrands: string[] = []) {
  return PRODUCTS.map((p) => {
    let s = 0;
    if (p.fits?.depths?.includes(me.depth)) s += 3;
    if (skinTags(me).some(tag => p.fits?.skinTypes?.includes(tag))) s += 3;
    if (me.hair && p.fits?.hair?.includes(me.hair)) s += 3;
    if (lovedBrands.includes(p.brand)) s += 2;
    s += FEED.filter((f) => f.productId === p.id && Math.abs(DEPTHS.indexOf(f.creator.depth) - DEPTHS.indexOf(me.depth)) <= 1).length * 2;
    return { p, s };
  }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).map((x) => x.p);
}

/** Brands the user loves: from saved products and liked posts. */
export function lovedBrands(savedProducts: string[], likedPosts: string[]) {
  const ids = [...savedProducts, ...likedPosts.map((id) => FEED.find((f) => f.id === id)?.productId ?? "")];
  return [...new Set(ids.map((id) => productById(id)?.brand).filter((b): b is string => !!b))];
}

/** Which kind of match a product post shows: shade (colored complexion), skin, or hair. */
export type MatchKind = "shade" | "skin" | "hair";
const SHADE_SUBS = ["Foundation", "Skin Tint", "Concealer"];
export function matchKind(p: Product): MatchKind {
  if (p.category === "Hair") return "hair";
  if (p.sub && SHADE_SUBS.includes(p.sub)) return "shade";
  return "skin";
}
export const isShadeProduct = (p: Product) => matchKind(p) === "shade";
export const MATCH_LABEL: Record<MatchKind, string> = { shade: "Skin Twin", skin: "Skin Fit", hair: "Texture Twin" };

/** Fit score for a post, using the factors that matter for that product type. */
export function fitScore(p: Product, creator: Creator, me: Profile) {
  const kind = matchKind(p);
  if (kind === "shade") return skinTwinScore(creator, me);
  let s = 92;
  if (kind === "hair") {
    if (me.hair && creator.hair !== me.hair) s -= 18;
    if (p.fits?.hair && me.hair && !p.fits.hair.includes(me.hair)) s -= 10;
  } else {
    if (skinTags(me).length && !skinTags(me).includes(creator.skinType)) s -= 14;
    if (p.fits?.skinTypes && skinTags(me).length && !skinTags(me).some(tag => p.fits?.skinTypes?.includes(tag))) s -= 12;
    if (p.fits?.depths && !p.fits.depths.includes(me.depth)) s -= 6;
  }
  return Math.max(40, Math.min(98, s));
}

/** Plain-language reasons behind a fit score. */
export function fitReasons(p: Product, creator: Creator, me: Profile): { ok: boolean; text: string }[] {
  const tags = skinTags(me);
  const kind = matchKind(p), r: { ok: boolean; text: string }[] = [];
  if (kind === "shade") {
    r.push({ ok: creator.depth === me.depth, text: creator.depth === me.depth ? `Tested by someone with your ${me.depth} depth` : `Tester is ${creator.depth}; you're ${me.depth}` });
    r.push({ ok: creator.undertone === me.undertone, text: creator.undertone === me.undertone ? `Same ${me.undertone} undertone` : `Tester has a ${creator.undertone} undertone` });
  } else if (kind === "hair") {
    r.push({ ok: !me.hair || creator.hair === me.hair, text: me.hair ? (creator.hair === me.hair ? `Tested on ${me.hair} hair like yours` : `Tested on ${creator.hair}; yours is ${me.hair}`) : `Tested on ${creator.hair} — add your texture for a closer match` });
    if (p.fits?.hair) r.push({ ok: !me.hair || p.fits.hair.includes(me.hair), text: `Rated well by ${p.fits.hair.join(", ")} textures` });
  } else {
    r.push({ ok: !tags.length || tags.includes(creator.skinType), text: tags.length ? (tags.includes(creator.skinType) ? `Tester shares your ${creator.skinType} skin tag` : `Tester has ${creator.skinType} skin; your tags are ${tags.join(", ")}`) : `Tester has ${creator.skinType} skin — add your skin type for a closer match` });
    if (p.fits?.skinTypes) r.push({ ok: !tags.length || tags.some(tag => p.fits?.skinTypes?.includes(tag)), text: `Rated well by ${p.fits.skinTypes.join(", ").toLowerCase()} skin` });
    if (p.fits?.depths) r.push({ ok: p.fits.depths.includes(me.depth), text: `Most tested on ${p.fits.depths.join(" & ")} skin` });
  }
  p.claims.slice(0, 2).forEach((c) => r.push({ ok: true, text: c }));
  return r;
}

/** Legacy single-choice canvases remain readable; an explicit empty array clears tags. */
export const skinTags = (p: Profile): string[] => p.skinTypes ?? (p.skinType ? [p.skinType] : []);
export const browsingCanvas = (saved: Profile, temporary: Profile | null): Profile => temporary ?? saved;
export function productGroup(p: Product) {
  if (p.category === "Makeup") return ["Skin Tint", "Foundation", "Concealer"].includes(p.sub ?? "") ? "Face" : p.sub === "Brows" ? "Eyes" : p.sub;
  return p.sub;
}
export const STORE_TYPES = ["All stores", "Drugstore", "Beauty Supply", "Prestige", "Direct & Indie"] as const;
export type StoreType = (typeof STORE_TYPES)[number];
export function matchesStore(p: Product, store: StoreType) {
  if (store === "All stores") return true;
  const retailers: Record<Exclude<StoreType, "All stores">, RetailerName[]> = { Drugstore: ["Target", "Walmart", "Boots"], "Beauty Supply": [], Prestige: ["Sephora", "Ulta"], "Direct & Indie": ["Brand site", "YesStyle"] };
  return p.offers.some(o => retailers[store].includes(o.retailer));
}
export function matchesPrice(p: Product, band: string) {
  const price = whereSold(p).from;
  return band === "All prices" || (band === "Under $15" ? price < 15 : band === "$15–$35" ? price >= 15 && price < 35 : band === "$35–$70" ? price >= 35 && price < 70 : price >= 70);
}

/** Quiet ranking nudge for a shared life stage; never displayed as a label or score. */
export function lifeStageBoost(c: { ageStage?: string }, me: Profile) { return me.ageStage && c.ageStage === me.ageStage ? 5 : 0; }
