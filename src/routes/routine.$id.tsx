import { createFileRoute, notFound } from "@tanstack/react-router";
import { Bookmark, Check, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BareHeader } from "@/components/bare/kit";
import { OfferRows } from "@/components/bare/sheets";
import { productById, proById, routineById } from "@/lib/data";
import { useBare } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/routine/$id")({
  loader: ({ params }) => {
    const routine = routineById(params.id);
    if (!routine) throw notFound();
    return { routineId: routine.id };
  },
  head: ({ loaderData }) => {
    const r = loaderData ? routineById(loaderData.routineId) : undefined;
    const pro = r ? proById(r.proId) : undefined;
    const title = r && pro ? `${r.title} by ${pro.name} · Becoming Bare` : "Routine · Becoming Bare";
    const desc = r && pro ? `${pro.license}, ${pro.specialty}. Step-by-step technique and where to buy each product.` : "A licensed pro routine.";
    return { meta: [{ title }, { name: "description", content: desc }, { property: "og:title", content: title }, { property: "og:description", content: desc }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  component: RoutineDetail,
});

const toSec = (t: string) => { const [m, s] = t.split(":").map(Number); return (m ?? 0) * 60 + (s ?? 0); };

function RoutineDetail() {
  const { routineId } = Route.useLoaderData();
  const routine = routineById(routineId)!;
  const pro = proById(routine.proId)!;
  const { state, toggleRoutine, applyCode } = useBare();
  const total = toSec(routine.duration);
  const starts = routine.steps.map((s) => toSec(s.at));
  const [t, setT] = useState((starts[Math.min(1, starts.length - 1)] ?? 0) + 40);
  const [playing, setPlaying] = useState(false);
  const stepIdx = starts.reduce((acc, s, i) => (s <= t ? i : acc), 0);
  const step = routine.steps[stepIdx]!;
  const product = productById(step.productId)!;
  const saved = state.savedRoutines.includes(routine.id);
  const applied = state.appliedCodes.includes(pro.code);
  const role = pro.license.split(" ").pop();

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((x) => { if (x + 1 >= total) { setPlaying(false); return total; } return x + 1; }), 1000);
    return () => clearInterval(id);
  }, [playing, total]);

  const apply = async () => {
    try { await navigator.clipboard.writeText(pro.code); } catch { /* clipboard blocked */ }
    applyCode(pro.code);
    toast(`${pro.code} applied`, { description: `Code copied. ${Math.round(pro.discount * 100)}% off at checkout, ${Math.round(pro.cashback * 100)}% back, and ${pro.name.split(" ")[0]} earns a commission.` });
  };

  return (
    <div className="mx-auto w-full max-w-[560px] pb-[calc(var(--tabs-h)+96px)] md:pb-28">
      <BareHeader title={`${role} Routine & Where-to-Buy`} />

      <div className="mt-5 flex items-start gap-3 px-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sand font-display text-[15px] font-semibold text-cocoa">{pro.initials}</div>
        <div className="min-w-0">
          <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full bg-cocoa-soft px-3 py-1 text-[13px] font-medium text-oat"><Check className="h-3.5 w-3.5 shrink-0" />{pro.name}, {pro.license}</span>
          <p className="mt-1 font-display text-[14px] italic text-sand">{pro.specialty}</p>
        </div>
      </div>

      <div className="mx-4 mt-5 overflow-hidden rounded-[28px]">
        <div className="relative aspect-[361/414]">
          <img src={routine.media} alt={`${routine.title} tutorial`} className={cn("h-full w-full object-cover", playing && "animate-kenburns")} />
          <span className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-cocoa via-cocoa/50 to-transparent" />
          <button onClick={() => { if (t >= total) setT(0); setPlaying((p) => !p); }} className="absolute left-1/2 top-[48%] grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-oat/90 text-cocoa" aria-label={playing ? "Pause tutorial" : "Play tutorial"}>
            {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="ml-0.5 h-5 w-5 fill-current" />}
          </button>
          <div className="absolute inset-x-5 bottom-4">
            <h1 className="font-display text-[24px] leading-[1.15] text-oat">{routine.title} <em>{routine.subtitle}</em></h1>
            <div className="mt-4 flex gap-1">
              {routine.steps.map((s, i) => {
                const end = starts[i + 1] ?? total;
                const pct = Math.min(1, Math.max(0, (t - starts[i]!) / (end - starts[i]!)));
                return (
                  <button key={s.title} onClick={() => setT(starts[i]!)} className="group flex-1 text-left" style={{ flexGrow: end - starts[i]! }} aria-label={`Jump to ${s.title}`}>
                    <span className="block h-1 overflow-hidden rounded-full bg-oat/30"><span className="block h-full bg-clay" style={{ width: `${pct * 100}%` }} /></span>
                    <span className={cn("mt-2 block truncate text-[11px]", i === stepIdx ? "font-semibold text-oat" : "text-oat/75")}>{s.title}{i === routine.steps.length - 1 ? ` ${routine.duration}` : ""}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-4 rounded-[28px] bg-oat p-5 text-cocoa">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-clay">{step.technique.kicker}</p>
        <h2 className="mt-2 font-display text-[22px] leading-tight">{step.technique.titleA} <em>{step.technique.titleB}</em></h2>
        <p className="mt-2 text-[15px] leading-relaxed text-cocoa/85">{step.technique.body}</p>
      </div>

      <div className="mx-4 mt-4 rounded-[28px] border border-oat/10 bg-cocoa-soft px-5 pb-2 pt-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-[20px] text-oat">Where to buy</h2>
          <span className="truncate text-[13px] text-sand/90">{product.name}</span>
        </div>
        <OfferRows product={product} discount={applied ? pro.discount : 0} rate={applied ? pro.cashback : product.cashbackRate} {...(applied ? { code: pro.code } : {})} />
      </div>

      <div className="fixed inset-x-0 bottom-[calc(var(--tabs-h)+10px)] z-20 mx-auto flex max-w-[560px] items-center gap-3 px-3 md:bottom-4 md:pl-[calc(14rem+12px)] md:max-w-none md:justify-center">
        <button onClick={apply} className={cn("flex min-h-14 flex-1 items-center justify-center rounded-full px-5 py-2 text-center text-[14px] leading-snug text-oat shadow-lg md:max-w-[480px]", applied ? "bg-umber" : "bg-clay")}>
          {applied ? <span className="inline-flex items-center gap-1.5 font-semibold"><Check className="h-4 w-4" />Code {pro.code} applied</span> : <span><b className="font-semibold">Apply Code {pro.code}</b> ({Math.round(pro.discount * 100)}% Off + {Math.round(pro.cashback * 100)}% Cashback)</span>}
        </button>
        <button onClick={() => { const a = toggleRoutine(routine.id); toast(a ? "Routine saved" : "Routine removed"); }} aria-pressed={saved} aria-label="Save Routine" className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-oat text-cocoa shadow-lg">
          <Bookmark className={cn("h-5 w-5", saved && "fill-current")} />
        </button>
      </div>
    </div>
  );
}
