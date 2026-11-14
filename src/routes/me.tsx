import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { BareHeader, ListRow, Page, SectionTitle } from "@/components/bare/kit";
import { UNDERTONE_SWATCH, skinTags, toneLabel } from "@/lib/data";
import { useBare, walletTotals, daysSince } from "@/lib/store";
import { useAccount } from '@/lib/account';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { BRANDS } from '@/lib/atlas';

export const Route = createFileRoute("/me")({
  head: () => ({ meta: [{ title: "My Canvas · Becoming Bare" }, { name: "description", content: "Your canvas profile, Bare Points and 30-day check-in." }, { property: "og:title", content: "My Canvas · Becoming Bare" }, { property: "og:description", content: "Your canvas profile, Bare Points and 30-day check-in." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Me,
});

function Me() {
  const { state, reset } = useBare();
  const {user,ready}=useAccount();
  const qc=useQueryClient(),nav=useNavigate();
  const p = state.profile;
  const w = walletTotals(state.wallet);
  return (
    <>
      <BareHeader />
      <Page className="mt-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-oat/15 pb-4"><p className="text-sm text-sand">{user ? user.email : ready ? 'Exploring as a guest' : 'Opening your account…'}</p>{user ? <Button variant="secondary" onClick={async()=>{await qc.cancelQueries();qc.clear();const {error}=await supabase.auth.signOut();if(error)return;reset();void nav({to:'/auth',replace:true});}}>Sign out</Button> : <Button asChild><Link to="/auth">Sign in / Create account</Link></Button>}</div>
        <SectionTitle meta="Your bare canvas">{toneLabel(p.depth, p.undertone)}</SectionTitle>
        <div className="flex items-center gap-4 rounded-[28px] bg-oat p-5 text-cocoa">
          <span className="h-14 w-14 shrink-0 rounded-full ring-2 ring-sand" style={{ background: UNDERTONE_SWATCH[p.depth][p.undertone] }} />
          <div className="min-w-0 text-[14px] text-umber">
            <p>Skin: {skinTags(p).join(", ") || "Not set"} · Barrier: {p.barrier ?? "Not set"}</p>
            <p>Hair: {p.hair ?? "Not set"} · Porosity: {p.porosity ?? "Not set"}</p>
            {p.goal && <p className="mt-1 font-display italic text-cocoa">“{p.goal}”</p>}
          </div>
        </div>
        <Link to="/consultation" className="flex h-14 items-center justify-center rounded-full bg-clay text-[15px] font-semibold text-oat">{state.consulted ? "Retake Canvas Consultation" : "Start Canvas Consultation"}</Link>
        <ListRow to="/wallet" title="Bare Points" meta={`${Math.round(w.available)} pts available · ${Math.round(w.pending)} pending`} />
        <ListRow to="/notifications" title="Notification preferences" meta="Community · brands · discoveries" />
        <ListRow to="/create" title="My content" meta="Create a post · manage published stories" />
        {state.followedBrands.length>0&&<section className="space-y-2"><h2 className="font-display text-xl">Followed brands</h2>{BRANDS.filter(b=>state.followedBrands.includes(b.id)).map(b=><Link key={b.id} to="/brand/$id" params={{id:b.id}} className="block border-b border-oat/15 py-3 text-sm">{b.name} →</Link>)}</section>}
        <details className="border-y border-oat/15 py-4"><summary className="cursor-pointer font-display text-xl">My Beauty Journey</summary><div className="mt-4"><ListRow to="/canvas" title="30 Days Bare" meta={state.canvasStart ? `Day ${Math.min(30, daysSince(state.canvasStart))} of 30 · ${state.checkIns.length} check-ins` : "Track barrier, hair and bottle progress"} /></div></details>
        <section className="space-y-3 border-t border-oat/15 pt-5"><SectionTitle meta="Behind the care">Creator & brand workspaces</SectionTitle><ListRow to="/studio" title="Explore the studio" meta="Creator tools · brand portal · licensing"/><ListRow to="/creator" title="Creator studio" meta="Content, partnerships & your own product line"/><ListRow to="/brand" title="Brand portal" meta="Your products & permission-based UGC licensing"/></section>
      </Page>
    </>
  );
}
