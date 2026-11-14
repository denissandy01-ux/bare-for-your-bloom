import { useQuery } from '@tanstack/react-query';
import { beautyReviewsOptions } from '@/lib/beauty-reviews-query';
import { publishedReviews } from '@/lib/beauty-reviews';
import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import { ArrowLeft, Heart, MapPin, Clock, Navigation } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Page } from '@/components/bare/kit';
import { DiscoverHeader } from '@/components/bare/discover-chrome';
import { ReviewSection } from '@/components/bare/discovery-reviews';
import { DiscoverProductCard } from '@/components/bare/discover-product-card';
import { handleFor, specialistById, studioTeam } from '@/lib/specialists';
import { money, productById } from '@/lib/data';
import { serviceReviews } from '@/lib/discover-reviews';
import { useBare } from '@/lib/store';
import { cn } from '@/lib/utils';
export const Route = createFileRoute('/specialist/$id')({
  loader: ({ params }) => { if (!specialistById(params.id)) throw notFound(); return { id: params.id }; },
  head: ({ loaderData }) => { const s = loaderData ? specialistById(loaderData.id) : undefined; const title = s ? `${s.name} · ${s.studio} · Becoming Bare` : 'Specialist unavailable · Becoming Bare'; const description = s ? `${s.discipline} in ${s.city}. Explore services, sample portfolios and published reviews.` : 'Explore beauty specialists.'; return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'profile' }, { name: 'twitter:card', content: 'summary_large_image' }] }; },
  component: SpecialistPage,
});
function SpecialistPage() {
  const { id } = Route.useLoaderData(); const s = specialistById(id);
  const { state, toggleSpecialist, toggleCreator } = useBare();
  const records = useQuery(beautyReviewsOptions());
  const reviews = publishedReviews(records.data ?? []);
  const [tab, setTab] = useState('About');
  if (!s) return null;
  const saved = state.savedSpecialists.includes(id), following = state.followedCreators.includes(handleFor(s));
  return <div className="discover-surface"><DiscoverHeader/><Page className="space-y-5"><Link to="/discover" className="inline-flex h-11 items-center gap-2 text-sm"><ArrowLeft className="h-4 w-4"/>Discover</Link><div className="grid gap-5 md:grid-cols-2"><img src={s.image} alt={`${s.studio} illustrative portfolio`} className="aspect-[4/3] w-full rounded-lg object-cover"/><div className="space-y-3"><h1 className="font-display text-[30px] leading-tight">{s.studio}</h1><p className="text-sm">{s.name} · {s.discipline}</p><p className="text-sm text-muted-foreground">{s.specialties.join(' · ')}</p><p className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4"/>{s.neighborhood} · {s.city}</p><p className="text-xs text-muted-foreground">Illustrative listing and prices. Credentials are not verified; booking is not connected.</p><div className="grid grid-cols-3 gap-2"><Button variant="outline" aria-pressed={saved} onClick={() => toggleSpecialist(id)} className="h-20 flex-col rounded-lg px-1 text-xs"><Heart className={cn('h-5 w-5', saved && 'fill-primary text-primary')}/>{saved ? 'Saved' : 'Save'}</Button><Button variant="outline" disabled className="h-20 flex-col whitespace-normal rounded-lg px-1 text-xs"><Clock className="h-5 w-5"/>Booking unavailable</Button><Button asChild className="h-20 flex-col rounded-lg px-1 text-xs"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.neighborhood + ', ' + s.city)}`} target="_blank" rel="noopener noreferrer"><Navigation className="h-5 w-5"/>Neighborhood</a></Button></div><Button variant="outline" aria-pressed={following} className="rounded-full" onClick={() => toggleCreator(handleFor(s))}>{following ? 'Following' : '+ Follow'} {handleFor(s)}</Button></div></div><div className="flex gap-2 border-y border-border py-3" aria-label="Specialist profile sections">{['About', 'Services', 'Reviews'].map(t => <Button key={t} variant={tab === t ? 'default' : 'ghost'} aria-pressed={tab === t} className="flex-1 rounded-full" onClick={() => setTab(t)}>{t}</Button>)}</div>
  {tab === 'About' && <div className="space-y-5"><section><h2 className="font-display text-2xl">Their approach</h2><p className="mt-3 text-sm leading-relaxed">{s.story}</p><p className="mt-3 font-display italic text-primary">{s.philosophy}</p><p className="mt-3 text-xs text-muted-foreground">{s.credential} · sample credentials</p></section><section><h2 className="font-display text-xl">The team</h2>{studioTeam(s).map(person => <Link key={person.id} to="/specialist/$id" params={{ id: person.id }} className="flex items-center gap-3 border-b border-border py-3"><img src={person.image} alt="" className="h-12 w-12 rounded-full object-cover"/><span><span className="block text-sm">{person.name}</span><span className="text-xs text-muted-foreground">{person.specialties.join(' · ')}</span></span></Link>)}</section><p className="text-sm">Skin tones: {s.depths.join(' · ')}{s.hair.length > 0 && <span className="mt-2 block">Textures: {s.hair.join(' · ')}</span>}</p></div>}
  {tab === 'Services' && <div className="space-y-6"><section><h2 className="font-display text-2xl">Services & sample pricing</h2>{s.services.map(service => <div key={service.name} className="flex items-center justify-between gap-3 border-b border-border py-4"><div><h3 className="text-sm font-medium">{service.name}</h3><p className="mt-1 text-xs text-muted-foreground">{service.minutes} minutes</p></div><span className="text-sm font-semibold">{money(service.price)}</span></div>)}</section><section><h2 className="mb-3 font-display text-xl">Studio shelf</h2><div className="grid grid-cols-2 gap-3">{s.shelf.map(item => { const p = productById(item.productId); return p ? <DiscoverProductCard key={p.id} product={p}/> : null; })}</div></section></div>}
  {tab === 'Reviews' && <ReviewSection title="Service Reviews" loading={records.isPending} error={!!records.error} onRetry={()=>records.refetch()} reviews={serviceReviews(reviews, [id])}/>}
  </Page></div>;
}
