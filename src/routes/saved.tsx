import { Link, createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Play, ImageOff } from "lucide-react";
import { BareHeader, Page } from "@/components/bare/kit";
import { FEED, productById, routineById } from "@/lib/data";
import { specialistById } from "@/lib/specialists";
import { useBare } from "@/lib/store";
import { communityOptions } from "@/lib/community-query";
import { cn } from "@/lib/utils";

const desc = "All your saved beauty media, products, specialists and routines in one place.";
export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Your Saves · Becoming Bare" }, { name: "description", content: desc }, { property: "og:title", content: "Your Saves · Becoming Bare" }, { property: "og:description", content: desc }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Saved,
});

const TABS = ["Media", "Products", "Specialists", "Routines"] as const;
type Tab = (typeof TABS)[number];

function Tile({ link, image, video, label, onRemove }: { link: ReactNode; image?: string; video?: boolean; label: string; onRemove: () => void }) {
  return <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-cocoa-soft">
    {link}
    {image ? null : <ImageOff className="pointer-events-none absolute inset-0 m-auto h-6 w-6 text-sand" />}
    {video && <Play className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 fill-oat text-oat drop-shadow" />}
    <button type="button" aria-label={`Remove ${label} from Saved`} onClick={onRemove} className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-oat/90 text-cocoa"><Heart className="h-3.5 w-3.5 fill-cocoa" /></button>
  </div>;
}
const img = (src?: string) => src ? <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" /> : null;
const cover = "block h-full w-full";

function Saved() {
  const { state, togglePost, toggleProduct, toggleSpecialist, toggleRoutine } = useBare();
  const [tab, setTab] = useState<Tab>("Media");
  const posts = useQuery(communityOptions);
  const newest = (ids: string[]) => [...new Set(ids)];

  let tiles: ReactNode[] = [];
  if (tab === "Media") tiles = newest(state.savedPosts).flatMap(id => {
    const f = FEED.find(p => p.id === id);
    if (f) return [<Tile key={id} label={f.caption} image={f.media} onRemove={() => togglePost(id)} link={<Link to="/" search={{ post: id }} className={cover} aria-label={`Open post by ${f.creator.handle}`}>{img(f.media)}</Link>} />];
    const c = posts.data?.find(p => p.id === id);
    if (!c) return [];
    const isVideo = c.media_type === "video";
    return [<Tile key={id} label={c.caption ?? "post"} image={c.url} video={isVideo} onRemove={() => togglePost(id)} link={<Link to="/" search={{ post: id }} className={cover} aria-label={`Open post by ${c.author}`}>{isVideo ? <video src={c.url} muted playsInline preload="metadata" className="h-full w-full object-cover" /> : img(c.url)}</Link>} />];
  });
  if (tab === "Products") tiles = newest(state.savedProducts).flatMap(id => { const p = productById(id); return p ? [<Tile key={id} label={p.name} image={p.image} onRemove={() => toggleProduct(id)} link={<Link to="/product/$id" params={{ id }} className={cover} aria-label={`Open ${p.name}`}>{img(p.image)}</Link>} />] : []; });
  if (tab === "Specialists") tiles = newest(state.savedSpecialists).flatMap(id => { const s = specialistById(id); return s ? [<Tile key={id} label={s.studio} image={s.image} onRemove={() => toggleSpecialist(id)} link={<Link to="/specialist/$id" params={{ id }} className={cover} aria-label={`Open ${s.studio}`}>{img(s.image)}</Link>} />] : []; });
  if (tab === "Routines") tiles = newest(state.savedRoutines).flatMap(id => { const r = routineById(id); return r ? [<Tile key={id} label={r.title} image={r.media} video onRemove={() => toggleRoutine(id)} link={<Link to="/routine/$id" params={{ id }} className={cover} aria-label={`Open ${r.title}`}>{img(r.media)}</Link>} />] : []; });

  const empty: Record<Tab, [string, string, "/" | "/discover"]> = {
    Media: ["No saved media yet", "Save posts from For You or Explore to find them here.", "/"],
    Products: ["No saved products yet", "Bookmark products in Discover to revisit them later.", "/discover"],
    Specialists: ["No saved specialists yet", "Save studios and pros from Discover or Global Atlas.", "/discover"],
    Routines: ["No saved routines yet", "Save step-by-step guides from the Learn feed.", "/"],
  };
  const [title, body, to] = empty[tab];

  return <>
    <BareHeader />
    <div className="bg-cocoa px-4 pb-5 pt-6 md:mx-auto md:max-w-3xl">
      <h1 className="font-display text-4xl">Your Saves</h1>
      <p className="mt-1 text-sm text-sand">All your beauty finds, in one place.</p>
      <div role="tablist" aria-label="Saved categories" className="no-scrollbar mt-5 flex gap-2 overflow-x-auto">
        {TABS.map(t => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("h-10 shrink-0 rounded-full border px-4 text-sm transition-colors", tab === t ? "border-oat bg-oat font-semibold text-cocoa" : "border-oat/30 text-oat")}>{t}</button>)}
      </div>
    </div>
    <Page className="space-y-4 rounded-t-[28px] bg-oat pt-5 text-cocoa">
      <div className="flex items-baseline justify-between"><h2 className="font-display text-2xl">{tab}</h2><span className="text-xs text-umber">Newest first</span></div>
      {tiles.length ? <div className="grid grid-cols-3 gap-1.5">{tiles}</div> : <div className="py-10 text-center"><p className="font-display text-xl">{title}</p><p className="mt-2 text-sm text-umber">{body}</p><Link to={to} className="mt-4 inline-flex h-11 items-center rounded-full bg-clay px-5 text-sm font-semibold text-oat">{to === "/" ? "Browse the feed" : "Go to Discover"}</Link></div>}
      {tab === "Products" && tiles.length > 0 && <p className="text-[11px] text-umber">Saving is a bookmark, not a purchase — it won't add anything to your shelf.</p>}
    </Page>
  </>;
}
