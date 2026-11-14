import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { BareHeader, EmptyState, Page, SectionTitle } from "@/components/bare/kit";
import { BOOKING_POINTS, POINTS_PER_DOLLAR, REDEEM_POINTS, REDEEM_VALUE, REVIEW_POINTS, pts, rewardsUnlocked } from "@/lib/data";
import { useBare, walletTotals } from "@/lib/store";

const desc = "Earn Bare Points for verified reviews, purchases and bookings. 500 points = $5 off.";
export const Route = createFileRoute("/wallet")({
  head: () => ({ meta: [{ title: "Bare Points · Becoming Bare" }, { name: "description", content: desc }, { property: "og:title", content: "Bare Points · Becoming Bare" }, { property: "og:description", content: desc }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Wallet,
});

function Wallet() {
  const { state, requestPayout } = useBare();
  const w = walletTotals(state.wallet);
  const spent = -state.wallet.filter(t => t.amount < 0).reduce((a, t) => a + t.amount, 0);
  const balance = Math.max(0, w.available - spent);
  const unlocked = rewardsUnlocked(balance);
  const toNext = REDEEM_POINTS - (balance % REDEEM_POINTS);
  return (
    <>
      <BareHeader />
      <Page className="mt-6 space-y-5">
        <SectionTitle meta="Bare Points">{pts(balance)}</SectionTitle>
        <div className="rounded-[28px] bg-oat p-4 text-cocoa">
          <p className="text-sm">{unlocked > 0 ? `$${unlocked * REDEEM_VALUE} off ready to use` : `${toNext} pts to your next $${REDEEM_VALUE} off`}</p>
          <div className="mt-2 h-2 rounded-full bg-sand"><div className="h-2 rounded-full bg-clay" style={{ width: `${unlocked > 0 ? 100 : ((balance % REDEEM_POINTS) / REDEEM_POINTS) * 100}%` }} /></div>
          <p className="mt-2 text-xs text-umber">{pts(w.pending)} pending until stores confirm</p>
        </div>
        <button disabled={unlocked === 0} onClick={() => { requestPayout(); toast(`$${unlocked * REDEEM_VALUE} reward ready`, { description: "Use it on your next product or appointment." }); }} className="h-14 w-full rounded-full bg-clay text-[15px] font-semibold text-oat disabled:opacity-50">{unlocked > 0 ? `Redeem $${unlocked * REDEEM_VALUE} off` : `Redeem at ${REDEEM_POINTS} pts`}</button>
        <ul className="grid grid-cols-3 gap-2 text-center text-xs text-sand">
          <li className="rounded-[20px] bg-cocoa-soft p-3"><b className="block font-display text-lg text-oat">+{REVIEW_POINTS}</b>verified review</li>
          <li className="rounded-[20px] bg-cocoa-soft p-3"><b className="block font-display text-lg text-oat">+{POINTS_PER_DOLLAR}</b>per $1 spent</li>
          <li className="rounded-[20px] bg-cocoa-soft p-3"><b className="block font-display text-lg text-oat">+{BOOKING_POINTS}</b>per booking</li>
        </ul>
        {state.wallet.length === 0 ? (
          <EmptyState title="No points yet" body="Shop from the feed, book a specialist, or finish a 30-day review to start earning." />
        ) : (
          <ul className="space-y-2">{state.wallet.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-3 rounded-[28px] bg-cocoa-soft p-4">
              <span className="min-w-0"><span className="block truncate text-[14px] text-oat">{t.label}</span><span className="text-[12px] capitalize text-sand/80">{t.kind === "payout" ? "redeemed" : t.status} · {new Date(t.date).toLocaleDateString()}</span></span>
              <span className="font-semibold tabular-nums text-oat">{t.amount < 0 ? "-" : "+"}{Math.round(Math.abs(t.amount))}</span>
            </li>))}</ul>
        )}
        <p className="text-center text-xs text-sand/70">Sample rewards program. Points aren't connected to real stores yet.</p>
      </Page>
    </>
  );
}
