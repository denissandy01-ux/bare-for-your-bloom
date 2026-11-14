import { Link } from '@tanstack/react-router';
import { ArrowRight, Bookmark, FlaskConical, MapPin, Store } from 'lucide-react';
import { specialistById, handleFor } from '@/lib/specialists';
import { ShareButton } from '@/components/bare/share-button';
import { FollowPill } from '@/components/bare/follow-pill';
import { money, productById, whereSold, PRODUCTS } from '@/lib/data';
import { formulaById, canvasInsights } from '@/lib/formula';
import { useBare } from '@/lib/store';
import { Button } from '@/components/ui/button';

/** Desktop-only panel: shows the product from the post currently on screen. */
export function FeedCompanion({ productId, specialistId }: { productId?: string | undefined; specialistId?: string | undefined }) {
  const { state, toggleProduct, browseProfile } = useBare();
  if (specialistId) return <StudioCompanion id={specialistId} />;
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

/** Curated, link-in-bio style preview of the studio behind a service post. Sample listing data. */
function StudioCompanion({ id }: { id: string }) {
  const { state, toggleSpecialist, toggleCreator } = useBare();
  const s = specialistById(id);
  if (!s) return <aside className="hidden lg:block w-[360px]" />;
  const saved = state.savedSpecialists.includes(s.id);
  const handle = handleFor(s);
  const maps = `https://www.google.com/maps/search/?api=1&query=${s.point.lat},${s.point.lng}`;
  const shelf = s.shelf.map(x => ({ ...x, p: productById(x.productId) })).filter(x => x.p);
  return (
    <aside key={s.id} aria-label="Studio from this post" className="hidden lg:flex h-dvh w-[360px] shrink-0 flex-col gap-4 overflow-y-auto py-6 text-oat animate-in fade-in duration-300">
      <p className="text-xs uppercase tracking-[0.2em] text-sand">Studio in this post</p>
      <div className="flex flex-col items-center text-center">
        <img src={s.image} alt={s.name} className="h-24 w-24 rounded-full object-cover ring-2 ring-peach" />
        <span className="mt-3 rounded-full bg-oat/10 px-3 py-1 text-[11px] text-peach">{s.discipline} · {s.credential}</span>
        <h2 className="mt-2 font-display text-2xl leading-tight">{s.studio}</h2>
        <p className="text-sm text-sand">{s.name} · {handle}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-sand"><MapPin className="h-3 w-3" />{s.neighborhood}, {s.city}</p>
        <div className="mt-3 flex items-center gap-2">
          <Button size="sm" variant="secondary" aria-pressed={saved} onClick={() => toggleSpecialist(s.id)}><Bookmark className={saved ? 'h-4 w-4 fill-current' : 'h-4 w-4'} />{saved ? 'Saved' : 'Save'}</Button>
          <FollowPill following={state.followedCreators.includes(handle)} onToggle={() => toggleCreator(handle)} label={handle} />
        </div>
      </div>
      <nav aria-label="Studio links" className="flex flex-col gap-2">
        <Button asChild><Link to="/specialist/$id" params={{ id: s.id }}><Store className="h-4 w-4" />View studio & reviews</Link></Button>
        <Button asChild variant="secondary"><a href={maps} target="_blank" rel="noreferrer"><MapPin className="h-4 w-4" />Get directions</a></Button>
        <ShareButton title={s.studio} path={`/specialist/${s.id}`} variant="secondary" label="Share artist" />
      </nav>
      <section className="rounded-2xl border border-oat/15 p-4">
        <h3 className="text-sm font-semibold">Popular services</h3>
        <ul className="mt-2 space-y-2">{s.services.slice(0, 3).map(v => <li key={v.name} className="flex justify-between gap-2 text-sm"><span className="min-w-0 truncate">{v.name}<span className="block text-xs text-sand">{v.minutes} min</span></span><span className="text-peach">{money(v.price)}</span></li>)}</ul>
        <p className="mt-3 text-[11px] text-sand">Sample listing — prices are illustrative.</p>
      </section>
      {shelf.length > 0 && <section><h3 className="text-sm font-semibold">Studio shelf</h3><div className="mt-2 grid grid-cols-3 gap-2">{shelf.map(x => <Link key={x.productId} to="/product/$id" params={{ id: x.productId }} className="min-w-0"><img src={x.p!.image} alt={x.p!.name} className="aspect-square w-full rounded-xl object-cover" /><p className="mt-1 truncate text-xs text-sand">{x.p!.name}</p><p className="text-[10px] text-peach">{x.role}</p></Link>)}</div></section>}
    </aside>
  );
}
