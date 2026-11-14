import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { BareHeader, ListRow, Page, SectionTitle } from "@/components/bare/kit";
import { UNDERTONE_SWATCH, skinTags, toneLabel } from "@/lib/data";
import { useBare, walletTotals } from "@/lib/store";
import { useState } from 'react';
import { useJourney } from '@/lib/journey';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAccount } from '@/lib/account';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { BRANDS } from '@/lib/atlas';
import { Bell, Coins, Pencil, Package, Clapperboard, Sparkles } from 'lucide-react';

export const Route = createFileRoute("/me")({
  head: () => ({ meta: [{ title: "Me · Becoming Bare" }, { name: "description", content: "Your canvas profile, Bare Points and Beauty Journey." }, { property: "og:title", content: "My Canvas · Becoming Bare" }, { property: "og:description", content: "Your canvas profile, Bare Points and Beauty Journey." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Me,
});

function Me() {
  const { state, reset, toggleCreator, toggleBrandSignal } = useBare();
  const {user,ready}=useAccount();
  const qc=useQueryClient(),nav=useNavigate();
  const p = state.profile;
  const w = walletTotals(state.wallet);
  const following = state.followedCreators.length + state.followedBrands.length;
  const [showFollowing,setShowFollowing]=useState(false);
  const [journey]=useJourney();
  const activeGoals=journey.goals.filter(g=>!g.done).length;
  return (
    <>
      <BareHeader />
      <Page className="mt-6 space-y-5">
        <header className="flex items-center gap-4">
          <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full p-1 ring-2 ring-peach/70" style={{ background: UNDERTONE_SWATCH[p.depth][p.undertone] }}><span className="font-display text-2xl text-oat drop-shadow">{(user?.email ?? 'G').charAt(0).toUpperCase()}</span></span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-2xl">{user ? `@${user.email?.split('@')[0]}` : ready ? 'Guest' : 'Opening…'}</p>
            <p className="mt-1 text-sm"><b>—</b> <span className="text-sand">Followers</span> · <button onClick={()=>setShowFollowing(true)} className="underline-offset-2 hover:underline"><b>{following}</b> <span className="text-sand">Following</span></button></p>
            <div className="mt-2">{user ? <Button size="sm" variant="secondary" onClick={async()=>{await qc.cancelQueries();qc.clear();const {error}=await supabase.auth.signOut();if(error)return;reset();void nav({to:'/auth',replace:true});}}>Sign out</Button> : <Button size="sm" asChild><Link to="/auth">Sign in / Create account</Link></Button>}</div>
          </div>
        </header>
        {state.consulted ? <Link to="/consultation" className="flex items-center gap-3 rounded-full border border-oat/20 px-4 py-3 text-sm"><span className="h-5 w-5 shrink-0 rounded-full" style={{ background: UNDERTONE_SWATCH[p.depth][p.undertone] }} /><span className="min-w-0 flex-1 truncate">{[toneLabel(p.depth, p.undertone), p.hair, ...skinTags(p)].filter(Boolean).join(' · ')}</span><Pencil className="h-4 w-4 shrink-0 text-sand" aria-label="Edit canvas" /></Link>
          : <Link to="/consultation" className="flex items-center gap-4"><span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-clay text-center text-[11px] font-semibold leading-tight text-oat ring-4 ring-peach/30">Start<br/>canvas</span><span className="min-w-0"><span className="block font-semibold">Start your Canvas Consultation</span><span className="block text-xs text-sand">Two minutes · tone, hair and skin · skip anything</span></span></Link>}
        <div className="grid grid-cols-2 gap-3">
          {([['/wallet', Coins, `${Math.round(w.available)} Bare Points`, `${Math.round(w.pending)} pending`], ['/notifications', Bell, 'Notifications', 'Manage alerts'], ['/saved', Package, 'Shelf & Empties', `${state.emptyBottles.length} empties logged`], ['/create', Clapperboard, 'My content', 'Create & manage']] as const).map(([to, Icon, t, m]) => <Link key={to} to={to} className="min-w-0 rounded-[24px] bg-oat p-4 text-cocoa"><Icon className="h-5 w-5 text-clay" /><p className="mt-2 truncate font-semibold">{t}</p><p className="truncate text-xs text-umber">{m}</p></Link>)}
        </div>
        <Link to="/canvas" className="flex items-center gap-3 rounded-[24px] border border-oat/15 p-4"><Sparkles className="h-5 w-5 shrink-0 text-peach"/><span className="min-w-0 flex-1"><span className="block font-display text-xl">My Beauty Journey</span><span className="block truncate text-xs text-sand">{journey.goals.length?`${activeGoals} active goals · ${journey.entries.length} journal entries`:'Set personal goals and keep an optional journal'}</span></span><span className="text-sand">→</span></Link>
        <Sheet open={showFollowing} onOpenChange={setShowFollowing}><SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-[28px]"><SheetHeader><SheetTitle>Following · {following}</SheetTitle></SheetHeader><div className="mt-4 space-y-1">{following===0&&<p className="text-sm text-muted-foreground">You're not following anyone yet. Tap Follow on a creator, specialist or brand.</p>}{state.followedCreators.map(h=><div key={h} className="flex items-center justify-between border-b py-3 text-sm"><span>{h}</span><button onClick={()=>toggleCreator(h)} className="rounded-full border px-3 py-1 text-xs">Unfollow</button></div>)}{BRANDS.filter(b=>state.followedBrands.includes(b.id)).map(b=><div key={b.id} className="flex items-center justify-between border-b py-3 text-sm"><Link to="/brand/$id" params={{id:b.id}} onClick={()=>setShowFollowing(false)}>{b.name} · Brand</Link><button onClick={()=>toggleBrandSignal('followedBrands',b.id)} className="rounded-full border px-3 py-1 text-xs">Unfollow</button></div>)}</div></SheetContent></Sheet>
        <section className="space-y-3 border-t border-oat/15 pt-5"><SectionTitle meta="Behind the care">Creator & brand workspaces</SectionTitle><ListRow to="/studio" title="Explore the studio" meta="Creator tools · brand portal · licensing"/><ListRow to="/creator" title="Creator studio" meta="Content, partnerships & your own product line"/><ListRow to="/brand" title="Brand portal" meta="Your products & permission-based UGC licensing"/></section>
      </Page>
    </>
  );
}
