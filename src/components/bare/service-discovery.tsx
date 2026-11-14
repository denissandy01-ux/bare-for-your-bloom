import { useState } from 'react';
import { LocateFixed, MapPin, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CITIES, DISCIPLINES, SPECIALISTS, disciplineFilters, findSpecialists, type Discipline, type Point } from '@/lib/specialists';
import { DEPTHS, HAIR_TYPES, type Depth } from '@/lib/data';
import { cn } from '@/lib/utils';
import { SpecialistCard } from './specialist-card';

export function ServiceDiscovery({ query }: { query: string }) {
  const [discipline, setDiscipline] = useState<Discipline>('All');
  const [location, setLocation] = useState('Anywhere');
  const [gps, setGps] = useState<Point>();
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [radius, setRadius] = useState(50);
  const [depth, setDepth] = useState<Depth>();
  const [hair, setHair] = useState('');
  const [specialty, setSpecialty] = useState('');
  const origin = location === 'Current location' ? gps : CITIES.find(c => c.name === location);
  const relevant = disciplineFilters(discipline);
  const list = findSpecialists({ query, discipline, origin, radius, depth, hair, specialty });
  const specialties = [...new Set(SPECIALISTS.filter(s => discipline === 'All' || s.discipline === discipline).flatMap(s => s.specialties))].sort();
  const locate = () => {
    if (!navigator.geolocation) { setError('Location is unavailable on this device. Choose a city instead.'); return; }
    setLocating(true); setError('');
    navigator.geolocation.getCurrentPosition(p => { setGps({ lat: p.coords.latitude, lng: p.coords.longitude }); setLocation('Current location'); setLocating(false); }, () => { setError('Your location could not be accessed. Choose a city instead.'); setLocating(false); }, { timeout: 10000, maximumAge: 300000 });
  };
  const control = 'h-11 w-full min-w-0 rounded-full border border-sand bg-oat px-3 text-[13px] text-cocoa';
  return <div className="space-y-5">
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4" aria-label="Service categories">{DISCIPLINES.map(d => <Button key={d} variant="secondary" aria-pressed={discipline === d} onClick={() => { setDiscipline(d); setSpecialty(''); setDepth(undefined); setHair(''); }} className={cn('h-11 shrink-0 rounded-full px-4', discipline === d ? 'bg-clay text-oat' : 'bg-oat text-cocoa')>{d === 'Barbering' ? 'Barbering & Grooming' : d}</Button>)}</div>
    <div className="space-y-3 border-y border-oat/15 py-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <label className="flex min-w-0 items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-peach" /><select aria-label="Location" value={location} onChange={e => { setLocation(e.target.value); setError(''); }} className={control}><option>Anywhere</option>{CITIES.map(c => <option key={c.name}>{c.name}</option>)}{gps && <option>Current location</option>}</select></label>
        <Button variant="secondary" onClick={locate} disabled={locating} className="h-11 shrink-0 rounded-full px-3" title="Use current location" aria-label="Use current location"><LocateFixed /><span className="hidden sm:inline">{locating ? 'Locating…' : 'Near me'}</span></Button>
      </div>
      {error && <p role="alert" className="text-[13px] text-peach">{error}</p>}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <label className="space-y-1 text-[11px] text-sand"><span className="flex items-center gap-1"><SlidersHorizontal className="h-3 w-3" />Distance</span><select aria-label="Search radius" value={radius} disabled={!origin} onChange={e => setRadius(Number(e.target.value))} className={cn(control, 'disabled:opacity-50')}>{[10, 25, 50, 100].map(n => <option key={n} value={n}>Within {n} miles</option>)}</select></label>
        {relevant.depth && <label className="space-y-1 text-[11px] text-sand">Skin tone<select aria-label="Skin tone filter" value={depth ?? ''} onChange={e => setDepth(DEPTHS.find(d => d === e.target.value))} className={control}><option value="">All tones</option>{DEPTHS.map(d => <option key={d}>{d}</option>)}</select></label>}
        {relevant.hair && <label className="space-y-1 text-[11px] text-sand">Hair texture<select aria-label="Hair texture filter" value={hair} onChange={e => setHair(e.target.value)} className={control}><option value="">All textures</option>{HAIR_TYPES.map(h => <option key={h}>{h}</option>)}</select></label>}
        <label className="space-y-1 text-[11px] text-sand">{discipline === "Nails" ? "Style & nail care" : discipline === "Makeup" ? "Finish & occasion" : discipline === "Skin" ? "Treatment & skin concern" : discipline === "Barbering" ? "Beard, scalp & cuts" : "Service & specialty"}<select aria-label="Specialty filter" value={specialty} onChange={e => setSpecialty(e.target.value)} className={control}><option value="">All specialties</option>{specialties.map(s => <option key={s}>{s}</option>)}</select></label>
      </div>
    </div>
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3"><div className="min-w-0"><p className="text-[11px] text-peach">STUDIOS & SPECIALISTS</p><h2 className="mt-1 font-display text-[25px]">{origin ? 'Care close to you' : 'Find your kind of care'}</h2></div><span className="pb-1 text-[12px] text-sand">{list.length} results</span></div>
    <p className="text-[12px] leading-relaxed text-sand/80">Illustrative studios, portfolios and prices. Credentials are not verified; bookings are not available yet.</p>
    {list.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.map(({ specialist, distance }) => <SpecialistCard key={specialist.id} specialist={specialist} distance={distance} />)}</div> : <div className="py-8 text-center"><h3 className="font-display text-[22px]">No specialists match yet</h3><p className="mt-2 text-[14px] text-sand">Try a wider distance, another city, or fewer filters.</p><Button className="mt-4 rounded-full" onClick={() => { setLocation('Anywhere'); setDiscipline('All'); setDepth(undefined); setHair(''); setSpecialty(''); }}>Reset filters</Button></div>}
  </div>;
}