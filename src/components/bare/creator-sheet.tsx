import { Link } from '@tanstack/react-router';
import { BareSheet } from '@/components/bare/sheets';
import { FollowPill } from '@/components/bare/follow-pill';
import { FEED, UNDERTONE_SWATCH, productById, type Creator } from '@/lib/data';
import { useBare } from '@/lib/store';

/** Creator profile: their canvas plus every wear test they've posted. Life stage stays private. */
export function CreatorSheet({ creator, open, onOpenChange }: { creator: Creator; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { state, toggleCreator } = useBare();
  const posts = FEED.filter(p => p.creator.handle === creator.handle);
  return <BareSheet open={open} onOpenChange={onOpenChange} title={creator.handle} description={`${posts.length} wear test${posts.length === 1 ? '' : 's'} · sample creator`}>
    <div className="mt-4 flex items-center gap-3">
      <span className="h-10 w-10 rounded-full ring-2 ring-sand" style={{ background: UNDERTONE_SWATCH[creator.depth][creator.undertone] }} />
      <p className="flex-1 text-[14px]">{creator.depth} {creator.undertone} · {creator.skinType} · {creator.hair}</p>
      <div className="rounded-full bg-cocoa p-0.5"><FollowPill following={state.followedCreators.includes(creator.handle)} name={creator.handle} onToggle={() => toggleCreator(creator.handle)} /></div>
    </div>
    <ul className="mt-5 grid grid-cols-3 gap-2">
      {posts.map(p => { const pr = productById(p.productId); return <li key={p.id}><Link to="/" search={{ post: p.id }} onClick={() => onOpenChange(false)} className="block"><img src={p.media} alt={pr ? pr.name : 'Wear test'} className="aspect-[3/4] w-full rounded-[14px] object-cover" /><span className="mt-1 block truncate text-[12px] text-umber">{pr?.brand} {pr?.name}</span></Link></li>; })}
    </ul>
  </BareSheet>;
}
