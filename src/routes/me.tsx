import { Link, createFileRoute } from "@tanstack/react-router";
import { BareHeader, ListRow, Page, SectionTitle } from "@/components/bare/kit";
import { DEPTH_SWATCH, money, toneLabel } from "@/lib/data";
import { useBare, walletTotals, daysSince } from "@/lib/store";

export const Route = createFileRoute("/me")({
  head: () => ({ meta: [{ title: "My Canvas · Becoming Bare" }, { name: "description", content: "Your canvas profile, cashback wallet and 30-day check-in." }, { property: "og:title", content: "My Canvas · Becoming Bare" }, { property: "og:description", content: "Your canvas profile, cashback wallet and 30-day check-in." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Me,
});

function Me() {
  const { state } = useBare();
  const p = state.profile;
  const w = walletTotals(state.wallet);
  return (
    <>
      <BareHeader />
      <Page className="mt-6 space-y-5">
        <SectionTitle meta="Your bare canvas">{toneLabel(p.depth, p.undertone)}</SectionTitle>
        <div className="flex items-center gap-4 rounded-[28px] bg-oat p-5 text-cocoa">
          <span className="h-14 w-14 shrink-0 rounded-full ring-2 ring-sand" style={{ background: DEPTH_SWATCH[p.depth] }} />
          <div className="min-w-0 text-[14px] text-umber">
            <p>Skin: {p.skinType ?? "Not set"} · Barrier: {p.barrier ?? "Not set"}</p>
            <p>Hair: {p.hair ?? "Not set"} · Porosity: {p.porosity ?? "Not set"}</p>
            {p.goal && <p className="mt-1 font-display italic text-cocoa">“{p.goal}”</p>}
          </div>
        </div>
        <Link to="/consultation" className="flex h-14 items-center justify-center rounded-full bg-clay text-[15px] font-semibold text-oat">{state.consulted ? "Retake Canvas Consultation" : "Start Canvas Consultation"}</Link>
        <ListRow to="/wallet" title="Cashback Wallet" meta={`${money(w.available)} available · ${money(w.pending)} pending`} />
        <ListRow to="/canvas" title="30-Day Bare Canvas" meta={state.canvasStart ? `Day ${Math.min(30, daysSince(state.canvasStart))} of 30 · ${state.checkIns.length} check-ins` : "Track barrier, hair and bottle progress"} />
      </Page>
    </>
  );
}
