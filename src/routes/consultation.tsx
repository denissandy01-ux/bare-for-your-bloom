import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/bare/kit";
import { BARRIER, DEPTHS, HAIR_TYPES, POROSITY, SKIN_BEHAVIORS, SKIN_CONCERNS, UNDERTONES, type Depth, type Profile, type Undertone } from "@/lib/data";
import { useBare } from "@/lib/store";
import { ToneSheet } from '@/components/bare/sheets';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute("/consultation")({
  head: () => ({ meta: [{ title: "Canvas Consultation · Becoming Bare" }, { name: "description", content: "A warm, zero-judgment chat about your skin, tone and hair." }, { property: "og:title", content: "Canvas Consultation · Becoming Bare" }, { property: "og:description", content: "A warm, zero-judgment chat about your skin, tone and hair." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Consultation,
});

const STEPS: { key: keyof Profile; q: string; options?: readonly string[] }[] = [
  { key: "depth", q: "Welcome in. Let's start with your bare canvas. Which depth feels closest to your skin?", options: DEPTHS },
  { key: "undertone", q: "And the undertone underneath? Veins, jewellery, how you tan all hint at it.", options: UNDERTONES },
  { key: "skinTypes", q: "How does your skin behave, and what needs care? Choose every tag that fits.", options: [...SKIN_BEHAVIORS, ...SKIN_CONCERNS] },
  { key: "barrier", q: "When you try something new, how does your barrier react?", options: BARRIER },
  { key: "hair", q: "Tell me about your hair or beard texture.", options: HAIR_TYPES },
  { key: "porosity", q: "Does water bead on your hair or soak right in? That's porosity.", options: POROSITY },
  { key: "goal", q: "Last one: in your own words, what do you want your canvas to feel like in 30 days?" },
];

type Msg = { from: "agent" | "user"; text: string };

function Consultation() {
  const { completeConsultation, state } = useBare();
  const [i, setI] = useState(0);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "agent", text: STEPS[0]?.q ?? "Welcome in." }]);
  const [ans, setAns] = useState<Partial<Profile>>({});
  const [typing, setTyping] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [preferences,setPreferences]=useState(false);
  const end = useRef<HTMLDivElement>(null);
  const done = i >= STEPS.length;
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, typing]);

  const answer = (v: string, skip = false) => {
    if ((!v.trim() && !skip) || typing || done) return;
    const step = STEPS[i]; if (!step) return;
    const next = skip ? ans : { ...ans, [step.key]: step.key === "skinTypes" ? selected : v.trim() };
    setAns(next); setMsgs((m) => [...m, { from: "user", text: skip ? "Skip for now" : v.trim() }]); setText(""); setTyping(true);
    setTimeout(() => {
      setTyping(false);
      if (i + 1 < STEPS.length) setMsgs((m) => [...m, { from: "agent", text: STEPS[i + 1]?.q ?? "Thank you." }]);
      else { completeConsultation({ ...state.profile, ...next, depth: next.depth as Depth ?? state.profile.depth, undertone: next.undertone as Undertone ?? state.profile.undertone }); setMsgs((m) => [...m, { from: "agent", text: `Thank you. I see a ${next.depth ?? state.profile.depth} ${next.undertone ?? state.profile.undertone} canvas. Your skin and texture choices are saved. Your feed is now tuned to Skin Twins like you.` }]); }
      setI(i + 1);
    }, 700);
  };
  const step = STEPS[i] as (typeof STEPS)[number] | undefined;

  return (
    <div className="mx-auto flex h-dvh max-w-[560px] flex-col">
      <header className="flex items-center justify-between px-4 pt-3"><Wordmark /><Link to="/me" className="text-[13px] text-sand">Close</Link></header>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
        {msgs.map((m, k) => m.from === "agent"
          ? <div key={k} className="mr-auto max-w-[85%] rounded-[28px] rounded-bl-[10px] bg-oat/95 px-4 py-3 text-cocoa"><p className="text-[15px] leading-snug">{m.text}</p><p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-umber">Canvas Consultation</p></div>
          : <div key={k} className="ml-auto max-w-[80%] rounded-[28px] rounded-br-[10px] bg-clay px-4 py-3 text-[15px] leading-snug text-oat">{m.text}</div>)}
        {typing && <div className="mr-auto rounded-[28px] bg-oat/95 px-4 py-3 text-umber">…</div>}
        {!typing && !done && step?.options && <div className="flex flex-wrap gap-2 pt-1">{step.options.map(o => <Button key={o} variant="secondary" aria-pressed={step.key === 'skinTypes' ? selected.includes(o) : undefined} onClick={() => step.key === 'skinTypes' ? setSelected(old=>old.includes(o)?old.filter(t=>t!==o):[...old,o]) : answer(o)} className={step.key === 'skinTypes' && selected.includes(o) ? 'rounded-full bg-clay text-oat' : 'rounded-full bg-oat text-cocoa'}>{o}</Button>)}{step.key === 'skinTypes' && <Button disabled={!selected.length} onClick={()=>answer(selected.join(', '))} className="w-full rounded-full">Continue</Button>}</div>}
        {!typing && !done && <Button variant="ghost" onClick={()=>answer('',true)} className="text-sand">Skip for now</Button>}
        {done && !typing && <><Button variant="secondary" onClick={()=>setPreferences(true)} className="h-11 rounded-full">Formula preferences · optional</Button><Link to="/" className="flex h-14 items-center justify-center rounded-full bg-clay font-semibold text-oat">See my feed</Link></>}
        <div ref={end} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); answer(text); }} className="px-3 pb-3 pt-2">
        <div className="flex h-16 items-center gap-2 rounded-[28px] border border-sand bg-oat/95 px-2">
          <input value={text} onChange={(e) => setText(e.target.value)} disabled={done || !!step?.options} placeholder={done ? "All done" : step?.options ? "Choose an option above" : "Type your answer…"} className="min-w-0 flex-1 bg-transparent px-3 text-[15px] text-cocoa outline-none placeholder:text-umber" />
          <button type="submit" disabled={done || !text.trim()} className="grid h-11 w-11 place-items-center rounded-full bg-clay text-oat disabled:opacity-50" aria-label="Send"><ArrowRight className="h-4 w-4" /></button>
        </div>
      </form>
      <ToneSheet open={preferences} onOpenChange={setPreferences}/>
    </div>
  );
}
