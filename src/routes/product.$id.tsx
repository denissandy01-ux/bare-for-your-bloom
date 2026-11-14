import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import { Heart, Layers, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Page } from '@/components/bare/kit';
import { DiscoverHeader } from '@/components/bare/discover-chrome';
import { WhereToBuySheet, SwatchSheet } from '@/components/bare/sheets';
import { FormulaSection } from '@/components/bare/formula';
import { ReviewSection } from '@/components/bare/discovery-reviews';
import { FEED, ROUTINES, money, productById, whereSold, UNDERTONE_SWATCH } from '@/lib/data';
import { shadeRangeFor } from '@/lib/shades';
import { brandForProduct } from '@/lib/atlas';
import { ratingSummary } from '@/lib/discover-reviews';
import { emptyInsights, publishedReviews } from '@/lib/beauty-reviews';
import { beautyReviewsOptions } from '@/lib/beauty-reviews-query';
import { communityOptions } from '@/lib/community-query';
import { useBare } from '@/lib/store';
import { cn } from '@/lib/utils';
export const Route = createFileRoute('/product/$id')({
  loader: ({ params }) => { if (!productById(params.id)) throw notFound(); return { id: params.id }; },
  head: ({ loaderData }) => { const p = loaderData ? productById(loaderData.id) : undefined; const title = p ? `${p.brand} ${p.name} · Becoming Bare` : 'Product · Becoming Bare'; const desc = p ? `Explore ${p.name}, formula information, shopping options and published community reviews.` : 'Beauty products and published reviews.'; return { meta: [{ title }, { name: 'description', content: desc }, { property: 'og:title', content: title }, { property: 'og:description', content: desc }, { property: 'og:type', content: 'product' }, { name: 'twitter:card', content: 'summary_large_image' }] }; },
  component: ProductPage,
});
function ProductPage() {
  const { id } = Route.useLoaderData();
  const product = productById(id);
  const { state, toggleProduct, toggleOwned } = useBare();
  const [buy, setBuy] = useState(false);
  const [swatches, setSwatches] = useState(false);
  const [tab, setTab] = useState('Details');
  const community = useQuery(communityOptions);
  const records = useQuery(beautyReviewsOptions());
  if (!product) throw notFound();
  const brand = brandForProduct(id), shops = whereSold(product), range = shadeRangeFor(id);
  const saved = state.savedProducts.includes(id), owned = state.ownedProducts.includes(id);
  const reviews = publishedReviews(records.data ?? [], community.data ?? []).filter(r => r.productId === id);
  const insights = emptyInsights(reviews);
  const summary = ratingSummary(reviews);
  return <div className="discover-surface"><DiscoverHeader/><Page className="space-y-5"><Link to="/discover" className="inline-flex h-11 items-center gap-2 text-sm"><ArrowLeft className="h-4 w-4"/>Discover</Link>
    <div className="grid gap-5 md:grid-cols-2"><img src={product.image} alt={product.name} className="aspect-[4/3] w-full rounded-lg object-cover md:aspect-square"/><div className="space-y-4"><p className="text-sm font-semibold text-muted-foreground">{brand ? <Link to="/brand/$id" params={{ id: brand.id }}>{product.brand}</Link> : product.brand}</p><h1 className="font-display text-[28px] leading-tight">{product.name}</h1><p className="font-semibold">{Number.isFinite(shops.from) ? `From ${money(shops.from)}` : 'Price unavailable'}</p>{summary && <p className="text-sm">★ {summary.average.toFixed(1)} ({summary.count} rated reviews)</p>}<p className="text-xs text-muted-foreground">Sample product imagery and prices. Shopping links are retailer searches, not verified stock.</p>
    {range && <div className="space-y-2"><div className="flex items-center justify-between"><p className="text-xs">Illustrative shade range</p><Button variant="link" className="h-8 text-xs" onClick={() => setSwatches(true)}>All shades</Button></div><div className="flex flex-wrap gap-2">{range.shades.filter(s => s.undertone === 'Neutral').map(s => <Button key={s.code} variant="ghost" size="icon" aria-label={`View sample ${s.depth} shade ${s.code}`} className="h-8 w-8 rounded-full border border-border" style={{ background: UNDERTONE_SWATCH[s.depth][s.undertone] }} onClick={() => setSwatches(true)}/>)}</div></div>}
    <div className="grid grid-cols-3 gap-2"><Button variant="outline" aria-pressed={saved} onClick={() => toggleProduct(id)} className="h-20 flex-col gap-1 rounded-lg px-1 text-xs"><Heart className={cn('h-5 w-5', saved && 'fill-primary text-primary')}/>{saved ? 'Saved' : 'Save'}</Button><Button variant="outline" aria-pressed={owned} onClick={() => toggleOwned(id)} className="h-20 flex-col gap-1 whitespace-normal rounded-lg px-1 text-xs"><Layers className="h-5 w-5"/>{owned ? 'In collection' : 'Add to collection'}</Button><Button onClick={() => setBuy(true)} className="h-20 flex-col gap-1 rounded-lg px-1 text-xs"><ShoppingBag className="h-5 w-5"/>Shop</Button></div>
    {brand && <Button asChild variant="link" className="px-0"><Link to="/brand/$id" params={{ id: brand.id }}>Founder story & brand</Link></Button>}
    </div></div>
    <div className="no-scrollbar flex gap-1 overflow-x-auto border-y border-border py-3" aria-label="Product detail sections">{['Details', 'Formula', 'Reviews'].map(t => <Button key={t} variant={tab === t ? 'default' : 'ghost'} aria-pressed={tab === t} onClick={() => setTab(t)} className="shrink-0 rounded-full px-3 text-xs sm:text-sm">{t}</Button>)}</div>
    {tab === 'Details' && <div className="space-y-6"><section><h2 className="font-display text-2xl">Product details</h2><div className="mt-3 flex flex-wrap gap-2">{product.claims.map(c => <span key={c} className="rounded-full bg-secondary px-3 py-2 text-xs">{c}</span>)}</div><p className="mt-3 text-xs text-muted-foreground">Illustrative product attributes, not verified manufacturer claims.</p></section>{FEED.some(f => f.productId === id) && <section><h2 className="mb-3 font-display text-xl">Sample wear tests</h2><div className="grid grid-cols-2 gap-3">{FEED.filter(f => f.productId === id).map(f => <figure key={f.id}><img src={f.media} alt="Illustrative wear test" className="aspect-[3/4] w-full rounded-lg object-cover"/><figcaption className="mt-2 text-xs">{f.creator.handle} · {f.wearTest}</figcaption></figure>)}</div></section>}{ROUTINES.filter(r => r.steps.some(s => s.productId === id)).map(r => <Link key={r.id} to="/routine/$id" params={{ id: r.id }} className="block border-y border-border py-4 font-display">{r.title}</Link>)}</div>}
    {tab === 'Formula' && <div className="-mx-4 bg-cocoa px-4 py-5 text-oat md:mx-0 md:rounded-lg"><FormulaSection product={product}/></div>}
    {tab === 'Reviews' && <div className="space-y-6"><section className="border-y border-border py-5"><h2 className="font-display text-2xl">Worth the Empty?</h2><p className="mt-1 text-sm text-muted-foreground">Beyond the hype. See what people actually finish.</p>{insights.count ? <div className="mt-4 grid grid-cols-2 gap-5"><div><p className="font-display text-3xl">{insights.count}</p><p className="text-xs text-muted-foreground">Finished Reviews</p></div><div><p className="font-display text-3xl">{insights.repurchase === null ? '—' : `${insights.repurchase}%`}</p><p className="text-xs text-muted-foreground">Would Repurchase</p>{insights.repurchase !== null ? <progress className="review-progress mt-2 h-2 w-full" aria-label="Would repurchase" value={insights.repurchase} max={100}/> : <p className="mt-2 text-xs text-muted-foreground">No Yes or No answers yet.</p>}</div></div> : <p className="mt-4 text-sm text-muted-foreground">No published finished-product reviews yet.</p>}</section><ReviewSection title="Product Reviews" reviews={reviews} loading={community.isPending||records.isPending} error={!!community.error||!!records.error} onRetry={()=>{void community.refetch();void records.refetch();}}/></div>}
  </Page><WhereToBuySheet product={product} open={buy} onOpenChange={setBuy}/><SwatchSheet product={product} count={0} open={swatches} onOpenChange={setSwatches}/></div>;
}
