import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  DEPTHS, DEPTH_SWATCH, UNDERTONE_SWATCH, FEED, UNDERTONES, HAIR_TYPES, SKIN_TYPES, money, purchaseQuote, retailerUrl, skinTwinScore, toneLabel,
  type Depth, type Offer, type Product, type Undertone,
} from "@/lib/data";
import { useBare } from "@/lib/store";
import { Button } from '@/components/ui/button';
import { brandForProduct } from '@/lib/atlas';
import { shadeGap, suggestShade, swatchSplit } from '@/lib/shades';

export function BareSheet({ open, onOpenChange, title, description, children }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; description?: string; children: ReactNode }) {
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
  const [fragrance,setFragrance] = useState(state.profile.fragrance ?? '');
  const [refShade,setRefShade] = useState(state.profile.referenceShade ?? '');
  const [silicone,setSilicone] = useState(state.profile.silicone ?? '');
  const [exclusions,setExclusions] = useState(state.profile.exclusions ?? '');
  useEffect(() => { if (open) { setD(state.profile.depth); setU(state.profile.undertone); setHair(state.profile.hair ?? ''); setSkinType(state.profile.skinType ?? ''); setFragrance(state.profile.fragrance ?? ''); setSilicone(state.profile.silicone ?? ''); setExclusions(state.profile.exclusions ?? ''); setRefShade(state.profile.referenceShade ?? ''); } }, [open, state.profile]);
  return (
    <BareSheet open={open} onOpenChange={onOpenChange} title="Your bare canvas" description="Wear tests are matched to creators within one tone of you.">
      <p className="text-[11px] uppercase tracking-[0.14em] text-umber">Depth</p>
      <div className="mt-2 grid grid-cols-5 gap-2">
        {DEPTHS.map((x, i) => (
          <button key={x} onClick={() => setD(x)} aria-pressed={d === x} className={cn("flex flex-col items-center gap-1.5 rounded-[20px] border p-2 text-[12px]", d === x ? "border-clay bg-sand/60 font-semibold" : "border-sand")}>
            <span className={cn("h-9 w-9 rounded-full ring-2", d === x ? "ring-clay" : "ring-oat")} style={{ background: UNDERTONE_SWATCH[x][u] }} />
            {x}<span className="text-[10px] text-umber">Tone {i + 1}</span>
            <span className="flex gap-0.5" aria-hidden>{UNDERTONES.map((un) => <span key={un} className={cn("h-2 w-2 rounded-full", un === u && "ring-1 ring-clay")} style={{ background: UNDERTONE_SWATCH[x][un] }} />)}</span>
          </button>
        ))}
      </div>
      <p className="mt-5 text-[11px] uppercase tracking-[0.14em] text-umber">Undertone</p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {UNDERTONES.map((x) => (
          <button key={x} onClick={() => setU(x)} aria-pressed={u === x} className={cn("h-11 rounded-full text-[13px] font-medium", "flex items-center justify-center gap-1.5", u === x ? "bg-clay text-oat" : "bg-sand/60 text-cocoa")}><span className="h-4 w-4 shrink-0 rounded-full ring-1 ring-oat" style={{ background: UNDERTONE_SWATCH[d][x] }} />{x}</button>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-sm">Hair texture<select value={hair} onChange={e=>setHair(e.target.value)} className="mt-2 w-full rounded-xl border border-sand bg-oat p-3 text-cocoa"><option value="">Not set</option>{HAIR_TYPES.map(x=><option key={x}>{x}</option>)}</select></label><label className="text-sm">Skin type<select value={skinType} onChange={e=>setSkinType(e.target.value)} className="mt-2 w-full rounded-xl border border-sand bg-oat p-3 text-cocoa"><option value="">Not set</option>{SKIN_TYPES.map(x=><option key={x}>{x}</option>)}</select></label></div>
      <label className="mt-5 block text-sm">Your go-to shade today · optional<input value={refShade} maxLength={80} onChange={e=>setRefShade(e.target.value)} className="bare-input" placeholder="e.g. Fenty Pro Filt'r 420"/><span className="mt-1 block text-[12px] text-umber">Helps us find your shade twins. It never changes your tone.</span></label>
      <details className="mt-5 text-sm"><summary className="cursor-pointer font-display text-lg">Formula preferences · optional</summary><label className="mt-3 block">Fragrance<select className="bare-input" value={fragrance} onChange={e=>setFragrance(e.target.value)}><option value="">No preference set</option><option>No preference</option><option>Avoid fragrance</option></select></label><label className="mt-3 block">Silicones<select className="bare-input" value={silicone} onChange={e=>setSilicone(e.target.value)}><option value="">No preference set</option><option>No preference</option><option>Prefer silicone-free</option></select></label><label className="mt-3 block">Ingredient exclusions<input value={exclusions} maxLength={300} onChange={e=>setExclusions(e.target.value)} className="bare-input" placeholder="Optional ingredients you avoid"/></label></details>
      <Button onClick={() => { setCanvas({...state.profile, depth:d, undertone:u, hair, skinType, fragrance, silicone, exclusions, referenceShade: refShade.trim()}); onOpenChange(false); toast('Your canvas updated'); }} className="mt-6 h-14 w-full rounded-full text-[15px] font-semibold">Save my canvas</Button>
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
  const brand = brandForProduct(product.id);
  return (
    <BareSheet open={open} onOpenChange={onOpenChange} title="Founder Story" description={`${product.founder.name} · ${product.founder.title}`}>
      <img src={product.image} alt={product.name} className="aspect-[4/3] w-full rounded-[28px] object-cover" />
      {brand && <Link to="/brand/$id" params={{id:brand.id}} onClick={()=>onOpenChange(false)} className="mt-4 block font-display text-lg text-clay">Meet {brand.name} · Founder Story →</Link>}
      <div className="mt-4 flex flex-wrap gap-2">{product.claims.map((c) => <span key={c} className="rounded-full bg-sand/60 px-3 py-1.5 text-[12px]">{c}</span>)}</div>
      <Link to="/product/$id" params={{ id: product.id }} onClick={() => onOpenChange(false)} className="mt-6 flex h-14 w-full items-center justify-center rounded-full bg-clay text-[15px] font-semibold text-oat">See product & wear tests</Link>
    </BareSheet>
  );
}

export function SwatchSheet({ product, count, open, onOpenChange }: { product: Product; count: number; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { state } = useBare();
  const me = state.profile;
  const posts = FEED.filter((f) => f.productId === product.id);
  const split = swatchSplit(count, posts.map((p) => p.creator.depth));
  const mine = split.find((x) => x.depth === me.depth)!;
  const twins = Math.round(mine.n * (me.undertone === "Neutral" ? 0.4 : 0.3));
  const concern = me.skinType ? Math.round(twins * 0.45) : null;
  const gap = shadeGap(split);
  const suggestion = suggestShade(product.id, me);
  const shadeCreators = posts.filter((p) => p.creator.shade);
  return (
    <BareSheet open={open} onOpenChange={onOpenChange} title="On your canvas" description={`${product.name} · sample swatch counts`}>
      <div className="rounded-[22px] bg-cocoa p-4 text-oat">
        <p className="text-[12px] uppercase tracking-[0.14em] text-sand">Your shade twins</p>
        <p className="mt-1 font-display text-[30px] leading-tight">{twins} <span className="text-[16px]">verified on {me.depth} {me.undertone}</span></p>
        {concern !== null && <p className="mt-1 text-[13px] text-sand">{concern} of them also have {me.skinType?.toLowerCase()} skin</p>}
      </div>
      {suggestion && (
        <div className="mt-4 rounded-[22px] border border-sand p-4">
          <p className="text-[12px] uppercase tracking-[0.14em] text-umber">Shade to try</p>
          <p className="mt-1 font-display text-[24px]">{suggestion.code} <span className="mx-1 inline-block h-5 w-5 rounded-full align-middle ring-2 ring-oat" style={{ background: UNDERTONE_SWATCH[suggestion.depth][suggestion.undertone] }} /><span className="text-[14px] text-umber">· {suggestion.depth} {suggestion.undertone}</span></p>
          {shadeCreators.map((p) => <p key={p.id} className="mt-1 text-[13px]">{p.creator.handle} wears {p.creator.shade}{p.creator.shade === suggestion.code ? " · same as your shade" : ""} · {skinTwinScore(p.creator, me)}% Skin Twin</p>)}
          {me.referenceShade && <p className="mt-1 text-[13px] text-umber">Your go-to: {me.referenceShade}</p>}
          <p className="mt-2 text-[12px] text-umber">A starting point, not a guarantee. Swatch on your jaw in daylight.</p>
        </div>
      )}
      {!suggestion && posts.map((p) => <p key={p.id} className="mt-4 text-[13px] text-umber">{p.creator.handle} · {p.creator.depth} {p.creator.undertone} · {skinTwinScore(p.creator, me)}% Skin Twin</p>)}
      <details className="mt-5">
        <summary className="cursor-pointer font-display text-[18px]">Full spectrum · {count} swatches</summary>
        <ul className="mt-3 space-y-3">
          {split.map(({ depth: d, share, n }) => (
            <li key={d} className="flex items-center gap-3">
              <span className={cn("h-8 w-8 shrink-0 rounded-full ring-2", me.depth === d ? "ring-clay" : "ring-oat")} style={{ background: DEPTH_SWATCH[d] }} />
              <span className="w-16 text-[14px]">{d}<span className="mt-1 flex gap-0.5">{UNDERTONES.map((un) => <span key={un} title={`${d} ${un}`} className={cn("h-2.5 w-2.5 rounded-full", me.depth === d && me.undertone === un && "ring-1 ring-clay")} style={{ background: UNDERTONE_SWATCH[d][un] }} />)}</span></span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-sand"><span className="block h-full rounded-full bg-clay" style={{ width: `${(share / Math.max(...split.map((x) => x.share))) * 100}%` }} /></span>
              <span className="w-10 text-right text-[13px] tabular-nums text-umber">{n}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] text-umber">Fewest swatches on {gap.depth} skin. More {gap.depth.toLowerCase()} wear tests would make this match stronger.</p>
      </details>
    </BareSheet>
  );
}
