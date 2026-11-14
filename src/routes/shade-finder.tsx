import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { BareHeader, Page, SectionTitle } from "@/components/bare/kit";
import { DEPTHS, UNDERTONE_SWATCH, toneLabel } from "@/lib/data";
import { nearestTone } from "@/lib/shade-photo";
import { useBare } from "@/lib/store";

export const Route = createFileRoute("/shade-finder")({
  head: () => ({ meta: [{ title: "Photo Shade Finder · Becoming Bare" }, { name: "description", content: "Place a dropper on your own photo to find your depth and undertone." }, { property: "og:title", content: "Photo Shade Finder · Becoming Bare" }, { property: "og:description", content: "Find your depth and undertone from a photo, privately on your device." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: ShadeFinder,
});

function ShadeFinder() {
  const { setTone } = useBare();
  const [src, setSrc] = useState<string>();
  const [pt, setPt] = useState({ x: 50, y: 50 });
  const [sample, setSample] = useState<string>();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [match, setMatch] = useState<ReturnType<typeof nearestTone>>();

  function load(file?: File) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const c = canvas.current!; const s = Math.min(1, 900 / Math.max(img.width, img.height));
      c.width = img.width * s; c.height = img.height * s;
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      setSrc(url); pick(50, 50);
    };
    img.src = url;
  }
  function pick(x: number, y: number) {
    setPt({ x, y });
    const c = canvas.current; if (!c || !c.width) return;
    const cx = Math.round((x / 100) * c.width), cy = Math.round((y / 100) * c.height), r = Math.max(3, Math.round(c.width / 80));
    const d = c.getContext("2d")!.getImageData(Math.max(0, cx - r), Math.max(0, cy - r), r * 2, r * 2).data;
    let R = 0, G = 0, B = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) { R += d[i]!; G += d[i + 1]!; B += d[i + 2]!; n++; }
    R /= n; G /= n; B /= n;
    setSample(`rgb(${R | 0},${G | 0},${B | 0})`); setMatch(nearestTone(R, G, B));
  }
  function onPoint(e: React.PointerEvent<HTMLDivElement>) {
    if (e.type === "pointermove" && e.buttons === 0) return;
    const b = e.currentTarget.getBoundingClientRect();
    pick(Math.min(100, Math.max(0, ((e.clientX - b.left) / b.width) * 100)), Math.min(100, Math.max(0, ((e.clientY - b.top) / b.height) * 100)));
  }

  return (<><BareHeader /><Page className="mt-6 max-w-2xl space-y-5">
    <SectionTitle meta="Photo shade finder">Drag the dropper onto your skin.</SectionTitle>
    <p className="text-[13px] text-sand">Use a photo in daylight with no filter. Place the circle on your jaw or chest, not on shadows or shine. Your photo stays on this device.</p>
    <label className="inline-flex h-12 cursor-pointer items-center rounded-full bg-clay px-6 text-[14px] font-semibold text-oat">{src ? "Choose another photo" : "Upload a photo"}<input type="file" accept="image/*" className="sr-only" onChange={(e) => load(e.target.files?.[0])} /></label>
    <canvas ref={canvas} className="hidden" />
    {src && <div className="relative touch-none select-none overflow-hidden rounded-[28px]" onPointerDown={onPoint} onPointerMove={onPoint}>
      <img src={src} alt="Your photo" className="block w-full" draggable={false} />
      <span aria-hidden className="pointer-events-none absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-oat shadow-lg" style={{ left: `${pt.x}%`, top: `${pt.y}%`, background: sample }} />
    </div>}
    {match && <section className="space-y-4 rounded-[28px] bg-oat p-5 text-cocoa">
      <div className="flex items-center gap-4"><span className="h-14 w-14 rounded-full border border-umber/20" style={{ background: sample }} /><span className="text-xl">→</span><span className="h-14 w-14 rounded-full" style={{ background: UNDERTONE_SWATCH[match.depth][match.undertone] }} />
        <div><p className="font-display text-xl">{toneLabel(match.depth, match.undertone)}</p><p className="text-xs text-umber">Closest match · lighting can shift results</p></div></div>
      <div className="relative h-4 rounded-full" style={{ background: `linear-gradient(90deg, ${DEPTHS.map((d) => UNDERTONE_SWATCH[d][match.undertone]).join(",")})` }}>
        <span className="absolute -top-1 h-6 w-1.5 -translate-x-1/2 rounded-full bg-cocoa" style={{ left: `${(DEPTHS.indexOf(match.depth) / (DEPTHS.length - 1)) * 100}%` }} />
      </div>
      <div className="flex justify-between text-[11px] text-umber">{DEPTHS.map((d) => <span key={d}>{d}</span>)}</div>
      <button onClick={() => { setTone(match.depth, match.undertone); toast.success("Your canvas tone was updated"); }} className="h-12 w-full rounded-full bg-clay text-[14px] font-semibold text-oat">Use this for my canvas</button>
    </section>}
    <Link to="/discover" className="text-sm text-peach">Back to Discover →</Link>
  </Page></>);
}
