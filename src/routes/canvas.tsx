import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check, ImagePlus, Trash2 } from "lucide-react";
import { BareHeader, Chip, Page, SectionTitle } from "@/components/bare/kit";
import { GOAL_AREAS, addEntry, addGoal, addReply, removeEntry, removeGoal, toggleGoal, useJourney } from "@/lib/journey";

export const Route = createFileRoute("/canvas")({
  head: () => ({ meta: [{ title: "My Beauty Journey · Becoming Bare" }, { name: "description", content: "Set personal skin and hair goals and keep a private journal you can revisit." }, { property: "og:title", content: "My Beauty Journey · Becoming Bare" }, { property: "og:description", content: "Personal skin and hair goals with an optional private journal." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Journey,
});

async function shrink(file: File): Promise<string> {
  const img = await createImageBitmap(file);
  const s = Math.min(1, 480 / Math.max(img.width, img.height));
  const c = document.createElement("canvas"); c.width = img.width * s; c.height = img.height * s;
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.7);
}
const day = (d: string) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

function Journey() {
  const [j, update] = useJourney();
  const [area, setArea] = useState<string>(GOAL_AREAS[0]);
  const [title, setTitle] = useState("");
  const [why, setWhy] = useState("");
  const [text, setText] = useState("");
  const [goalId, setGoalId] = useState<string>();
  const [photo, setPhoto] = useState<string>();
  const [feel, setFeel] = useState<number>();
  const [reply, setReply] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<string>();
  const [filter, setFilter] = useState<string>();
  const shown = j.entries.filter((e) => !filter || e.goalId === filter);
  const goalName = (id?: string) => j.goals.find((g) => g.id === id)?.title;

  return (<><BareHeader /><Page className="mt-6 space-y-6">
    <SectionTitle meta="Private to you">My Beauty Journey</SectionTitle>
    <p className="-mt-3 text-sm text-sand">No streaks, no daily check-ins. Set goals and write whenever something's worth remembering.</p>

    <section className="space-y-3">
      <h2 className="font-display text-xl">My goals</h2>
      {j.goals.map((g) => (
        <div key={g.id} className="flex items-start gap-3 rounded-[24px] bg-cocoa-soft p-4">
          <button aria-label={g.done ? "Mark not reached" : "Mark reached"} onClick={() => update((x) => toggleGoal(x, g.id))} className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border ${g.done ? "border-peach bg-peach text-cocoa" : "border-oat/40"}`}>{g.done && <Check className="h-4 w-4" />}</button>
          <button onClick={() => setFilter(filter === g.id ? undefined : g.id)} className="min-w-0 flex-1 text-left">
            <p className={`font-semibold ${g.done ? "text-sand line-through" : ""}`}>{g.title}</p>
            <p className="text-xs text-sand">{g.area} · {j.entries.filter((e) => e.goalId === g.id).length} entries{g.done ? ` · reached ${day(g.done)}` : ""}</p>
            {g.why && <p className="mt-1 text-sm text-oat/80">{g.why}</p>}
          </button>
          <button aria-label={`Remove ${g.title}`} onClick={() => update((x) => removeGoal(x, g.id))} className="text-sand"><Trash2 className="h-4 w-4" /></button>
        </div>))}
      <div className="space-y-3 rounded-[24px] bg-oat p-4 text-cocoa">
        <p className="font-semibold">Add a goal</p>
        <div className="flex flex-wrap gap-2">{GOAL_AREAS.map((a) => <Chip key={a} active={area === a} onClick={() => setArea(a)}>{a}</Chip>)}</div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Calm my cheeks before summer" className="h-11 w-full rounded-full border border-sand bg-transparent px-4 text-sm" />
        <input value={why} onChange={(e) => setWhy(e.target.value)} placeholder="Why it matters (optional)" className="h-11 w-full rounded-full border border-sand bg-transparent px-4 text-sm" />
        <button disabled={!title.trim()} onClick={() => { update((x) => addGoal(x, { title, area, why: why.trim() || undefined })); setTitle(""); setWhy(""); toast("Goal added"); }} className="h-11 w-full rounded-full bg-clay font-semibold text-oat disabled:opacity-50">Add goal</button>
      </div>
    </section>

    <section className="space-y-3">
      <h2 className="font-display text-xl">New journal entry <span className="text-sm text-sand">· optional</span></h2>
      <div className="space-y-3 rounded-[24px] bg-oat p-4 text-cocoa">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="What did you notice? What worked, what didn't?" className="min-h-24 w-full rounded-[20px] border border-sand bg-transparent p-3 text-sm" />
        {j.goals.length > 0 && <div className="flex flex-wrap gap-2"><Chip active={!goalId} onClick={() => setGoalId(undefined)}>No goal</Chip>{j.goals.filter((g) => !g.done).map((g) => <Chip key={g.id} active={goalId === g.id} onClick={() => setGoalId(g.id)}>{g.title}</Chip>)}</div>}
        <div className="flex flex-wrap items-center gap-2 text-sm"><span className="text-umber">How do you feel about it?</span>{[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => setFeel(feel === n ? undefined : n)} className={`h-8 w-8 rounded-full border ${feel === n ? "border-clay bg-clay text-oat" : "border-sand"}`}>{n}</button>)}</div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-umber"><ImagePlus className="h-4 w-4" />{photo ? "Photo added" : "Add a photo"}<input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setPhoto(await shrink(f)); }} /></label>
        {photo && <img src={photo} alt="" className="h-24 rounded-xl object-cover" />}
        <button disabled={!text.trim() && !photo} onClick={() => { update((x) => addEntry(x, { text, goalId, photo, feel })); setText(""); setPhoto(undefined); setFeel(undefined); toast("Saved to your journal"); }} className="h-11 w-full rounded-full bg-clay font-semibold text-oat disabled:opacity-50">Save entry</button>
      </div>
    </section>

    <section className="space-y-3">
      <h2 className="font-display text-xl">Journal{filter ? ` · ${goalName(filter)}` : ""}</h2>
      {filter && <button onClick={() => setFilter(undefined)} className="text-sm text-peach">Show all entries</button>}
      {shown.length === 0 && <p className="text-sm text-sand">Nothing here yet. Your entries will appear here so you can look back and add to them.</p>}
      {shown.map((e) => (
        <article key={e.id} className="space-y-2 rounded-[24px] border border-oat/15 p-4">
          <div className="flex items-center gap-2 text-xs text-sand"><span>{day(e.date)}</span>{goalName(e.goalId) && <span>· {goalName(e.goalId)}</span>}{e.feel && <span>· feeling {e.feel}/5</span>}<button aria-label="Delete entry" onClick={() => update((x) => removeEntry(x, e.id))} className="ml-auto"><Trash2 className="h-4 w-4" /></button></div>
          {e.photo && <img src={e.photo} alt="" className="max-h-64 rounded-2xl object-cover" />}
          {e.text && <p className="whitespace-pre-wrap text-sm">{e.text}</p>}
          {e.replies.map((r, i) => <div key={i} className="border-l-2 border-peach/60 pl-3 text-sm"><p className="text-xs text-sand">Added {day(r.date)}</p><p className="whitespace-pre-wrap">{r.text}</p></div>)}
          {open === e.id ? <div className="flex gap-2"><input autoFocus value={reply[e.id] ?? ""} onChange={(ev) => setReply({ ...reply, [e.id]: ev.target.value })} placeholder="Looking back…" className="h-10 min-w-0 flex-1 rounded-full border border-oat/30 bg-transparent px-4 text-sm" /><button onClick={() => { update((x) => addReply(x, e.id, reply[e.id] ?? "")); setReply({ ...reply, [e.id]: "" }); setOpen(undefined); }} className="rounded-full bg-clay px-4 text-sm font-semibold text-oat">Add</button></div>
            : <button onClick={() => setOpen(e.id)} className="text-sm text-peach">+ Add to this entry</button>}
        </article>))}
    </section>
  </Page></>);
}
