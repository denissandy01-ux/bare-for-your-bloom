import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Globe, Search, Sparkles, Heart, FlaskConical } from "lucide-react";
import { useState } from "react";
import { BareHeader, Chip, EmptyState, Page, SectionTitle } from "@/components/bare/kit";
import { PRODUCTS, SUBCATEGORIES, STORE_TYPES, productGroup, matchesStore, matchesPrice, isTrending, lovedBrands, money, suggestFor, toneLabel, whereSold, type Category, type Product, type StoreType } from "@/lib/data";
import { Button } from '@/components/ui/button';
import { ServiceDiscovery } from '@/components/bare/service-discovery';
import { cn } from '@/lib/utils';
import { AtlasHub } from '@/components/bare/atlas';
import { useBare } from '@/lib/store';
import { formulaById } from '@/lib/formula';

export const Route = createFileRoute("/discover")({
  head: () => ({ meta: [{ title: "Discover Products & Specialists · Becoming Bare" }, { name: "description", content: "Products suggested for your canvas, brands you love, and local specialists." }, { property: "og:title", content: "Discover Products & Specialists · Becoming Bare" }, { property: "og:description", content: "Products suggested for your canvas, brands you love, and local specialists." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Discover,
});

const CATS: (Category | "All")[] = ["All", "Skincare", "Makeup", "Hair", "Body", "Beard", "Nails", "Tools & Accessories"];

function ProductTile({ p, reason }: { p: Product; reason?: string }) {
  const w = whereSold(p);
  const formula = formulaById(p.id);
  return (
    <Link to="/product/$id" params={{ id: p.id }} className="flex min-h-[64px] w-full items-center gap-3 rounded-[28px] bg-oat/95 p-3">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[16px] bg-sand">
        <img src={p.image} alt="" className="h-full w-full object-cover" loading="lazy" />
        {isTrending(p) && <span aria-label="Trending" title="Getting lots of traction" className="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-clay text-oat"><Flame className="h-3 w-3" /></span>}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate text-[11px] uppercase tracking-[0.14em] text-umber">{p.brand}{p.sub ? ` · ${p.sub}` : ''}</p>
        <p className="truncate font-display text-[17px] leading-tight text-cocoa">{p.name}</p>
        <p className="mt-0.5 flex items-center gap-1 truncate text-[12px] text-umber">{w.web && <Globe className="h-3 w-3 shrink-0" />}{w.label} · from {money(w.from)}</p>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-clay"><FlaskConical className="h-3 w-3 shrink-0"/><span className="truncate">{formula ? formula.benefits.slice(0,2).join(" · ") : "Formula not confirmed"}</span></p>
        {reason && <p className="mt-0.5 truncate text-[11px] font-medium text-clay">{reason}</p>}
      </div>
    </Link>
  );
}

function Discover() {
  const { state, browseProfile } = useBare();
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<'products' | 'services' | 'atlas'>('products');
  const [cat, setCat] = useState<Category | "All">("All");
  const [sub, setSub] = useState<string>("All");
  const [store, setStore] = useState<StoreType>("All stores");
  const [price, setPrice] = useState("All prices");
  const ql = q.trim().toLowerCase();
  const loved = lovedBrands(state.savedProducts, state.likedPosts);
  const list = PRODUCTS.filter((p) => (cat === "All" || p.category === cat) && (sub === "All" || productGroup(p) === sub) && matchesStore(p, store) && matchesPrice(p, price) && (!ql || `${p.brand} ${p.name} ${p.claims.join(" ")} ${p.category} ${p.sub ?? ''}`.toLowerCase().includes(ql)))
    .sort((a, b) => (a.trendRank ?? 99) - (b.trendRank ?? 99));
  const browsing = cat === "All" && !ql && store === "All stores" && price === "All prices";
  const suggested = suggestFor(browseProfile, loved).slice(0, 4);
  const fromLoved = PRODUCTS.filter((p) => loved.includes(p.brand) && !state.savedProducts.includes(p.id)).slice(0, 4);
  const launch = PRODUCTS.filter((p) => p.launchpad);
  const pickCat = (c: Category | "All") => { setCat(c); setSub("All"); };

  return (
    <>
      <BareHeader />
      <Page className="mt-5 space-y-6">
        <div className="flex flex-wrap gap-1 border-b border-oat/15 pb-3" aria-label="Discovery type">
          {(['products', 'services', 'atlas'] as const).map(m => <Button key={m} variant="ghost" aria-pressed={mode === m} onClick={() => { setMode(m); setQ(''); }} className={cn('h-11 rounded-full px-3 text-[13px]', mode === m ? 'bg-oat text-cocoa' : 'text-sand hover:bg-cocoa-soft hover:text-oat')}>{m === 'products' ? 'Products' : m === 'services' ? 'Studios & Specialists' : 'Global Atlas'}</Button>)}
        </div>
        {mode !== 'atlas' && <label className="flex h-12 items-center gap-2 rounded-full border border-sand bg-oat/95 px-4 text-cocoa">
          <Search className="h-4 w-4 text-umber" />
          <input aria-label={mode === 'products' ? 'Search products' : 'Search specialists'} value={q} onChange={(e) => setQ(e.target.value)} placeholder={mode === 'products' ? 'Search skincare, sun care, grooming…' : 'Search braids, facials, bridal, studios…'} className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-umber" />
          {q && <Button variant="ghost" size="icon" aria-label="Clear search" onClick={() => setQ('')} className="shrink-0 rounded-full">×</Button>}
        </label>}
        {mode === 'atlas' ? <AtlasHub/> : mode === 'services' ? <ServiceDiscovery query={q} /> : <>
        <div className="space-y-2">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">{CATS.map((c) => <Chip key={c} active={cat === c} onClick={() => pickCat(c)}>{c === "Beard" ? "Grooming" : c}</Chip>)}</div>
          {cat !== "All" && <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4" aria-label={`${cat} types`}>
            {["All", ...SUBCATEGORIES[cat]].map((s) => <Button variant="ghost" key={s} onClick={() => setSub(s)} aria-pressed={sub === s} className={cn("h-9 shrink-0 rounded-full border px-3 text-[12px]", sub === s ? "border-clay bg-clay text-oat" : "border-oat/25 text-sand")}>{s === "All" ? `All ${cat.toLowerCase()}` : s}</Button>)}
          </div>}
        </div>

        <div className="grid grid-cols-2 gap-3"><label className="text-xs text-sand">Where to shop<select aria-label="Store type" value={store} onChange={e=>setStore(e.target.value as StoreType)} className="bare-input">{STORE_TYPES.map(t=><option key={t}>{t}</option>)}</select></label><label className="text-xs text-sand">Price<select aria-label="Price range" value={price} onChange={e=>setPrice(e.target.value)} className="bare-input">{["All prices","Under $15","$15–$35","$35–$70","Luxury ($70+)"].map(t=><option key={t}>{t}</option>)}</select></label></div>
        <p className="text-xs text-sand/80">Sample catalog and prices · care for every skin, texture and routine.</p>
        {browsing && suggested.length > 0 && <section className="space-y-3">
          <SectionTitle meta={<span className="inline-flex items-center gap-1"><Sparkles className="h-3 w-3" />{toneLabel(browseProfile.depth, browseProfile.undertone)}</span>}>Suggested for your canvas</SectionTitle>
          <div className="grid gap-2 md:grid-cols-2">{suggested.map((p) => <ProductTile key={p.id} p={p} reason={loved.includes(p.brand) ? "From a brand you love" : "Suggested from the sample catalog"} />)}</div>
        </section>}

        {browsing && <section className="space-y-3">
          <SectionTitle meta={<span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" />From your likes & saves</span>}>Brands you love</SectionTitle>
          {fromLoved.length ? <div className="grid gap-2 md:grid-cols-2">{fromLoved.map((p) => <ProductTile key={p.id} p={p} reason={`More from ${p.brand}`} />)}</div>
            : <p className="rounded-[28px] border border-oat/15 p-4 text-[13px] text-sand">Like or save posts on your feed and we'll bring you more from those brands here.</p>}
        </section>}

        <section className="space-y-3">
          <SectionTitle meta={<span className="inline-flex items-center gap-1"><Flame className="h-3 w-3" />= getting traction</span>}>{browsing ? "Everything" : sub !== "All" ? sub : cat === "All" ? "Results" : cat}</SectionTitle>
          {list.length === 0 ? (
            <EmptyState title="Nothing matches yet" body={`No products${q ? ` for “${q}”` : ""}${sub !== "All" ? ` in ${sub}` : cat !== "All" ? ` in ${cat}` : ""} yet. Try a broader word or another type.`} action={<Button onClick={() => { setQ(""); pickCat("All"); setStore("All stores"); setPrice("All prices"); }} className="h-11 rounded-full bg-clay px-5 text-[14px] font-semibold text-oat">Clear filters</Button>} />
          ) : <div className="grid gap-2 md:grid-cols-2">{list.map((p) => <ProductTile key={p.id} p={p} />)}</div>}
        </section>

        {browsing && (
          <section className="space-y-3">
            <SectionTitle meta="Launchpad · sponsored">New founders, tested by you</SectionTitle>
            <div className="grid gap-2 md:grid-cols-2">{launch.map((p) => <ProductTile key={p.id} p={p} reason={`${p.founder.name} · ${p.founder.title}`} />)}</div>
          </section>
        )}
        </>}
      </Page>
    </>
  );
}
