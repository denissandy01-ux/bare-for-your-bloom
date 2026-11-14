import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronRight, MessageCircle, Recycle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { productById } from '@/lib/data';
import { specialistById } from '@/lib/specialists';
import { ratingSummary, type DiscoveryReview } from '@/lib/discover-reviews';

export function ReviewSection({ reviews, title, horizontal = false, loading = false, error = false, onRetry }: {
  reviews: DiscoveryReview[]; title: string; horizontal?: boolean; loading?: boolean; error?: boolean; onRetry?: () => void;
}) {
  const [selected, setSelected] = useState<DiscoveryReview | null>(null);
  const [all, setAll] = useState(false);
  const summary = ratingSummary(reviews);
  const empty = title.includes('Empty');
  return <section className="space-y-4">
    <div className="flex items-center gap-2">{empty ? <Recycle className="h-6 w-6 text-primary"/> : <MessageCircle className="h-6 w-6 text-primary"/>}<h2 className="font-display text-2xl">{title}</h2></div>
    {empty && <p className="text-sm text-muted-foreground">Beyond the hype. See what people actually finish.</p>}
    {loading ? <p role="status" className="py-8 text-center text-sm text-muted-foreground">Loading published reviews…</p> : error ? <div role="alert" className="py-6 text-center"><p>Reviews could not be loaded.</p><Button variant="link" onClick={onRetry}>Try again</Button></div> : !reviews.length ? <div className="border-y border-border py-9 text-center"><p className="font-display text-xl">No published reviews yet</p><p className="mt-2 text-sm text-muted-foreground">{empty ? 'Finished-product experiences will appear here when shared.' : 'Community experiences will appear here when published.'}</p></div> : <>
    {summary && <div className="flex flex-wrap gap-6 border-y border-border py-4"><div><p className="flex items-center gap-2 font-display text-3xl">{summary.average.toFixed(1)} <Star className="h-5 w-5 fill-primary text-primary"/></p><p className="text-xs text-muted-foreground">{summary.count} rated reviews</p></div><div className="min-w-32 flex-1 space-y-1">{summary.distribution.map(d => <div key={d.stars} className="flex items-center gap-2 text-xs"><span>{d.stars} ★</span><progress aria-label={`${d.stars} star reviews`} className="review-progress h-2 flex-1" value={d.count} max={summary.count}/><span>{d.count}</span></div>)}</div></div>}
    <div className={horizontal ? 'no-scrollbar flex gap-3 overflow-x-auto pb-2' : 'space-y-3'}>{(all ? reviews : reviews.slice(0, horizontal ? 8 : 3)).map(review => {
      const product = review.productId ? productById(review.productId) : undefined;
      const specialist = review.specialistId ? specialistById(review.specialistId) : undefined;
      return <article key={review.id} className={horizontal ? 'w-64 shrink-0 overflow-hidden rounded-lg border border-border bg-card' : 'rounded-lg border border-border bg-card p-3'}>
        {horizontal && product && <Link to="/product/$id" params={{ id: product.id }}><img src={product.image} alt={product.name} className="aspect-[4/3] w-full object-cover"/></Link>}
        <Button variant="ghost" onClick={() => setSelected(review)} aria-label={`Read review by ${review.author}`} className="h-auto w-full justify-start whitespace-normal rounded-none p-3 text-left">
          {!horizontal && review.url && (review.mediaType === 'video' ? <video src={review.url} preload="metadata" className="h-20 w-16 shrink-0 rounded-md object-cover"/> : <img src={review.url} alt="Review attachment" className="h-20 w-16 shrink-0 rounded-md object-cover"/>)}
          <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{review.author}</p>{product && <p className="mt-1 text-xs text-muted-foreground">{product.brand} · {product.name}</p>}{specialist && <p className="text-xs text-muted-foreground">{specialist.studio}</p>}
          <ReviewFacts review={review}/><p className="mt-2 line-clamp-3 text-sm font-normal">{review.text}</p></div><ChevronRight className="h-4 w-4 shrink-0"/>
        </Button>
      </article>;
    })}</div>
    {!horizontal && !all && reviews.length > 3 && <Button variant="outline" className="w-full rounded-full bg-transparent" onClick={() => setAll(true)}>See all reviews ({reviews.length})</Button>}
    </>}
    <Dialog open={!!selected} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent className="max-h-[85dvh] overflow-y-auto"><DialogHeader><DialogTitle>{selected?.author}'s review</DialogTitle></DialogHeader>{selected && <><ReviewFacts review={selected}/>{selected.url && (selected.mediaType === 'video' ? <video src={selected.url} controls playsInline className="max-h-96 w-full rounded-lg"/> : <img src={selected.url} alt="Full review attachment" className="max-h-96 w-full rounded-lg object-contain"/>)}<p className="whitespace-pre-wrap text-sm leading-relaxed">{selected.text}</p>{selected.productId && <Button asChild variant="outline"><Link to="/product/$id" params={{ id: selected.productId }}>View product<ChevronRight/></Link></Button>}{selected.specialistId && <Button asChild variant="outline"><Link to="/specialist/$id" params={{ id: selected.specialistId }}>View specialist<ChevronRight/></Link></Button>}</>}</DialogContent></Dialog>
  </section>;
}
function ReviewFacts({ review }: { review: DiscoveryReview }) { return <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-primary">{review.rating !== undefined && <span>{review.rating} ★</span>}{review.kind === 'empty' && <span>Finished{review.weeks ? ` · ${review.weeks} weeks` : ''}</span>}{review.repurchase !== undefined && <span>{review.repurchase ? 'Would repurchase' : 'Would not repurchase'}</span>}{review.service && <span>{review.service}</span>}{review.bookAgain && <span>Book again: {review.bookAgain}</span>}</div>; }