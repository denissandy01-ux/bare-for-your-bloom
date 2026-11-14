import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BareHeader, Page, SecondaryButton } from "@/components/bare/kit";
import { FounderSheet, OfferRows, WhereToBuySheet } from "@/components/bare/sheets";
import { FEED, ROUTINES, bestOffer, cashbackFor, pointsFor, money, productById, skinTwinScore } from "@/lib/data";
import { useBare } from "@/lib/store";
import { cn } from "@/lib/utils";
import { FormulaSection } from '@/components/bare/formula';
import { brandForProduct } from '@/lib/atlas';

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
  const { state, toggleProduct } = useBare();
  const [buy, setBuy] = useState(false);
  const [founder, setFounder] = useState(false);
  if (!product) throw notFound();
  const brand=brandForProduct(product.id);
  const offer = bestOffer(product);
  const saved = state.savedProducts.includes(product.id);
  const tests = FEED.filter((f) => f.productId === product.id);
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
        {tests.length > 0 && (
          <div>
            <h2 className="mb-2 px-1 font-display text-[20px]">Wear tests</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {tests.map((t) => (
                <div key={t.id} className="relative overflow-hidden rounded-[28px]">
                  <img src={t.media} alt="" className="aspect-[3/4] w-full object-cover" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cocoa/90 to-transparent p-3 pt-10">
                    <p className="text-[12px] font-semibold text-oat">{t.creator.handle} · {skinTwinScore(t.creator, state.profile)}% Skin Twin</p>
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
