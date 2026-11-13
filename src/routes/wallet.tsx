import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { BareHeader, EmptyState, Page, SectionTitle } from "@/components/bare/kit";
import { PAYOUT_MIN, money } from "@/lib/data";
import { useBare, walletTotals } from "@/lib/store";

export const Route = createFileRoute("/wallet")({
  head: () => ({ meta: [{ title: "Cashback Wallet · Becoming Bare" }, { name: "description", content: "Cashback from purchases and verified 30-day reviews." }, { property: "og:title", content: "Cashback Wallet · Becoming Bare" }, { property: "og:description", content: "Cashback from purchases and verified 30-day reviews." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Wallet,
});

function Wallet() {
  const { state, requestPayout } = useBare();
  const w = walletTotals(state.wallet);
  const can = w.available >= PAYOUT_MIN;
  return (
    <>
      <BareHeader />
      <Page className="mt-6 space-y-5">
        <SectionTitle meta="Cashback wallet">{money(w.available)} available</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[28px] bg-oat p-4 text-cocoa"><p className="text-[11px] uppercase tracking-[0.14em] text-umber">Pending</p><p className="font-display text-[24px]">{money(w.pending)}</p></div>
          <div className="rounded-[28px] bg-oat p-4 text-cocoa"><p className="text-[11px] uppercase tracking-[0.14em] text-umber">Requested</p><p className="font-display text-[24px]">{money(w.requested)}</p></div>
        </div>
        <button disabled={!can} onClick={() => { requestPayout(); toast("Payout requested"); }} className="h-14 w-full rounded-full bg-clay text-[15px] font-semibold text-oat disabled:opacity-50">{can ? "Withdraw available cashback" : `Withdraw at ${money(PAYOUT_MIN)} available`}</button>
        {state.wallet.length === 0 ? (
          <EmptyState title="No cashback yet" body="Shop from the feed or a pro routine, or finish a 30-day review, and it shows up here." />
        ) : (
          <ul className="space-y-2">{state.wallet.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-3 rounded-[28px] bg-cocoa-soft p-4">
              <span className="min-w-0"><span className="block truncate text-[14px] text-oat">{t.label}</span><span className="text-[12px] capitalize text-sand/80">{t.status} · {new Date(t.date).toLocaleDateString()}</span></span>
              <span className="font-semibold tabular-nums text-oat">{t.amount < 0 ? "-" : "+"}{money(Math.abs(t.amount))}</span>
            </li>))}</ul>
        )}
      </Page>
    </>
  );
}
