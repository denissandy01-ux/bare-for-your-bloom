import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { BareHeader, ListRow, Page, SectionTitle } from "@/components/bare/kit";
import { UNDERTONE_SWATCH, skinTags, toneLabel } from "@/lib/data";
import { useBare, walletTotals, daysSince } from "@/lib/store";
import { useAccount } from '@/lib/account';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { BRANDS } from '@/lib/atlas';
import { Bell, Coins, Pencil, Package, Clapperboard } from 'lucide-react';

export const Route = createFileRoute("/me")({
  head: () => ({ meta: [{ title: "Me · Becoming Bare" }, { name: "description", content: "Your canvas profile, Bare Points and 30-day check-in." }, { property: "og:title", content: "My Canvas · Becoming Bare" }, { property: "og:description", content: "Your canvas profile, Bare Points and 30-day check-in." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Me,
});

function Me() {
  const { state, reset, toggleCreator } = useBare();
  const {user,ready}=useAccount();
  const qc=useQueryClient(),nav=useNavigate();
  const p = state.profile;
  const w = walletTotals(state.wallet);
  const following = state.followedCreators.length + state.followedBrands.length;
  return (
    <>
      <BareHeader />
      <Page className="mt-6 space-y-5">
        <header className="flex items-center gap-4">
          <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full p-1 ring-2 ring-peach/70" style={{ background: UNDERTONE_SWATCH[p.depth][p.undertone] }}><span className="font-display text-2xl text-oat drop-shadow">{(user?.email ?? 'G').charAt(0).toUpperCase()}</span></span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-2xl">{user ? `@${user.email?.split('@')[0]}` : ready ? 'Guest' : 'Opening…'}</p>
            <p className="mt-1 text-sm"><b>—</b> <span className="text-sand">Followers</span> · <b>{following}</b> <span className="text-sand">Following</span></p>
            <div className="mt-2">{user ? <Button size="sm" variant="secondary" onClick={async()=>{await qc.cancelQueries();qc.clear();const {error}=await supabase.auth.signOut();if(error)return;reset();void nav({to:'/auth',replace:true});}}>Sign out</Button> : <Button size="sm" asChild><Link to="/auth">Sign in / Create account</Link></Button>}</div>
          </div>
        </header>
        {state.consulted ? <Link to="/consultation" className="flex items-center gap-3 rounded-full border border-oat/20 px-4 py-3 text-sm"><span className="h-5 w-5 shrink-0 rounded-full" style={{ background: UNDERTONE_SWATCH[p.depth][p.undertone] }} /><span className="min-w-0 flex-1 truncate">{[toneLabel(p.depth, p.undertone), p.hair, ...skinTags(p)].filter(Boolean).join(' · ')}</span><Pencil className="h-4 w-4 shrink-0 text-sand" aria-label="Edit canvas" /></Link>
          : <Link to="/consultation" className="flex h-14 items-center justify-center rounded-full bg-clay text-[15px] font-semibold text-oat">Start Canvas Consultation</Link>}
        <div className="grid grid-cols-2 gap-3">
          {([['/wallet', Coins, `${Math.round(w.available)} Bare Points`, `${Math.round(w.pending)} pending`], ['/notifications', Bell, 'Notifications', 'Manage alerts'], ['/saved', Package, 'Shelf & Empties', `${state.emptyBottles.length} empties logged`], ['/create', Clapperboard, 'My content', 'Create & manage']] as const).map(([to, Icon, t, m]) => <Link key={to} to={to} className="min-w-0 rounded-[24px] bg-oat p-4 text-cocoa"><Icon className="h-5 w-5 text-clay" /><p className="mt-2 truncate font-semibold">{t}</p><p className="truncate text-xs text-umber">{m}</p></Link>)}
        </div>
        <section className="space-y-2"><h2 className="font-display text-xl">Following · {state.followedCreators.length+state.followedBrands.length}</h2>{state.followedCreators.length+state.followedBrands.length===0?<p className="text-sm text-sand">Tap Follow on a creator, specialist or brand and they'll show up here and in your Following feed.</p>:<div className="flex flex-wrap gap-2">{state.followedCreators.filter(h=>h.startsWith('@')).map(h=><span key={h} className="inline-flex items-center gap-2 rounded-full border border-oat/20 px-3 py-1.5 text-sm">{h}<button aria-label={`Unfollow ${h}`} onClick={()=>toggleCreator(h)} className="text-sand">×</button></span>)}</div>}<p className="text-xs text-sand">Followers appear once your public profile is connected.</p></section>
        {state.followedBrands.length>0&&<section className="space-y-2"><h2 className="font-display text-xl">Followed brands</h2>{BRANDS.filter(b=>state.followedBrands.includes(b.id)).map(b=><Link key={b.id} to="/brand/$id" params={{id:b.id}} className="block border-b border-oat/15 py-3 text-sm">{b.name} →</Link>)}</section>}
        <details className="border-y border-oat/15 py-4"><summary className="cursor-pointer font-display text-xl">My Beauty Journey</summary><div className="mt-4"><ListRow to="/canvas" title="30 Days Bare" meta={state.canvasStart ? `Day ${Math.min(30, daysSince(state.canvasStart))} of 30 · ${state.checkIns.length} check-ins` : "Track barrier, hair and bottle progress"} /></div></details>
        <section className="space-y-3 border-t border-oat/15 pt-5"><SectionTitle meta="Behind the care">Creator & brand workspaces</SectionTitle><ListRow to="/studio" title="Explore the studio" meta="Creator tools · brand portal · licensing"/><ListRow to="/creator" title="Creator studio" meta="Content, partnerships & your own product line"/><ListRow to="/brand" title="Brand portal" meta="Your products & permission-based UGC licensing"/></section>
      </Page>
    </>
  );
}
