import { ShareButton } from './share-button';
import { LikeBurst, useDoubleTapLike } from './like-burst';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Bookmark, Heart, Share2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { BareSheet } from '@/components/bare/sheets';
import { specialistById, handleFor, studioTeam } from '@/lib/specialists';
import { money } from '@/lib/data';
import { useBare } from '@/lib/store';
import { FollowPill } from '@/components/bare/follow-pill';
import type { ServicePost } from '@/lib/service-feed';

/** A service post belongs to the artist; the studio opens a roster of everyone who works there. */
export function ServiceFeedItem({ post }: { post: ServicePost }) {
  const specialist = specialistById(post.specialistId), { state, toggleSpecialist, toggleLike, toggleCreator } = useBare();
  const [roster, setRoster] = useState(false);
  const doubleTap = useDoubleTapLike(state.likedPosts.includes(post.id), () => toggleLike(post.id));
  if (!specialist) return null;
  const liked = state.likedPosts.includes(post.id);
  const saved = state.savedSpecialists.includes(specialist.id);
  const first = specialist.name.split(' ')[0];
  const from = Math.min(...specialist.services.map(s => s.price));
  const team = studioTeam(specialist);
  return <section className="relative h-full snap-start overflow-hidden bg-cocoa" aria-label={`${post.category} service by ${specialist.name}`}>
    <img src={post.image} width={768} height={1152} loading="lazy" onDoubleClick={doubleTap.onDoubleClick} onTouchEnd={doubleTap.onTouchEnd} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
    <LikeBurst burst={doubleTap.burst}/>
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cocoa via-transparent to-cocoa/20" />
    <div className="feed-actions absolute right-3 bottom-[200px] flex flex-col gap-3">
      <Button variant="ghost" size="icon" aria-label={liked ? 'Unlike post' : 'Like post'} aria-pressed={liked} onClick={() => toggleLike(post.id)} className="h-12 w-12 rounded-full bg-cocoa/50 text-oat backdrop-blur"><Heart className={liked ? 'fill-clay text-clay' : ''} /></Button>
      <Button variant="ghost" size="icon" aria-label="Save artist" aria-pressed={saved} onClick={() => { toggleSpecialist(specialist.id); toast(saved ? 'Removed from saves' : `${first} saved`); }} className="h-12 w-12 rounded-full bg-cocoa/50 text-oat backdrop-blur"><Bookmark className={saved ? 'fill-current' : ''} /></Button>
      <ShareButton title={post.title} path={`/?post=${post.id}`} label="Share artist" className="h-12 w-12 rounded-full bg-cocoa/50 text-oat backdrop-blur"/>
    </div>
    <div className="feed-shop absolute inset-x-3 bottom-3 space-y-2.5">
      <p className="flex flex-wrap items-center gap-x-1.5 text-sm text-oat">
        <Link to="/specialist/$id" params={{ id: specialist.id }} className="font-semibold">{handleFor(specialist)}</Link>
        <span className="text-sand">·</span>
        <button onClick={() => setRoster(true)} className="text-sand underline-offset-2 hover:underline">{specialist.studio}</button>
        <FollowPill following={state.followedCreators.includes(handleFor(specialist))} name={handleFor(specialist)} onToggle={()=>toggleCreator(handleFor(specialist))}/>
      </p>
      <p className="max-w-[80%] text-[15px] text-oat">{post.caption}</p>
      <div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-oat/15 px-3 py-1 text-oat backdrop-blur">{post.category}</span><span className="inline-flex items-center gap-1 rounded-full bg-oat/15 px-3 py-1 text-oat backdrop-blur"><MapPin className="h-3 w-3" />{specialist.city}</span></div>
      <Button asChild className="min-h-12 w-full rounded-full text-[15px]"><Link to="/specialist/$id" params={{ id: specialist.id }}>Book with {first} · from {money(from)}</Link></Button>
      <p className="text-center text-[10px] uppercase tracking-[0.14em] text-sand/70">Illustrative listing</p>
    </div>
    <BareSheet open={roster} onOpenChange={setRoster} title={`Meet the team at ${specialist.studio}`} description={`${specialist.neighborhood} · ${specialist.city}. Book the artist, not just the studio.`}>
      <ul className="divide-y divide-sand">{team.map(t => <li key={t.id}><Link to="/specialist/$id" params={{ id: t.id }} onClick={() => setRoster(false)} className="flex items-center gap-3 py-3 text-cocoa"><img src={t.image} alt="" className="h-12 w-12 rounded-full object-cover" /><span className="min-w-0 flex-1"><span className="block font-semibold">{t.name} <span className="font-normal text-umber">{handleFor(t)}</span></span><span className="block truncate text-xs text-umber">{t.credential} · {t.specialties.slice(0, 2).join(', ')}</span></span><span className="text-xs text-umber">from {money(Math.min(...t.services.map(s => s.price)))}</span></Link></li>)}</ul>
    </BareSheet>
  </section>;
}
