import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import { ArrowLeft, ExternalLink, MapPin, Clock, Shield, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BareHeader, Page, SectionTitle, ListRow } from '@/components/bare/kit';
import { handleFor, specialistById } from '@/lib/specialists';
import { ROUTINES, money, productById, proById } from '@/lib/data';
import { useBare } from '@/lib/store';

export const Route = createFileRoute('/specialist/$id')({
  loader: ({ params }) => { if (!specialistById(params.id)) throw notFound(); return { id: params.id }; },
  head: ({ loaderData }) => {
    const s = loaderData ? specialistById(loaderData.id) : undefined;
    const title = s ? `${s.name} · ${s.studio} · Becoming Bare` : 'Specialist unavailable · Becoming Bare';
    const description = s ? `${s.discipline} in ${s.city}. Explore ${s.specialties.join(', ')}, services, portfolio and studio products. Illustrative listing.` : 'Explore beauty and grooming specialists.';
    return { meta: [{ title }, { name: 'description', content: description }, { property: 'og:title', content: title }, { property: 'og:description', content: description }, { property: 'og:type', content: 'profile' }, { name: 'twitter:card', content: 'summary_large_image' }] };
  },
  component: SpecialistPage,
});

function SpecialistPage() {
  const { id } = Route.useLoaderData();
  const s = specialistById(id);
  const { state, applyCode, toggleCreator } = useBare();
  const [view, setView] = useState<'services' | 'portfolio' | 'shelf'>('services');
  if (!s) return null;
  const routines = ROUTINES.filter(r => r.proId === s.id);
  const pro = proById(s.id);
  const applied = pro ? state.appliedCodes.includes(pro.code) : false;
  const following = state.followedCreators.includes(handleFor(s));
  return <><BareHeader title="Specialist & studio" /><Page className="mt-5 space-y-6">
    <Link to="/discover" className="inline-flex min-h-11 items-center gap-2 text-[13px] text-sand"><ArrowLeft className="h-4 w-4" />Back to Discover</Link>
    <div className="grid items-center gap-6 lg:grid-cols-2">
      <img src={s.image} alt={`${s.studio} illustrative portfolio`} width={1024} height={768} className="aspect-[4/3] w-full rounded-[28px] object-cover" />
      <div className="min-w-0 space-y-3"><p className="text-[12px] text-peach">{s.discipline} · {s.tier}</p><h1 className="font-display text-[34px] leading-tight">{s.name}</h1><p className="font-display text-[21px] italic text-sand">{s.studio}</p><p className="flex items-start gap-2 text-[13px] text-sand"><MapPin className="h-4 w-4 shrink-0" />{s.neighborhood} · {s.city}</p><div className="flex flex-wrap gap-2">{s.specialties.map(x => <span key={x} className="rounded-full border border-sand/30 px-3 py-1.5 text-[12px] text-sand">{x}</span>)}</div><p className="text-[13px] leading-relaxed text-sand/80">Sample studio and prices. Booking is not connected.</p><div className="flex flex-wrap gap-2"><Button variant={following?"secondary":"default"} aria-pressed={following} onClick={()=>toggleCreator(handleFor(s))} className="h-12 rounded-full px-5">{following?"Following":"+ Follow"}</Button><Button disabled className="h-12 rounded-full px-5"><Clock />Booking not yet available</Button></div></div>
    </div>
    <section className="space-y-3 border-y border-oat/15 py-5"><SectionTitle meta="Their approach">Care with a point of view</SectionTitle><p className="text-[15px] leading-relaxed text-sand">{s.story}</p><p className="font-display text-[19px] italic text-peach">{s.philosophy}</p><p className="flex items-center gap-2 text-[12px] text-sand/80"><Shield className="h-4 w-4 shrink-0" />{s.credential} · Credentials not verified</p><p className="text-[13px] text-sand">Skin tones: {s.depths.join(' · ')}</p>{s.hair.length > 0 && <p className="text-[13px] text-sand">Textures: {s.hair.join(' · ')}</p>}<Button asChild variant="ghost" className="h-auto justify-start whitespace-normal px-0 text-peach"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.neighborhood + ', ' + s.city)}`} target="_blank" rel="noopener noreferrer"><MapPin />Explore neighborhood on Maps<ExternalLink /></a></Button></section>
    <div className="no-scrollbar flex gap-2 overflow-x-auto" aria-label="Specialist profile sections">{(['services', 'portfolio', 'shelf'] as const).map(v => <Button key={v} variant={view === v ? 'secondary' : 'ghost'} aria-pressed={view === v} onClick={() => setView(v)} className="h-11 shrink-0 rounded-full px-4">{v === 'shelf' ? 'Studio shelf' : v === 'portfolio' ? 'Portfolio & routines' : 'Services'}</Button>)}</div>
    {view === 'services' && <section className="space-y-3"><SectionTitle meta="Service menu">Time for your canvas</SectionTitle><ul className="divide-y divide-oat/15">{s.services.map(service => <li key={service.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-4"><div className="min-w-0"><h3 className="font-display text-[20px]">{service.name}</h3><p className="mt-1 flex items-center gap-1.5 text-[12px] text-sand"><Clock className="h-3.5 w-3.5" />{service.minutes} min · Sample starting rate</p></div><span className="text-[16px] font-semibold text-peach">{money(service.price)}</span></li>)}</ul></section>}
    {view === 'portfolio' && <section className="space-y-4"><SectionTitle meta="Portfolio & education">Behind the finish</SectionTitle><figure><img src={s.image} alt={`${s.discipline} sample work`} loading="lazy" className="aspect-[16/9] w-full rounded-[28px] object-cover" /><figcaption className="mt-2 text-[12px] text-sand/80">Illustrative portfolio image</figcaption></figure>{routines.map(r => <ListRow key={r.id} to="/routine/$id" params={{ id: r.id }} image={r.media} title={r.title} meta={`${r.steps.length} steps · ${r.duration}`} />)}</section>}
    {view === 'shelf' && <section className="space-y-4"><SectionTitle meta="Used & recommended">The studio shelf</SectionTitle><div className="grid gap-3 sm:grid-cols-2">{s.shelf.map(item => { const p = productById(item.productId); return p ? <ListRow key={p.id} to="/product/$id" params={{ id: p.id }} image={p.image} title={p.name} meta={`${p.brand} · ${item.role}`} /> : null; })}</div>{pro && <div className="flex flex-wrap items-center gap-3 border-t border-oat/15 pt-4"><p className="min-w-0 flex-1 text-[13px] text-sand">Sample client code {pro.code} · {Math.round(pro.discount * 100)}% off</p><Button onClick={() => applyCode(pro.code)} className="h-11 shrink-0 rounded-full">{applied && <Check />}{applied ? 'Code applied' : `Apply ${pro.code}`}</Button></div>}</section>}
  </Page></>;
}