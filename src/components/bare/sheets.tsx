import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  DEPTHS, DEPTH_SWATCH, FEED, UNDERTONES, HAIR_TYPES, SKIN_TYPES, money, purchaseQuote, retailerUrl, skinTwinScore, toneLabel,
  type Depth, type Offer, type Product, type Undertone,
} from "@/lib/data";
import { useBare } from "@/lib/store";
import { Button } from '@/components/ui/button';

function BareSheet({ open, onOpenChange, title, description, children }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; description?: string; children: ReactNode }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[88dvh] max-w-lg overflow-y-auto rounded-t-[28px] border-sand bg-oat px-5 pb-8 pt-6 text-cocoa">
        <SheetHeader className="text-left">
          <SheetTitle className="font-display text-[24px] font-normal text-cocoa">{title}</SheetTitle>
          {description && <SheetDescription className="text-[14px] text-umber">{description}</SheetDescription>}
        </SheetHeader>
        <div className="mt-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

export function ToneSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { state, setCanvas } = useBare();
  const [d, setD] = useState<Depth>(state.profile.depth);
  const [u, setU] = useState<Undertone>(state.profile.undertone);
  const [hair,setHair] = useState(state.profile.hair ?? '');
  const [skinType,setSkinType] = useState(state.profile.skinType ?? '');
  useEffect(() => { if (open) { setD(state.profile.depth); setU(state.profile.undertone); setHair(state.profile.hair ?? ''); setSkinType(state.profile.skinType ?? ''); } }, [open, state.profile]);
  return (
    <BareSheet open={open} onOpenChange={onOpenChange} title="Your bare canvas" description="Wear tests are matched to creators within one tone of you.">
      <p className="text-[11px] uppercase tracking-[0.14em] text-umber">Depth</p>
      <div className="mt-2 grid grid-cols-5 gap-2">
        {DEPTHS.map((x, i) => (
          <button key={x} onClick={() => setD(x)} aria-pressed={d === x} className={cn("flex flex-col items-center gap-1.5 rounded-[20px] border p-2 text-[12px]", d === x ? "border-clay bg-sand/60 font-semibold" : "border-sand")}>
            <span className={cn("h-9 w-9 rounded-full ring-2", d === x ? "ring-clay" : "ring-oat")} style={{ background: DEPTH_SWATCH[x] }} />
            {x}<span className="text-[10px] text-umber">Tone {i + 1}</span>
          </button>
        ))}
      </div>
      <p className="mt-5 text-[11px] uppercase tracking-[0.14em] text-umber">Undertone</p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {UNDERTONES.map((x) => (
          <button key={x} onClick={() => setU(x)} aria-pressed={u === x} className={cn("h-11 rounded-full text-[13px] font-medium", u === x ? "bg-clay text-oat" : "bg-sand/60 text-cocoa")}>{x}</button>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-sm">Hair texture<select value={hair} onChange={e=>setHair(e.target.value)} className="mt-2 w-full rounded-xl border border-sand bg-oat p-3 text-cocoa"><option value="">Not set</option>{HAIR_TYPES.map(x=><option key={x}>{x}</option>)}</select></label><label className="text-sm">Skin type<select value={skinType} onChange={e=>setSkinType(e.target.value)} className="mt-2 w-full rounded-xl border border-sand bg-oat p-3 text-cocoa"><option value="">Not set</option>{SKIN_TYPES.map(x=><option key={x}>{x}</option>)}</select></label></div>
      <Button onClick={() => { setCanvas({...state.profile, depth:d, undertone:u, hair, skinType}); onOpenChange(false); toast('Your canvas updated'); }} className="mt-6 h-14 w-full rounded-full text-[15px] font-semibold">Save my canvas</Button>
      <Link to="/consultation" onClick={() => onOpenChange(false)} className="mt-3 block text-center font-display text-[15px] italic text-clay">Not sure? Take the Canvas Consultation</Link>
    </BareSheet>
  );
}

/** Opens the retailer and logs pending cashback. */
export function useShop() {
  const { recordPurchase } = useBare();
  return (product: Product, offer: Offer, discount = 0, rate = product.cashbackRate, code?: string) => {
    const q = purchaseQuote(offer.price, rate, discount);
    window.open(retailerUrl(offer.retailer, product), "_blank", "noopener");
    recordPurchase(`${product.name} · ${offer.retailer}${code ? ` · ${code}` : ""}`, q.cashback);
    toast(`${money(q.cashback)} cashback is tracking`, { description: `Pending until ${offer.retailer} confirms your order.`, action: { label: "Wallet", onClick: () => { window.location.href = "/wallet"; } } });
  };
}

export function OfferRows({ product, discount = 0, rate, code, tone = "dark" }: { product: Product; discount?: number; rate?: number; code?: string; tone?: "dark" | "light" }) {
  const shop = useShop();
  const cheapest = Math.min(...product.offers.filter((o) => o.stock !== "Out of Stock").map((o) => o.price));
  return (
    <ul>
      {product.offers.map((o, i) => {
        const out = o.stock === "Out of Stock";
        return (
          <li key={o.retailer} className={cn(i > 0 && (tone === "dark" ? "border-t border-oat/10" : "border-t border-sand"))}>
            <button disabled={out} onClick={() => shop(product, o, discount, rate, code)} className="grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 py-5 text-left disabled:opacity-50">
              <span className={cn("truncate text-[17px]", tone === "dark" ? "text-oat" : "text-cocoa")}>
                {o.retailer}
                {o.price === cheapest && product.offers.length > 1 && <span className="ml-2 align-middle text-[10px] uppercase tracking-[0.14em] text-peach">Lowest</span>}
              </span>
              <span className={cn("text-[13px]", o.stock === "Low Stock" ? "font-semibold text-clay" : tone === "dark" ? "text-sand/80" : "text-umber")}>{o.stock}</span>
              <span className={cn("text-[17px] font-semibold tabular-nums", tone === "dark" ? "text-oat" : "text-cocoa")}>{money(o.price)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function WhereToBuySheet({ product, open, onOpenChange }: { product: Product; open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <BareSheet open={open} onOpenChange={onOpenChange} title="Where to buy" description={`${product.brand} ${product.name} · earn ${Math.round(product.cashbackRate * 100)}% back wherever you check out.`}>
      <OfferRows product={product} tone="light" />
      <p className="mt-2 flex items-center gap-1.5 text-[12px] text-umber"><ExternalLink className="h-3 w-3" />Opens the store in a new tab. Cashback shows as pending in your wallet.</p>
    </BareSheet>
  );
}

export function FounderSheet({ product, open, onOpenChange }: { product: Product; open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <BareSheet open={open} onOpenChange={onOpenChange} title="Founder Story" description={`${product.founder.name} · ${product.founder.title}`}>
      <img src={product.image} alt={product.name} className="aspect-[4/3] w-full rounded-[28px] object-cover" />
      <p className="mt-4 text-[15px] leading-relaxed">{product.founder.story}</p>
      <div className="mt-4 flex flex-wrap gap-2">{product.claims.map((c) => <span key={c} className="rounded-full bg-sand/60 px-3 py-1.5 text-[12px]">{c}</span>)}</div>
      <Link to="/product/$id" params={{ id: product.id }} onClick={() => onOpenChange(false)} className="mt-6 flex h-14 w-full items-center justify-center rounded-full bg-clay text-[15px] font-semibold text-oat">See product & wear tests</Link>
    </BareSheet>
  );
}

export function SwatchSheet({ product, count, open, onOpenChange }: { product: Product; count: number; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { state } = useBare();
  const posts = FEED.filter((f) => f.productId === product.id);
  // Spread the verified swatch count across depths, weighted to the posts' creators.
  const dist = DEPTHS.map((d) => {
    const w = posts.reduce((a, p) => a + Math.max(0, 3 - Math.abs(DEPTHS.indexOf(p.creator.depth) - DEPTHS.indexOf(d))), 0) + 1;
    return { d, w };
  });
  const total = dist.reduce((a, x) => a + x.w, 0);
  return (
    <BareSheet open={open} onOpenChange={onOpenChange} title={`${count} verified swatches`} description={`Community wear tests of ${product.name}, by tone.`}>
      <ul className="space-y-3">
        {dist.map(({ d, w }) => {
          const n = Math.round((w / total) * count);
          return (
            <li key={d} className="flex items-center gap-3">
              <span className={cn("h-8 w-8 shrink-0 rounded-full ring-2", state.profile.depth === d ? "ring-clay" : "ring-oat")} style={{ background: DEPTH_SWATCH[d] }} />
              <span className="w-16 text-[14px]">{d}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-sand"><span className="block h-full rounded-full bg-clay" style={{ width: `${(w / total) * 100}%` }} /></span>
              <span className="w-10 text-right text-[13px] tabular-nums text-umber">{n}</span>
            </li>
          );
        })}
      </ul>
      {posts.map((p) => (
        <p key={p.id} className="mt-4 text-[13px] text-umber">{p.creator.handle} · {p.creator.depth} {p.creator.undertone} · {skinTwinScore(p.creator, state.profile)}% Skin Twin</p>
      ))}
    </BareSheet>
  );
}
