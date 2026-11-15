import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Trash2 } from "lucide-react";
import { BareHeader, Chip, Page, SectionTitle } from "@/components/bare/kit";
import { JourneyCalendar } from "@/components/bare/journey-calendar";
import { GOAL_AREAS, editEntry, addEntry, addGoal, addReply, removeEntry, removeGoal, toggleGoal, useJourney } from "@/lib/journey";

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
  const [topic, setTopic] = useState("");
  const [editing, setEditing] = useState<string>();
  const [view, setView] = useState<"Journal" | "Calendar">("Journal");
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

    <div role="tablist" className="grid grid-cols-2 gap-1 rounded-full bg-oat/10 p-1">{(["Journal", "Calendar"] as const).map((t) => <button key={t} role="tab" aria-selected={view === t} onClick={() => setView(t)} className={`h-10 rounded-full text-sm ${view === t ? "bg-clay font-semibold text-oat" : ""}`}>{t}</button>)}</div>
    {view === "Calendar" ? <JourneyCalendar /> : <>
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
      <h2 className="font-display text-xl">{editing ? "Edit journal entry" : "New journal entry"}</h2>
      <div className="space-y-3 rounded-[24px] bg-oat p-4 text-cocoa">
        <label className="block text-sm font-semibold">Topic<input value={topic} maxLength={120} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Week 3 of my scalp routine" className="mt-1 h-11 w-full rounded-full border border-sand bg-transparent px-4 text-sm font-normal" /></label>
        <div className="text-sm font-semibold">My Goal{j.goals.length ? <div className="mt-1 flex flex-wrap gap-2 font-normal"><Chip active={!goalId} onClick={() => setGoalId(undefined)}>No goal</Chip>{j.goals.filter((g) => !g.done || g.id === goalId).map((g) => <Chip key={g.id} active={goalId === g.id} onClick={() => setGoalId(g.id)}>{g.title}</Chip>)}</div> : <p className="font-normal text-umber">Add a goal above to link entries to it.</p>}</div>
        <label className="block text-sm font-semibold">Journal Entry<textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Your progress, what you noticed, how you feel…" className="mt-1 min-h-32 w-full rounded-[20px] border border-sand bg-transparent p-3 text-sm font-normal" /></label>
        <div className="flex gap-2">{editing && <button onClick={() => { setEditing(undefined); setText(""); setTopic(""); setGoalId(undefined); }} className="h-11 flex-1 rounded-full border border-sand font-semibold">Cancel</button>}<button disabled={!text.trim()} onClick={() => { update((x) => editing ? editEntry(x, editing, { text, topic: topic.trim() || undefined, goalId }) : addEntry(x, { text, topic: topic.trim() || undefined, goalId, photo: undefined, feel: undefined })); setText(""); setTopic(""); setGoalId(undefined); setEditing(undefined); toast(editing ? "Entry updated" : "Saved privately to your journal"); }} className="h-11 flex-1 rounded-full bg-clay font-semibold text-oat disabled:opacity-50">{editing ? "Save changes" : "Save privately"}</button></div>
      </div>
    </section>

    <section className="space-y-3">
      <h2 className="font-display text-xl">Journal{filter ? ` · ${goalName(filter)}` : ""}</h2>
      {filter && <button onClick={() => setFilter(undefined)} className="text-sm text-peach">Show all entries</button>}
      {shown.length === 0 && <p className="text-sm text-sand">Nothing here yet. Your entries will appear here so you can look back and add to them.</p>}
      {shown.map((e) => (
        <article key={e.id} className="space-y-2 rounded-[24px] border border-oat/15 p-4">
          <div className="flex items-center gap-2 text-xs text-sand"><span>{day(e.date)}</span>{goalName(e.goalId) && <span>· {goalName(e.goalId)}</span>}{e.feel && <span>· feeling {e.feel}/5</span>}<button aria-label="Edit entry" onClick={() => { setEditing(e.id); setText(e.text); setTopic(e.topic ?? ""); setGoalId(e.goalId); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="ml-auto text-peach">Edit</button><button aria-label="Delete entry" onClick={() => update((x) => removeEntry(x, e.id))} ><Trash2 className="h-4 w-4" /></button></div>
          {e.topic && <h3 className="font-display text-lg">{e.topic}</h3>}{e.photo && <img src={e.photo} alt="" className="max-h-64 rounded-2xl object-cover" />}
          {e.text && <p className="whitespace-pre-wrap text-sm">{e.text}</p>}
          {e.replies.map((r, i) => <div key={i} className="border-l-2 border-peach/60 pl-3 text-sm"><p className="text-xs text-sand">Added {day(r.date)}</p><p className="whitespace-pre-wrap">{r.text}</p></div>)}
          {open === e.id ? <div className="flex gap-2"><input autoFocus value={reply[e.id] ?? ""} onChange={(ev) => setReply({ ...reply, [e.id]: ev.target.value })} placeholder="Looking back…" className="h-10 min-w-0 flex-1 rounded-full border border-oat/30 bg-transparent px-4 text-sm" /><button onClick={() => { update((x) => addReply(x, e.id, reply[e.id] ?? "")); setReply({ ...reply, [e.id]: "" }); setOpen(undefined); }} className="rounded-full bg-clay px-4 text-sm font-semibold text-oat">Add</button></div>
            : <button onClick={() => setOpen(e.id)} className="text-sm text-peach">+ Add to this entry</button>}
        </article>))}
    </section>
    </>}
  </Page></>);
}
