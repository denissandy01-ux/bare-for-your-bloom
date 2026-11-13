import { Link } from '@tanstack/react-router';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { canvasCoverage, type Specialist } from '@/lib/specialists';
import { money } from '@/lib/data';
import { useBare } from '@/lib/store';

export function SpecialistCard({ specialist: s, distance }: { specialist: Specialist; distance?: number | undefined }) {
  const { state } = useBare();
  return <Link to="/specialist/$id" params={{ id: s.id }} className="group min-w-0 overflow-hidden rounded-[28px] bg-oat text-cocoa">
    <div className="relative aspect-[4/3] overflow-hidden">
      <img src={s.image} alt={`${s.studio} sample portfolio`} width={1024} height={768} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" />
      <span className="absolute left-3 top-3 rounded-full bg-oat/95 px-3 py-1.5 text-[11px] font-semibold">{s.discipline}</span>
      <span className="absolute bottom-3 left-3 rounded-full bg-cocoa/90 px-3 py-1.5 text-[11px] text-oat">{canvasCoverage(s, state.profile) ? 'Works with your canvas' : 'Explore their specialties'}</span>
    </div>
    <div className="space-y-2 p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2"><div className="min-w-0"><h3 className="font-display text-[22px] leading-tight">{s.name}</h3><p className="text-[13px] text-umber">{s.studio}</p></div><ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-clay" /></div>
      <p className="flex items-start gap-1 text-[12px] text-umber"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{s.neighborhood} · {s.city}{distance !== undefined && ` · ${distance.toFixed(1)} mi`}</span></p>
      <p className="min-h-9 text-[12px] leading-relaxed">{s.specialties.join(' · ')}</p>
      <div className="flex items-center justify-between gap-2 border-t border-sand pt-3 text-[12px]"><span className="text-umber">Sample listing</span><span className="font-semibold">From {money(Math.min(...s.services.map(x => x.price)))}</span></div>
    </div>
  </Link>;
}