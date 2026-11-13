import { Link, createFileRoute } from "@tanstack/react-router";
import { BareHeader, EmptyState, ListRow, Page, SectionTitle } from "@/components/bare/kit";
import { bestOffer, money, productById, proById, routineById } from "@/lib/data";
import { useBare } from "@/lib/store";
import { specialistById } from '@/lib/specialists';

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved · Becoming Bare" }, { name: "description", content: "Your saved products and pro routines." }, { property: "og:title", content: "Saved · Becoming Bare" }, { property: "og:description", content: "Your saved products and pro routines." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Saved,
});

function Saved() {
  const { state } = useBare();
  const products = state.savedProducts.map(productById).filter((p) => !!p);
  const routines = state.savedRoutines.map(routineById).filter((r) => !!r);
  const specialists=state.savedSpecialists.map(specialistById).filter(s=>!!s);
  return (
    <>
      <BareHeader />
      <Page className="mt-6 space-y-6">
        <section className="space-y-3"><SectionTitle meta="Your studios">Saved specialists</SectionTitle>{specialists.length ? <div className="grid gap-2 md:grid-cols-2">{specialists.map(s=><ListRow key={s.id} to="/specialist/$id" params={{id:s.id}} image={s.image} title={s.studio} meta={`${s.name} · ${s.city} · Sample listing`}/>)}</div> : <p className="text-sm text-sand">No specialists saved yet.</p>}</section>
        <section className="space-y-3">
          <SectionTitle meta="Your shelf">Saved products</SectionTitle>
          {products.length === 0 ? (
            <EmptyState title="Your shelf is bare" body="Tap Save on any wear test to keep it here and compare prices later." action={<Link to="/" className="inline-flex h-11 items-center rounded-full bg-clay px-5 text-[14px] font-semibold text-oat">Browse the feed</Link>} />
          ) : (
            <div className="grid gap-2 md:grid-cols-2">{products.map((p) => { const o = bestOffer(p); return <ListRow key={p.id} to="/product/$id" params={{ id: p.id }} image={p.image} title={p.name} meta={`${p.brand} · ${o.retailer} · ${money(o.price)}`} />; })}</div>
          )}
        </section>
        <section className="space-y-3">
          <SectionTitle meta="Prescriptions">Saved routines</SectionTitle>
          {routines.length === 0 ? (
            <EmptyState title="No routines yet" body="Save a pro's routine to keep their steps and code close." action={<Link to="/pros" className="inline-flex h-11 items-center rounded-full bg-clay px-5 text-[14px] font-semibold text-oat">Find a pro</Link>} />
          ) : (
            <div className="grid gap-2 md:grid-cols-2">{routines.map((r) => <ListRow key={r.id} to="/routine/$id" params={{ id: r.id }} image={r.media} title={r.title} meta={`${proById(r.proId)?.name} · ${r.steps.length} steps`} />)}</div>
          )}
        </section>
      </Page>
    </>
  );
}
