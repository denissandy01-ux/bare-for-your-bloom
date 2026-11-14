import { Link } from '@tanstack/react-router';
import { Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Specialist } from '@/lib/specialists';
import { money } from '@/lib/data';
import { useBare } from '@/lib/store';
import { cn } from '@/lib/utils';
export function SpecialistCard({ specialist: s, distance }: { specialist: Specialist; distance?: number | undefined }) {
  const { state, toggleSpecialist } = useBare();
  const saved = state.savedSpecialists.includes(s.id);
  return <article className="relative min-w-0 overflow-hidden rounded-lg border border-border bg-card text-card-foreground"><Link to="/specialist/$id" params={{ id: s.id }} className="block"><img src={s.image} alt={`${s.studio} illustrative portfolio`} className="aspect-[4/3] w-full object-cover" loading="lazy"/><div className="space-y-2 p-4"><h3 className="font-display text-xl">{s.studio}</h3><p className="text-sm">{s.name} · {s.discipline}</p><p className="text-xs text-muted-foreground">{s.specialties.join(' · ')}</p><p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3"/>{s.city}{distance !== undefined && ` · ${distance.toFixed(1)} mi`}</p><p className="text-xs">Sample rates from {money(Math.min(...s.services.map(x => x.price)))}</p></div></Link><Button variant="secondary" size="icon" aria-label={`${saved ? 'Unsave' : 'Save'} ${s.name}`} aria-pressed={saved} onClick={() => toggleSpecialist(s.id)} className="absolute right-2 top-2 h-9 w-9 rounded-full"><Heart className={cn('h-4 w-4', saved && 'fill-primary text-primary')}/></Button></article>;
}
