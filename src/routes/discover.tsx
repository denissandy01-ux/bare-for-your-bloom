import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeft, ChevronRight, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Page } from '@/components/bare/kit';
import { AtlasHub } from '@/components/bare/atlas';
import { ServiceDiscovery } from '@/components/bare/service-discovery';
import { DiscoverHeader, DiscoveryCanvas } from '@/components/bare/discover-chrome';
import { DiscoverProductCard } from '@/components/bare/discover-product-card';
import { ReviewSection } from '@/components/bare/discovery-reviews';
import { PRODUCTS, STORE_TYPES, matchesPrice, matchesStore, lovedBrands, suggestFor, type Category, type StoreType } from '@/lib/data';
import { DISCOVER_CATEGORIES, categoryLabel, categoryGroups, productTypes, matchesCategory } from '@/lib/discover-catalog';
import { ratingSummary } from '@/lib/discover-reviews';
import { publishedReviews } from '@/lib/beauty-reviews';
import { beautyReviewsOptions } from '@/lib/beauty-reviews-query';
import { communityOptions } from '@/lib/community-query';
import { useBare } from '@/lib/store';
import { matchesCanvasProduct } from '@/lib/canvas-discovery';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/discover')({
  head: () => ({ meta: [{ title: 'Discover Beauty & Specialists · Becoming Bare' }, { name: 'description', content: 'Explore beauty for your canvas, local specialists, global brands and published community reviews.' }, { property: 'og:title', content: 'Discover Beauty & Specialists · Becoming Bare' }, { property: 'og:description', content: 'Shop by category and discover real published beauty experiences.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Discover,
});
function Discover() {
  const { state, browseProfile } = useBare();
  const [mode, setMode] = useState<'products' | 'services' | 'atlas'>('products');
  const [atlasPath, setAtlasPath] = useState<'products' | 'services'>('products');
  const [q, setQ] = useState('');
  const [canvasOnly, setCanvasOnly] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [group, setGroup] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [results, setResults] = useState(false);
  const [reviewsView, setReviewsView] = useState(false);
  const [filter, setFilter] = useState('All');
  const [filters, setFilters] = useState(false);
  const [store, setStore] = useState<StoreType>('All stores');
  const [price, setPrice] = useState('All prices');
  const community = useQuery(communityOptions);
  const records = useQuery(beautyReviewsOptions());
  const reviews = publishedReviews(records.data ?? [], community.data ?? []);
  const empties = reviews.filter(r => r.kind === 'empty');
  const loved = lovedBrands(state.savedProducts, state.likedPosts);
  const suggested = suggestFor(browseProfile, loved);
  const home = !canvasOnly && !category && !results && !q.trim() && !reviewsView;
  const isResults = canvasOnly || results || !!q.trim();
  const menu = category ? (group ? productTypes(category, group, PRODUCTS) : categoryGroups(category)) : [];
  const list = PRODUCTS.filter(p => (!canvasOnly || matchesCanvasProduct(p, browseProfile)) && matchesCategory(p, category, group, type) && matchesStore(p, store) && matchesPrice(p, price) && (!q.trim() || `${p.brand} ${p.name} ${p.category} ${p.sub ?? ''} ${p.claims.join(' ')}`.toLowerCase().includes(q.trim().toLowerCase())) && (filter !== 'Your Matches' || matchesCanvasProduct(p, browseProfile)) && (filter !== 'New' || p.launchpad) && (filter !== 'Top Rated' || !!ratingSummary(reviews.filter(r => r.productId === p.id))));
  if (filter === 'Top Rated') list.sort((a, b) => (ratingSummary(reviews.filter(r => r.productId === b.id))?.average ?? 0) - (ratingSummary(reviews.filter(r => r.productId === a.id))?.average ?? 0));
  const reset = () => { setCategory(null); setGroup(null); setType(null); setResults(false); setQ(''); setFilter('All'); };
  const back = () => { if (isResults) { setResults(false); setType(null); setQ(''); } else if (group) setGroup(null); else reset(); };
  return <div className="discover-surface"><DiscoverHeader title="Discover"/><Page className="mt-4 space-y-6">
    <div className="no-scrollbar flex gap-2 overflow-x-auto" aria-label="Discovery type">{(['products', 'services', 'atlas'] as const).map(m => <Button key={m} variant={mode === m ? 'default' : 'outline'} aria-pressed={mode === m} className="h-10 shrink-0 rounded-full px-3 text-xs sm:px-4 sm:text-sm" onClick={() => { setMode(m); setQ(''); }}>{m === 'products' ? 'Products' : m === 'services' ? 'Studios & Specialists' : 'Global Atlas'}</Button>)}</div>
    {mode !== 'atlas' && <label className="flex h-12 items-center gap-2 rounded-full border border-border bg-card px-4"><Search className="h-4 w-4 shrink-0 text-muted-foreground"/><input aria-label={mode === 'products' ? 'Search products' : 'Search specialists'} value={q} onChange={e => setQ(e.target.value)} placeholder={mode === 'products' ? 'Search products, brands, or services…' : 'Search services, specialists, or a city…'} className="min-w-0 flex-1 bg-transparent text-sm outline-none"/>{mode === 'products' && <Button variant="ghost" size="icon" aria-label="Product filters" aria-expanded={filters} className="h-8 w-8" onClick={() => setFilters(v => !v)}><SlidersHorizontal className="h-4 w-4"/></Button>}</label>}
    {mode !== 'atlas' && <div className="flex items-center gap-3"><Switch id="canvas-match" checked={canvasOnly} onCheckedChange={setCanvasOnly}/><label htmlFor="canvas-match" className="text-sm font-medium">Match My Canvas</label></div>}
    {canvasOnly && mode !== 'atlas' && <p className="text-xs text-muted-foreground">Recorded sample relevance only · not verified compatibility.</p>}
    {mode === 'atlas' ? <><div className="flex flex-wrap gap-2">{(['products', 'services'] as const).map(path => <Button key={path} variant={atlasPath === path ? 'default' : 'outline'} className="rounded-full" onClick={() => setAtlasPath(path)}>{path === 'products' ? 'Products around the world' : 'Services around the world'}</Button>)}</div>{atlasPath === 'products' ? <div className="-mx-4 bg-cocoa px-4 py-4 text-oat md:mx-0 md:rounded-lg"><AtlasHub/></div> : <><label className="flex h-12 items-center gap-2 rounded-full border border-border px-4"><Search className="h-4 w-4"/><input aria-label="Search global services" value={q} onChange={e => setQ(e.target.value)} placeholder="Search a city, studio, or service…" className="min-w-0 flex-1 bg-transparent text-sm outline-none"/></label><p className="text-xs text-muted-foreground">Current sample directory: United States. Other countries have no published listings yet.</p><ServiceDiscovery query={q}/></>}</> : mode === 'services' ? <ServiceDiscovery query={q} canvasOnly={canvasOnly}/> : <>
      <div className="flex items-center justify-between gap-3"><div className="flex gap-1" aria-label="Product browsing views">{['Browse', 'Reviews'].map(v => <Button key={v} variant={reviewsView === (v === 'Reviews') ? 'secondary' : 'ghost'} aria-pressed={reviewsView === (v === 'Reviews')} onClick={() => setReviewsView(v === 'Reviews')} className="rounded-full">{v}</Button>)}</div><DiscoveryCanvas/></div>
      {filters && <div className="grid grid-cols-2 gap-3 border-y border-border py-4"><label className="text-xs">Where to shop<select aria-label="Store type" className="bare-input" value={store} onChange={e => { setStore(e.target.value as StoreType); setResults(true); }}>{STORE_TYPES.map(t => <option key={t}>{t}</option>)}</select></label><label className="text-xs">Price<select aria-label="Price range" className="bare-input" value={price} onChange={e => { setPrice(e.target.value); setResults(true); }}>{['All prices', 'Under $15', '$15–$35', '$35–$70', 'Luxury ($70+)'].map(t => <option key={t}>{t}</option>)}</select></label></div>}
      <p className="text-[11px] text-muted-foreground">Illustrative catalog, photography and prices · not confirmed live inventory.</p>
      {reviewsView ? <ReviewSection title="Worth the Empty?" reviews={empties.filter(r => { const p = PRODUCTS.find(p => p.id === r.productId); return p && (!q.trim() || `${p.brand} ${p.name} ${r.text}`.toLowerCase().includes(q.toLowerCase())); })} horizontal loading={community.isPending} error={!!community.error} onRetry={() => community.refetch()}/> : <>
      {home ? <>
        <section className="space-y-3"><div className="flex items-center justify-between gap-2"><h2 className="flex items-center gap-2 font-display text-2xl">Suggested for your canvas<Sparkles className="h-4 w-4 text-primary"/></h2><Button variant="link" className="shrink-0 px-0 text-xs" onClick={() => { reset(); setResults(true); }}>Explore all<ChevronRight className="h-3 w-3"/></Button></div><div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">{suggested.slice(0, 6).map(p => <div className="w-40 shrink-0 sm:w-48" key={p.id}><DiscoverProductCard product={p}/></div>)}</div></section>
        <section className="space-y-3"><h2 className="font-display text-2xl">Explore by category</h2><div className="grid grid-cols-3 gap-3 sm:grid-cols-4">{DISCOVER_CATEGORIES.map(c => <Button key={c} variant="ghost" className="h-auto flex-col gap-2 whitespace-normal p-0 pb-2 text-xs" onClick={() => { setCategory(c); setGroup(null); setType(null); setResults(false); }}><img src={PRODUCTS.find(p => p.category === c)?.image ?? PRODUCTS[0]?.image} alt="" className="aspect-square w-full rounded-lg object-cover"/>{categoryLabel(c)}</Button>)}</div></section>
        <ReviewSection title="Worth the Empty?" reviews={empties} horizontal loading={community.isPending} error={!!community.error} onRetry={() => community.refetch()}/>
        <section className="space-y-3"><h2 className="font-display text-2xl">Discover something new</h2><div className="no-scrollbar flex gap-3 overflow-x-auto">{PRODUCTS.filter(p => p.launchpad).slice(0, 4).map(p => <div key={p.id} className="w-40 shrink-0 sm:w-48"><DiscoverProductCard product={p}/></div>)}</div></section>
      </> : <>
        <div className="flex items-center gap-3"><Button variant="ghost" size="icon" aria-label="Back in product categories" onClick={back}><ArrowLeft/></Button><h2 className="font-display text-2xl">{type ?? group ?? (category ? categoryLabel(category) : 'All products')}</h2></div>
        {category && !isResults ? <><Button variant="link" onClick={() => setResults(true)}>Explore all {group ?? categoryLabel(category)}<ChevronRight/></Button><div className="divide-y divide-border">{menu.map(item => <Button key={item} variant="ghost" className="h-20 w-full justify-between rounded-none text-base" onClick={() => { if (!group) { setGroup(item); if (category !== 'Makeup' || productTypes(category, item, PRODUCTS).length <= 1) setResults(true); } else { setType(item); setResults(true); } }}>{item}<ChevronRight className="h-4 w-4"/></Button>)}</div></> : <><div className="no-scrollbar flex gap-2 overflow-x-auto">{['All', 'Your Matches', 'New', 'Top Rated'].map(f => <Button key={f} variant={filter === f ? 'default' : 'outline'} className="shrink-0 rounded-full text-xs" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</Button>)}</div><p className="text-xs text-muted-foreground">{list.length} products</p>{list.length ? <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">{list.map(p => <DiscoverProductCard key={p.id} product={p}/>)}</div> : <div className="border-y border-border py-12 text-center"><h3 className="font-display text-xl">{filter === 'Top Rated' ? 'No published star ratings yet' : 'No products match yet'}</h3><Button variant="link" onClick={() => { reset(); setCanvasOnly(false); setResults(true); setStore('All stores'); setPrice('All prices'); }}>Explore all products</Button></div>}</>}
      </>}
      </>}
    </>}
  </Page></div>;
}
