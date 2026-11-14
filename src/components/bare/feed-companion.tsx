import { Link } from '@tanstack/react-router';
import { ArrowRight, Bookmark, FlaskConical } from 'lucide-react';
import { money, productById, whereSold, PRODUCTS } from '@/lib/data';
import { formulaById, canvasInsights } from '@/lib/formula';
import { useBare } from '@/lib/store';
import { Button } from '@/components/ui/button';

/** Desktop-only panel: shows the product from the post currently on screen. */
export function FeedCompanion({ productId }: { productId?: string | undefined }) {
  const { state, toggleProduct, browseProfile } = useBare();
  const p = productId ? productById(productId) : undefined;
  if (!p) return <aside className="hidden lg:block w-[360px]" />;
  const sold = whereSold(p);
  const f = formulaById(p.id);
  const saved = state.savedProducts.includes(p.id);
  const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 3);
  return (
    <aside aria-label="Product from this post" className="hidden lg:flex h-dvh w-[360px] shrink-0 flex-col gap-4 overflow-y-auto py-6 text-oat">
      <p className="text-xs uppercase tracking-[0.2em] text-sand">In this post</p>
      <img src={p.image} alt={p.name} className="aspect-square w-full rounded-2xl object-cover" />
      <div><p className="text-xs text-peach">{p.brand} · {p.category}</p><h2 className="font-display text-2xl leading-tight">{p.name}</h2><p className="mt-1 text-sm text-sand">From {money(sold.from)} · {sold.label}</p></div>
      <div className="flex gap-2">
        <Button asChild className="flex-1"><Link to="/product/$id" params={{ id: p.id }}>View product <ArrowRight className="h-4 w-4" /></Link></Button>
        <Button variant="secondary" aria-pressed={saved} onClick={() => toggleProduct(p.id)}><Bookmark className={saved ? 'h-4 w-4 fill-current' : 'h-4 w-4'} />{saved ? 'Saved' : 'Save'}</Button>
      </div>
      <section className="rounded-2xl border border-oat/15 p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold"><FlaskConical className="h-4 w-4 text-peach" />Inside the Formula</h3>
        {f ? <ul className="mt-2 space-y-1 text-sm text-sand">{f.benefits.slice(0, 3).map(b => <li key={b}>· {b}</li>)}</ul> : <p className="mt-2 text-sm text-sand">Formula not confirmed yet.</p>}
        <p className="mt-3 text-xs text-sand">{canvasInsights(p, browseProfile)[0]}</p>
      </section>
      {related.length > 0 && <section><h3 className="text-sm font-semibold">More in {p.category}</h3><div className="mt-2 grid grid-cols-3 gap-2">{related.map(r => <Link key={r.id} to="/product/$id" params={{ id: r.id }} className="min-w-0"><img src={r.image} alt={r.name} className="aspect-square w-full rounded-xl object-cover" /><p className="mt-1 truncate text-xs text-sand">{r.name}</p></Link>)}</div></section>}
    </aside>
  );
}
