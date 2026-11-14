import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BareHeader, Page, SecondaryButton } from "@/components/bare/kit";
import { FounderSheet, OfferRows, WhereToBuySheet } from "@/components/bare/sheets";
import { FEED, ROUTINES, bestOffer, cashbackFor, pointsFor, money, productById, fitScore, matchKind, MATCH_LABEL } from "@/lib/data";
import { useBare } from "@/lib/store";
import { cn } from "@/lib/utils";
import { FormulaSection } from '@/components/bare/formula';
import { brandForProduct } from '@/lib/atlas';
import { useQuery } from '@tanstack/react-query';
import { communityOptions } from '@/lib/community-query';
import { collectEmpties, emptyVerdict } from '@/lib/empties';

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => { if (!productById(params.id)) throw notFound(); return { id: params.id }; },
  head: ({ loaderData }) => {
    const p = loaderData ? productById(loaderData.id) : undefined;
    const title = p ? `${p.brand} ${p.name} · Becoming Bare` : "Product · Becoming Bare";
    const desc = p ? `${p.claims.join(", ")}. Compare prices and earn ${Math.round(p.cashbackRate * 100)}% cashback.` : "Product wear tests and prices.";
    return { meta: [{ title }, { name: "description", content: desc }, { property: "og:title", content: title }, { property: "og:description", content: desc }, { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useLoaderData();
  const product = productById(id);
  const { state, browseProfile, toggleProduct } = useBare();
  const [buy, setBuy] = useState(false);
  const [founder, setFounder] = useState(false);
  const community = useQuery(communityOptions);
  if (!product) throw notFound();
  const brand=brandForProduct(product.id);
  const offer = bestOffer(product);
  const saved = state.savedProducts.includes(product.id);
  const tests = FEED.filter((f) => f.productId === product.id);
  const verdict = emptyVerdict(collectEmpties(community.data ?? [], state.emptyBottles), id);
  const routines = ROUTINES.filter((r) => r.steps.some((s) => s.productId === product.id));

  return (
    <>
      <BareHeader />
      <Page className="mt-5 space-y-4 pb-[calc(var(--tabs-h)+96px)] md:pb-28">
        <div className="grid gap-4 md:grid-cols-2">
          <img src={product.image} alt={product.name} className="aspect-[4/5] w-full rounded-[28px] object-cover" />
          <div className="space-y-4">
            <div className="rounded-[28px] bg-oat p-5 text-cocoa">
              <p className="text-[11px] uppercase tracking-[0.14em] text-umber">{brand ? <Link to="/brand/$id" params={{id:brand.id}} className="underline">{product.brand}</Link> : product.brand} · {product.category}</p>
              <h1 className="mt-1 font-display text-[28px] leading-tight">{product.name}</h1>
              <p className="mt-1 text-[14px] text-umber">{offer.retailer} · {money(offer.price)}</p>
              <div className="mt-3 flex flex-wrap gap-2">{product.claims.map((c) => <span key={c} className="rounded-full bg-sand/60 px-3 py-1.5 text-[12px]">{c}</span>)}</div>
              <div className="mt-4 flex items-center gap-2">
                <SecondaryButton onClick={() => setFounder(true)}>Founder Story</SecondaryButton>
                <button onClick={() => { const a = toggleProduct(product.id); toast(a ? "Saved to your shelf" : "Removed from saved"); }} aria-pressed={saved} className="inline-flex h-11 items-center gap-1.5 rounded-full bg-sand/60 px-4 text-[13px] font-medium"><Bookmark className={cn("h-4 w-4", saved && "fill-current")} />{saved ? "Saved" : "Save"}</button>
              </div>
            </div>
            <div className="rounded-[28px] border border-oat/10 bg-cocoa-soft px-5 pb-2 pt-5">
              <h2 className="font-display text-[20px] text-oat">Where to buy</h2>
              <OfferRows product={product} />
            </div>
          </div>
        </div>

        <FormulaSection product={product}/>
        <section className="space-y-3 rounded-[28px] border border-oat/15 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="font-display text-[20px]">Empty Bottle Club</h2><Link to="/empty-bottle" className="text-[12px] text-peach">Log an empty →</Link></div>
          {verdict ? <>
            <div className="grid grid-cols-3 gap-2 text-center">{[[`${verdict.repurchasePct}%`,'would buy again'],[`${verdict.avgWeeks} wks`,'average to finish'],[String(verdict.count),verdict.count===1?'empty logged':'empties logged']].map(([n,l])=><div key={l} className="rounded-2xl bg-cocoa-soft p-3"><p className="font-display text-[22px] text-oat">{n}</p><p className="text-[11px] text-sand">{l}</p></div>)}</div>
            <ul className="space-y-2">{verdict.entries.slice(0,4).map((e,i)=><li key={i} className="border-b border-oat/10 pb-2 text-[13px]"><span className="text-peach">{e.weeks} weeks · {e.repurchase?'Would repurchase':'Would not repurchase'}</span>{e.source==='you'&&<span className="text-sand"> · your log</span>}{e.note&&<p className="mt-1 text-sand">{e.note}</p>}</li>)}</ul>
          </> : <p className="text-[13px] text-sand">No one has finished this one yet. Be the first to log how long it lasted and whether you'd buy it again.</p>}
        </section>
        {tests.length > 0 && (
          <div>
            <h2 className="mb-2 px-1 font-display text-[20px]">Wear tests</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {tests.map((t) => (
                <div key={t.id} className="relative overflow-hidden rounded-[28px]">
                  <img src={t.media} alt="" className="aspect-[3/4] w-full object-cover" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cocoa/90 to-transparent p-3 pt-10">
                    <p className="text-[12px] font-semibold text-oat">{t.creator.handle} · {fitScore(product, t.creator, browseProfile)}% {MATCH_LABEL[matchKind(product)]}</p>
                    <p className="text-[11px] text-sand">{t.wearTest}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {routines.length > 0 && (
          <div className="space-y-2">
            <h2 className="px-1 font-display text-[20px]">Used in pro routines</h2>
            {routines.map((r) => <Link key={r.id} to="/routine/$id" params={{ id: r.id }} className="block rounded-[28px] bg-oat/95 p-4 font-display text-[17px] text-cocoa">{r.title} <em className="text-umber">{r.subtitle}</em></Link>)}
          </div>
        )}
      </Page>
      <div className="fixed inset-x-3 bottom-[calc(var(--tabs-h)+10px)] z-20 md:bottom-4 md:left-[calc(14rem+12px)]">
        <button onClick={() => setBuy(true)} className="mx-auto flex h-14 w-full max-w-[480px] items-center justify-center gap-2 rounded-full bg-clay text-[15px] font-semibold text-oat shadow-lg">
          Shop & earn points <span className="rounded-full bg-oat/20 px-2 py-0.5 text-[13px]">+{pointsFor(offer?.price ?? 0)} pts</span>
        </button>
      </div>
      <WhereToBuySheet product={product} open={buy} onOpenChange={setBuy} />
      <FounderSheet product={product} open={founder} onOpenChange={setFounder} />
    </>
  );
}
