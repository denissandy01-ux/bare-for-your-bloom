import { useQuery } from '@tanstack/react-query';
import { beautyReviewsOptions } from '@/lib/beauty-reviews-query';
import { publishedReviews } from '@/lib/beauty-reviews';
import { useState } from 'react';
import { ArrowLeft, LocateFixed, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CITIES, DISCIPLINES, SPECIALISTS, canvasCoverage, disciplineFilters, findSpecialists, type Discipline, type Point } from '@/lib/specialists';
import { DEPTHS, HAIR_TYPES, type Depth } from '@/lib/data';
import { useBare } from '@/lib/store';
import { matchesCanvasSpecialist } from '@/lib/canvas-discovery';
import { EmptyGallery } from './empty-gallery';
import { cn } from '@/lib/utils';
import { serviceReviews } from '@/lib/discover-reviews';
import { ReviewSection } from './discovery-reviews';
import { SpecialistCard } from './specialist-card';
export function ServiceDiscovery({ query, canvasOnly = false }: { query: string; canvasOnly?: boolean }) {
  const { browseProfile } = useBare();
  const records = useQuery(beautyReviewsOptions());
  const reviews = publishedReviews(records.data ?? []);
  const [discipline, setDiscipline] = useState<Discipline>('All');
  const [location, setLocation] = useState('Anywhere');
  const [gps, setGps] = useState<Point>();
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [radius, setRadius] = useState(50);
  const [depth, setDepth] = useState<Depth>();
  const [hair, setHair] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const [reviewsView, setReviewsView] = useState(false);
  const origin = location === 'Current location' ? gps : CITIES.find(c => c.name === location);
  const relevant = disciplineFilters(discipline);
  const list = findSpecialists({ query, discipline, origin, radius, depth, hair, specialties: picked }).filter(r => !canvasOnly || matchesCanvasSpecialist(r.specialist, browseProfile));
  const specialties = [...new Set(SPECIALISTS.filter(s => discipline === 'All' || s.discipline === discipline).flatMap(s => s.specialties))].sort();
  const home = !canvasOnly && discipline === 'All' && !query && !picked.length && location === 'Anywhere' && !reviewsView;
  const choose = (d: Discipline, tags: string[] = []) => { setDiscipline(d); setPicked(tags); setDepth(undefined); setHair(''); };
  const locate = () => { if (!navigator.geolocation) { setError('Choose a city instead; location is unavailable.'); return; } setLocating(true); setError(''); navigator.geolocation.getCurrentPosition(p => { setGps({ lat: p.coords.latitude, lng: p.coords.longitude }); setLocation('Current location'); setLocating(false); }, () => { setError('Your location could not be accessed. Choose a city instead.'); setLocating(false); }, { timeout: 10000, maximumAge: 300000 }); };
  return <div className="space-y-5">
    <div className="flex gap-2" aria-label="Service browsing views">{['Browse', 'Reviews'].map(v => <Button key={v} variant={reviewsView === (v === 'Reviews') ? 'secondary' : 'ghost'} aria-pressed={reviewsView === (v === 'Reviews')} className="rounded-full" onClick={() => setReviewsView(v === 'Reviews')}>{v}</Button>)}</div>
    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-primary"/><select aria-label="Location" value={location} onChange={e => { setLocation(e.target.value); setError(''); }} className="h-11 min-w-0 flex-1 rounded-full border border-border bg-card px-3 text-sm"><option>Anywhere</option>{CITIES.map(c => <option key={c.name}>{c.name}</option>)}{gps && <option>Current location</option>}</select><Button variant="outline" size="icon" aria-label="Use current location" title="Near me" className="rounded-full" disabled={locating} onClick={locate}><LocateFixed/></Button></div>
    {error && <p role="alert" className="text-sm text-primary">{error}</p>}
    <p className="text-xs text-muted-foreground">Sample specialists, portfolios and rates. Credentials and booking links are not verified.</p>
    {home ? <><section className="space-y-3"><h2 className="font-display text-2xl">Find a beauty specialist</h2><div className="grid grid-cols-3 gap-3">{DISCIPLINES.filter(d => d !== 'All').map(d => <Button key={d} variant="ghost" className="h-auto flex-col gap-2 p-0 text-xs" onClick={() => choose(d)}><img src={SPECIALISTS.find(s => s.discipline === d)?.image} alt="" className="aspect-square w-full rounded-lg object-cover"/>{d === 'Skin' ? 'Skincare' : d === 'Barbering' ? 'Grooming' : d}</Button>)}<Button variant="ghost" className="h-auto flex-col gap-2 p-0 text-xs" onClick={() => choose('Hair', ['Knotless braids', 'Protective styling'])}><img src={SPECIALISTS.find(s => s.id === 'amara-reed')?.image} alt="" className="aspect-square w-full rounded-lg object-cover"/>Braiding</Button></div></section><section className="space-y-3"><h2 className="font-display text-2xl">Recommended for you</h2><div className="grid gap-3 sm:grid-cols-2">{list.filter(r => canvasCoverage(r.specialist, browseProfile)).slice(0, 4).map(r => <SpecialistCard key={r.specialist.id} specialist={r.specialist} distance={r.distance}/>)}</div></section></> : <>
    <div className="flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="Back to service categories" onClick={() => { choose('All'); setLocation('Anywhere'); setReviewsView(false); }}><ArrowLeft/></Button><h2 className="font-display text-2xl">{discipline === 'All' ? 'Studios & specialists' : discipline}</h2></div>
    <div className="no-scrollbar flex gap-2 overflow-x-auto">{DISCIPLINES.map(d => <Button key={d} variant={discipline === d ? 'default' : 'outline'} className="shrink-0 rounded-full text-xs" onClick={() => choose(d)}>{d}</Button>)}</div>
    <div className="grid grid-cols-2 gap-3"><label className="text-xs">Distance<select aria-label="Search radius" value={radius} disabled={!origin} onChange={e => setRadius(Number(e.target.value))} className="bare-input disabled:opacity-50">{[10,25,50,100].map(n => <option key={n} value={n}>Within {n} miles</option>)}</select></label>{relevant.depth && <label className="text-xs">Skin tone<select aria-label="Skin tone filter" value={depth ?? ''} onChange={e => setDepth(DEPTHS.find(d => d === e.target.value))} className="bare-input"><option value="">All tones</option>{DEPTHS.map(d => <option key={d}>{d}</option>)}</select></label>}{relevant.hair && <label className="text-xs">Hair texture<select aria-label="Hair texture filter" value={hair} onChange={e => setHair(e.target.value)} className="bare-input"><option value="">All textures</option>{HAIR_TYPES.map(h => <option key={h}>{h}</option>)}</select></label>}</div>
    <div className="space-y-2"><p className="text-xs text-muted-foreground">What are you booking?</p><div className="no-scrollbar flex gap-2 overflow-x-auto">{specialties.map(s => <Button key={s} variant={picked.includes(s) ? 'default' : 'outline'} aria-pressed={picked.includes(s)} className={cn('h-9 shrink-0 rounded-full text-xs')} onClick={() => setPicked(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])}>{s}</Button>)}</div></div>
    {reviewsView ? <ReviewSection title="Service Reviews" loading={records.isPending} error={!!records.error} onRetry={()=>records.refetch()} reviews={serviceReviews(reviews, list.map(r => r.specialist.id))}/> : <><p className="text-xs text-muted-foreground">{list.length} results</p>{list.length ? <div className="grid gap-3 sm:grid-cols-2">{list.map(r => <SpecialistCard key={r.specialist.id} specialist={r.specialist} distance={r.distance}/>)}</div> : <EmptyGallery title="Room for a new discovery" body="No recorded specialists match these choices yet." action={<Button variant="outline" onClick={()=>{choose('All');setLocation('Anywhere');}}>Clear service filters</Button>}/>}</>}
    </>}
  </div>;
}
