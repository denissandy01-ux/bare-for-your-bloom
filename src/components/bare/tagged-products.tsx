import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { money, productById, whereSold, type Product } from '@/lib/data';

/** Resolve tagged product IDs to unique catalog products, preserving tag order. */
export function taggedProducts(ids: (string | null | undefined)[]): Product[] {
  return [...new Set(ids.filter((x): x is string => !!x))].map(productById).filter((p): p is Product => !!p);
}

/** Compact multi-product bar for the mobile feed. Fit is shown only when the caller can compute it. */
export function TaggedProductsBar({ products, fit }: { products: Product[]; fit?: (p: Product) => number | undefined }) {
  const [open, setOpen] = useState(false);
  const from = Math.min(...products.map(p => whereSold(p).from));
  const extra = products.length - 3;
  return <>
    <div className="flex items-center gap-2 rounded-[22px] bg-cocoa/45 p-2 text-oat backdrop-blur-md">
      {products.slice(0, 3).map(p => { const f = fit?.(p); return <Link key={p.id} to="/product/$id" params={{ id: p.id }} aria-label={p.name} className="relative shrink-0"><img src={p.image} alt="" className="h-12 w-12 rounded-[14px] object-cover" />{f !== undefined && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-cocoa px-1.5 text-[9px] font-semibold text-peach">{f}%</span>}</Link>; })}
      {extra > 0 && <button onClick={() => setOpen(true)} className="grid h-12 w-10 shrink-0 place-items-center rounded-[14px] bg-oat/15 text-sm font-semibold">+{extra}</button>}
      <button onClick={() => setOpen(true)} className="flex min-w-0 flex-1 items-center gap-1 border-l border-oat/25 pl-3 text-left">
        <span className="min-w-0 flex-1"><span className="block font-display text-[16px] leading-tight">{products.length} Products</span><span className="block truncate text-[12px] text-sand">from {money(from)}</span></span><ChevronRight className="h-5 w-5 shrink-0" />
      </button>
    </div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="me-surface"><DialogHeader><DialogTitle>In this post ({products.length})</DialogTitle></DialogHeader>
      <ul className="max-h-[60vh] space-y-3 overflow-y-auto">{products.map(p => { const f = fit?.(p); return <li key={p.id}><Link to="/product/$id" params={{ id: p.id }} className="flex items-center gap-3"><img src={p.image} alt="" className="h-14 w-14 rounded-lg object-cover" /><span className="min-w-0 flex-1"><span className="block text-xs text-muted-foreground">{p.brand}</span><span className="block truncate font-display">{p.name}</span><span className="block text-xs text-muted-foreground">{whereSold(p).label} · from {money(whereSold(p).from)}{f !== undefined ? ` · ${f}% Fit` : ''}</span></span><ChevronRight className="h-4 w-4" /></Link></li>; })}</ul>
    </DialogContent></Dialog>
  </>;
}
