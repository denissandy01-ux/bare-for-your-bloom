import { Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

/** One follow control for every feed post type, placed next to the author handle. */
export function FollowPill({following,name,onToggle}:{following:boolean;name:string;onToggle:()=>void}) {
  return <button onClick={onToggle} aria-pressed={following} aria-label={following?`Unfollow ${name}`:`Follow ${name}`} className={cn('inline-flex h-6 items-center gap-1 rounded-full border px-2.5 text-[11px] font-medium backdrop-blur transition active:scale-95',following?'border-oat/20 bg-oat/10 text-oat/80':'border-oat/40 bg-oat/15 text-oat')}>{following?<Check className="h-3 w-3" strokeWidth={3}/>:<Plus className="h-3 w-3" strokeWidth={3}/>}{following?'Following':'Follow'}</button>;
}
