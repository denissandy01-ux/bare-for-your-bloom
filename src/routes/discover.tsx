import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { BareHeader, Chip, EmptyState, ListRow, Page, SectionTitle } from "@/components/bare/kit";
import { PRODUCTS, bestOffer, money, type Category } from "@/lib/data";
import { Button } from '@/components/ui/button';
import { ServiceDiscovery } from '@/components/bare/service-discovery';
import { cn } from '@/lib/utils';

export const Route = createFileRoute("/discover")({
  head: () => ({ meta: [{ title: "Discover Products & Specialists · Becoming Bare" }, { name: "description", content: "Find beauty products and local hair, skin, nail, makeup and barbering specialists for your canvas." }, { property: "og:title", content: "Discover Products & Specialists · Becoming Bare" }, { property: "og:description", content: "Explore products, studios, specialties, tones and textures in one place." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Discover,
});

const CATS: (Category | "All")[] = ["All", "Skincare", "Makeup", "Hair", "Body", "Beard"];

function Discover() {
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<'products' | 'services'>('products');
  const [cat, setCat] = useState<Category | "All">("All");
  const ql = q.trim().toLowerCase();
  const list = PRODUCTS.filter((p) => (cat === "All" || p.category === cat) && (!ql || `${p.brand} ${p.name} ${p.claims.join(" ")} ${p.category}`.toLowerCase().includes(ql)))
    .sort((a, b) => (a.trendRank ?? 99) - (b.trendRank ?? 99));
  const launch = PRODUCTS.filter((p) => p.launchpad);

  return (
    <>
      <BareHeader />
      <Page className="mt-5 space-y-6">
        <div className="flex gap-1 border-b border-oat/15 pb-3" aria-label="Discovery type">
          {(['products', 'services'] as const).map(m => <Button key={m} variant="ghost" aria-pressed={mode === m} onClick={() => { setMode(m); setQ(''); }} className={cn('h-11 rounded-full px-4 text-[14px]', mode === m ? 'bg-oat text-cocoa' : 'text-sand hover:bg-cocoa-soft hover:text-oat')}>{m === 'products' ? 'Products' : 'Studios & Specialists'}</Button>)}
        </div>
        <label className="flex h-12 items-center gap-2 rounded-full border border-sand bg-oat/95 px-4 text-cocoa">
          <Search className="h-4 w-4 text-umber" />
          <input aria-label={mode === 'products' ? 'Search products' : 'Search specialists'} value={q} onChange={(e) => setQ(e.target.value)} placeholder={mode === 'products' ? 'Search SPF, curl gel, razor bumps…' : 'Search braids, facials, bridal, studios…'} className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-umber" />
          {q && <Button variant="ghost" size="icon" aria-label="Clear search" onClick={() => setQ('')} className="shrink-0 rounded-full">×</Button>}
        </label>
        {mode === 'services' ? <ServiceDiscovery query={q} /> : <>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">{CATS.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}</div>

        <section className="space-y-3">
          <SectionTitle meta="Trending this week">Most-tested by the community</SectionTitle>
          {list.length === 0 ? (
            <EmptyState title="Nothing matches yet" body={`No products for “${q}”${cat !== "All" ? ` in ${cat}` : ""}. Try a broader word or another category.`} action={<button onClick={() => { setQ(""); setCat("All"); }} className="h-11 rounded-full bg-clay px-5 text-[14px] font-semibold text-oat">Clear search</button>} />
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              {list.map((p, i) => {
                const o = bestOffer(p);
                return <ListRow key={p.id} to="/product/$id" params={{ id: p.id }} image={p.image} title={<><span className="mr-1.5 text-clay">{i + 1}</span>{p.name}</>} meta={`${p.brand} · ${o.retailer} · ${money(o.price)} · ${Math.round(p.cashbackRate * 100)}% back`} />;
              })}
            </div>
          )}
        </section>

        {cat === "All" && !ql && (
          <section className="space-y-3">
            <SectionTitle meta="Launchpad · sponsored">New founders, tested by you</SectionTitle>
            <div className="grid gap-3 md:grid-cols-2">
              {launch.map((p) => (
                <ListRow key={p.id} to="/product/$id" params={{ id: p.id }} image={p.image} title={p.brand} meta={`${p.founder.name} · ${p.founder.title}`} />
              ))}
            </div>
          </section>
        )}
        </>}
      </Page>
    </>
  );
}
