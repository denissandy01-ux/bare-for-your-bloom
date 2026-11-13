import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { BareHeader, Chip, Page, SectionTitle } from "@/components/bare/kit";
import { CANVAS_DAYS, PRODUCTS, REVIEW_REWARD, money, productById } from "@/lib/data";
import { daysSince, useBare } from "@/lib/store";

export const Route = createFileRoute("/canvas")({
  head: () => ({ meta: [{ title: "30-Day Bare Canvas · Becoming Bare" }, { name: "description", content: "Photo check-ins for barrier healing, hair growth and bottle lifespan." }, { property: "og:title", content: "30-Day Bare Canvas · Becoming Bare" }, { property: "og:description", content: "Photo check-ins for barrier healing, hair growth and bottle lifespan." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Canvas,
});

async function shrink(file: File): Promise<string> {
  const img = await createImageBitmap(file);
  const s = Math.min(1, 480 / Math.max(img.width, img.height));
  const c = document.createElement("canvas"); c.width = img.width * s; c.height = img.height * s;
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.7);
}

function Canvas() {
  const { state, startCanvas, addCheckIn, addReview } = useBare();
  const [pick, setPick] = useState<string[]>(state.savedProducts.slice(0, 3));
  const [photo, setPhoto] = useState<string>();
  const [barrier, setBarrier] = useState(3);
  const [note, setNote] = useState("");
  const [left, setLeft] = useState<Record<string, number>>({});
  const [review, setReview] = useState<Record<string, string>>({});

  if (!state.canvasStart) {
    return (<><BareHeader /><Page className="mt-6 space-y-4">
      <SectionTitle meta="30-Day Bare Canvas">Which bottles are you tracking?</SectionTitle>
      <div className="flex flex-wrap gap-2">{PRODUCTS.map((p) => <Chip key={p.id} active={pick.includes(p.id)} onClick={() => setPick((x) => x.includes(p.id) ? x.filter((y) => y !== p.id) : [...x, p.id])}>{p.name}</Chip>)}</div>
      <button disabled={!pick.length} onClick={() => startCanvas(pick)} className="h-14 w-full rounded-full bg-clay text-[15px] font-semibold text-oat disabled:opacity-50">Start day 1</button>
    </Page></>);
  }
  const day = Math.min(CANVAS_DAYS, daysSince(state.canvasStart));
  const photos = state.checkIns.filter((c) => c.photo);
  const unlocked = day >= CANVAS_DAYS && state.checkIns.length >= 2;
  return (<><BareHeader /><Page className="mt-6 space-y-5">
    <SectionTitle meta="30-Day Bare Canvas">Day {day} of {CANVAS_DAYS}</SectionTitle>
    <div className="h-2 overflow-hidden rounded-full bg-cocoa-soft"><div className="h-full bg-clay" style={{ width: `${(day / CANVAS_DAYS) * 100}%` }} /></div>
    {photos.length > 0 && <div className="grid grid-cols-2 gap-3">{[photos[0]!, photos[photos.length - 1]!].map((c, i) => <figure key={i}><img src={c.photo} alt="" className="aspect-[3/4] w-full rounded-[28px] object-cover" /><figcaption className="mt-1 text-center text-[12px] text-sand">{i ? "Latest" : "Before"} · {new Date(c.date).toLocaleDateString()}</figcaption></figure>)}</div>}
    <div className="space-y-3 rounded-[28px] bg-oat p-5 text-cocoa">
      <p className="font-display text-[20px]">Today's check-in</p>
      <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setPhoto(await shrink(f)); }} className="text-[13px]" />
      <p className="text-[12px] uppercase tracking-[0.14em] text-umber">How calm does your skin or scalp feel? ({barrier}/5)</p>
      <input type="range" min={1} max={5} value={barrier} onChange={(e) => setBarrier(+e.target.value)} className="w-full accent-clay" />
      {state.trackedBottles.map((id) => <label key={id} className="block text-[13px]">{productById(id)?.name}: {left[id] ?? 100}% left<input type="range" min={0} max={100} value={left[id] ?? 100} onChange={(e) => setLeft({ ...left, [id]: +e.target.value })} className="w-full accent-clay" /></label>)}
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything you noticed?" className="w-full rounded-[20px] border border-sand bg-transparent p-3 text-[14px]" />
      <button onClick={() => { addCheckIn({ ...(photo ? { photo } : {}), barrier, note, bottles: left }); setPhoto(undefined); setNote(""); toast("Check-in saved"); }} className="h-12 w-full rounded-full bg-clay font-semibold text-oat">Save check-in</button>
    </div>
    <SectionTitle meta={`Review-to-earn · ${money(REVIEW_REWARD)} each`}>{unlocked ? "Your reviews are unlocked" : `Reviews unlock on day ${CANVAS_DAYS}`}</SectionTitle>
    {state.trackedBottles.map((id) => { const done = state.reviews.some((r) => r.productId === id); return (
      <div key={id} className="rounded-[28px] bg-cocoa-soft p-4"><p className="text-oat">{productById(id)?.name}</p>
        {done ? <p className="text-[13px] text-sand">Reviewed · {money(REVIEW_REWARD)} earned</p> : unlocked ? <><textarea value={review[id] ?? ""} onChange={(e) => setReview({ ...review, [id]: e.target.value })} className="mt-2 w-full rounded-[20px] bg-oat p-3 text-[14px] text-cocoa" placeholder="30 days in, how did it do?" /><button disabled={(review[id] ?? "").trim().length < 20} onClick={() => addReview({ productId: id, rating: 5, text: review[id] ?? "" }, REVIEW_REWARD)} className="mt-2 h-11 rounded-full bg-clay px-5 text-[14px] font-semibold text-oat disabled:opacity-50">Submit & earn</button></> : <p className="text-[13px] text-sand/80">Keep checking in. {state.checkIns.length} so far.</p>}
      </div>); })}
  </Page></>);
}
