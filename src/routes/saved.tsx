import { Link, createFileRoute } from "@tanstack/react-router";
import { BareHeader, EmptyState, ListRow, Page, SectionTitle } from "@/components/bare/kit";
import { bestOffer, money, productById, proById, routineById } from "@/lib/data";
import { useBare } from "@/lib/store";
import { specialistById } from '@/lib/specialists';
import { canvasInsights } from '@/lib/formula';
import { BRANDS } from '@/lib/atlas';
import { BrandCard } from '@/components/bare/atlas';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { BareShelf, Comparison, EmptyBottleClub } from '@/components/bare/collections';
import { communityOptions } from '@/lib/community-query';

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved · Becoming Bare" }, { name: "description", content: "Your saved products and pro routines." }, { property: "og:title", content: "Saved · Becoming Bare" }, { property: "og:description", content: "Your saved products and pro routines." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Saved,
});

function Saved() {
  const { state } = useBare();
  const [tab,setTab]=useState('Saved items');
  const posts=useQuery(communityOptions);
  const products = state.savedProducts.map(productById).filter((p) => !!p);
  const routines = state.savedRoutines.map(routineById).filter((r) => !!r);
  const specialists=state.savedSpecialists.map(specialistById).filter(s=>!!s);
  return (
    <>
      <BareHeader />
      <Page className="mt-6 space-y-6">
        <h1 className="font-display text-3xl">Your beauty collection</h1>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">{['Saved items','My Bare Shelf','Bare or Buy?','Empty Bottle Club'].map(t=><Button key={t} variant={tab===t?'default':'secondary'} onClick={()=>setTab(t)}>{t}</Button>)}</div>
        {tab==='My Bare Shelf'?<BareShelf/>:tab==='Bare or Buy?'?<Comparison/>:tab==='Empty Bottle Club'?<EmptyBottleClub/>:<>
        {state.savedPosts.length>0&&<section className="space-y-3"><SectionTitle meta="Your collection">Saved videos & photos</SectionTitle>{posts.data?.filter(p=>state.savedPosts.includes(p.id)).map(p=><Link key={p.id} to="/" search={{post:p.id}} className="flex gap-3 border-b border-oat/15 py-3">{p.media_type==='image'&&<img src={p.url} alt="" className="h-16 w-16 rounded-xl object-cover"/>}<span className="min-w-0"><span className="block text-xs text-peach">{p.kind} · {p.author}</span><span className="block line-clamp-2 text-sm">{p.caption}</span></span></Link>)}</section>}
        <section className="space-y-3"><SectionTitle meta="Your studios">Saved specialists</SectionTitle>{specialists.length ? <div className="grid gap-2 md:grid-cols-2">{specialists.map(s=><ListRow key={s.id} to="/specialist/$id" params={{id:s.id}} image={s.image} title={s.studio} meta={`${s.name} · ${s.city} · Sample listing`}/>)}</div> : <p className="text-sm text-sand">No specialists saved yet.</p>}</section>
        <section className="space-y-3">
          <SectionTitle meta="Your shelf">Saved products</SectionTitle>
          {products.length === 0 ? (
            <EmptyState title="Your shelf is bare" body="Tap Save on any wear test to keep it here and compare prices later." action={<Link to="/" className="inline-flex h-11 items-center rounded-full bg-clay px-5 text-[14px] font-semibold text-oat">Browse the feed</Link>} />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">{products.map((p) => { const o = bestOffer(p); return <div key={p.id}><ListRow to="/product/$id" params={{ id: p.id }} image={p.image} title={p.name} meta={`${p.brand} · ${o.retailer} · ${money(o.price)}`} /><p className="mt-2 px-3 text-xs leading-relaxed text-sand">{canvasInsights(p,state.profile)[0]}</p><Link to="/product/$id" params={{id:p.id}} className="ml-3 mt-1 inline-block text-xs text-peach">Inside the Formula →</Link></div>; })}</div>
          )}
        </section>
        {state.followedBrands.length>0&&<section><SectionTitle meta="Your global discoveries">Followed brands</SectionTitle><div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">{BRANDS.filter(b=>state.followedBrands.includes(b.id)).map(b=><BrandCard key={b.id} brand={b}/>)}</div></section>}
        <section className="space-y-3">
          <SectionTitle meta="Prescriptions">Saved routines</SectionTitle>
          {routines.length === 0 ? (
            <EmptyState title="No routines yet" body="Save a pro's routine to keep their steps and code close." action={<Link to="/discover" className="inline-flex h-11 items-center rounded-full bg-clay px-5 text-[14px] font-semibold text-oat">Find a pro</Link>} />
          ) : (
            <div className="grid gap-2 md:grid-cols-2">{routines.map((r) => <ListRow key={r.id} to="/routine/$id" params={{ id: r.id }} image={r.media} title={r.title} meta={`${proById(r.proId)?.name} · ${r.steps.length} steps`} />)}</div>
          )}
        </section>
        </>}
      </Page>
    </>
  );
}
