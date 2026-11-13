import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bookmark, Play, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BareHeader, EmptyState, SecondaryButton } from "@/components/bare/kit";
import { FounderSheet, SwatchSheet, ToneSheet, WhereToBuySheet } from "@/components/bare/sheets";
import { DEPTH_SWATCH, FEED, bestOffer, cashbackFor, feedForTone, money, productById, skinTwinScore, type FeedPost } from "@/lib/data";
import { useBare } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Discovery Feed · Becoming Bare" },
      { name: "description", content: "Real wear tests from Skin Twins who share your tone, undertone and texture." },
      { property: "og:title", content: "Discovery Feed · Becoming Bare" },
      { property: "og:description", content: "Real wear tests from Skin Twins who share your tone, undertone and texture." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Feed,
});

function Feed() {
  const { state } = useBare();
  const [showAll, setShowAll] = useState(false);
  const [toneOpen, setToneOpen] = useState(false);
  const matched = feedForTone(FEED, state.profile);
  const posts = showAll ? [...FEED].sort((a, b) => skinTwinScore(b.creator, state.profile) - skinTwinScore(a.creator, state.profile)) : matched;
  useEffect(() => setShowAll(false), [state.profile.depth, state.profile.undertone]);

  return (
    <div className="relative mx-auto h-[calc(100dvh-var(--tabs-h))] w-full max-w-[480px] overflow-hidden md:my-0 md:h-dvh">
      <BareHeader overlay />
      {posts.length === 0 ? (
        <div className="flex h-full items-center px-6">
          <EmptyState
            title="No wear tests for your tone yet"
            body="Creators with your canvas haven't posted here yet. Browse every tone, or adjust your match."
            action={<div className="flex flex-wrap justify-center gap-2"><button onClick={() => setShowAll(true)} className="h-11 rounded-full bg-clay px-5 text-[14px] font-semibold text-oat">Show all tones</button><button onClick={() => setToneOpen(true)} className="h-11 rounded-full bg-oat px-5 text-[14px] font-medium text-cocoa">Change tone</button></div>}
          />
          <ToneSheet open={toneOpen} onOpenChange={setToneOpen} />
        </div>
      ) : (
        <div className="no-scrollbar h-full snap-y snap-mandatory overflow-y-scroll">
          {posts.map((p) => <FeedItem key={p.id} post={p} />)}
          {!showAll && matched.length < FEED.length && (
            <div className="flex h-full snap-start items-center px-6">
              <EmptyState title="You're all caught up" body="That's every wear test from your Skin Twins today. Want to see other tones too?" action={<button onClick={() => setShowAll(true)} className="h-11 rounded-full bg-clay px-5 text-[14px] font-semibold text-oat">Show all tones</button>} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FeedItem({ post }: { post: FeedPost }) {
  const product = productById(post.productId)!;
  const { state, toggleProduct } = useBare();
  const nav = useNavigate();
  const [paused, setPaused] = useState(false);
  const [buy, setBuy] = useState(false);
  const [founder, setFounder] = useState(false);
  const [swatch, setSwatch] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const offer = bestOffer(product);
  const back = cashbackFor(offer.price, product.cashbackRate);
  const score = skinTwinScore(post.creator, state.profile);
  const saved = state.savedProducts.includes(product.id);

  // Play only while on screen, like a reel.
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting), { threshold: 0.6 });
    io.observe(el); return () => io.disconnect();
  }, []);

  const share = async () => {
    const url = `${window.location.origin}/product/${product.id}`;
    try {
      if (navigator.share) await navigator.share({ title: `${product.brand} ${product.name}`, url });
      else { await navigator.clipboard.writeText(url); toast("Link copied"); }
    } catch { /* share dismissed */ }
  };

  return (
    <section ref={ref} className="relative h-full snap-start overflow-hidden bg-cocoa">
      <button onClick={() => setPaused((x) => !x)} className="absolute inset-0 block h-full w-full" aria-label={paused ? "Play wear test" : "Pause wear test"}>
        <img src={post.media} alt={`${post.creator.handle} wear test of ${product.name}`} className={cn("h-full w-full object-cover animate-kenburns", paused && "[animation-play-state:paused]")} />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cocoa/70 to-transparent" />
        <span className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cocoa/40 to-transparent" />
        {paused && <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-oat/90 text-cocoa"><Play className="ml-1 h-6 w-6 fill-current" /></span>}
      </button>

      <p className="pointer-events-none absolute left-4 top-[76px] z-10 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-oat/90">
        <span className="h-1.5 w-1.5 rounded-full bg-peach" />{post.wearTest}
      </p>

      <div className="absolute bottom-[176px] right-3 z-10 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="grid h-[58px] w-[58px] place-items-center rounded-full" style={{ background: `conic-gradient(var(--peach) ${score}%, color-mix(in oklab, var(--oat) 35%, transparent) 0)` }}>
            <div className="grid h-[44px] w-[44px] place-items-center rounded-full bg-cocoa/85 font-display text-[15px] font-semibold text-oat">{score}%</div>
          </div>
          <span className="text-[11px] text-oat/90">Skin Twin</span>
        </div>
        <button onClick={() => setSwatch(true)} className="flex flex-col items-center gap-1" aria-label="Verified swatches">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-cocoa/45 backdrop-blur">
            <span className="flex -space-x-1.5">{(["Deep", "Tan", "Medium"] as const).map((d) => <span key={d} className="h-4 w-4 rounded-full ring-1 ring-oat" style={{ background: DEPTH_SWATCH[d] }} />)}</span>
          </span>
          <span className="text-[11px] text-oat/90">{post.swatches}</span>
        </button>
        <button onClick={() => { const added = toggleProduct(product.id); toast(added ? "Saved to your shelf" : "Removed from saved"); }} className="flex flex-col items-center gap-1" aria-pressed={saved}>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-cocoa/45 text-oat backdrop-blur"><Bookmark className={cn("h-5 w-5", saved && "fill-current")} /></span>
          <span className="text-[11px] text-oat/90">Save</span>
        </button>
        <button onClick={share} className="grid h-10 w-10 place-items-center rounded-full bg-cocoa/45 text-oat backdrop-blur" aria-label="Share"><Share2 className="h-4 w-4" /></button>
      </div>

      <div className="absolute inset-x-3 bottom-3 z-10 space-y-3">
        <div className="flex items-center gap-3 rounded-[28px] bg-oat/95 p-3 pr-3">
          <button onClick={() => nav({ to: "/product/$id", params: { id: product.id } })} className="flex min-w-0 flex-1 items-center gap-3 text-left">
            <img src={product.image} alt="" className="h-14 w-14 shrink-0 rounded-[16px] object-cover" />
            <span className="min-w-0">
              <span className="block text-[11px] uppercase tracking-[0.14em] text-umber">{product.brand}</span>
              <span className="block truncate font-display text-[19px] leading-tight text-cocoa">{product.name}</span>
              <span className="block text-[13px] text-umber">{offer.retailer} · {money(offer.price)}</span>
            </span>
          </button>
          <SecondaryButton onClick={() => setFounder(true)} className="hidden min-[360px]:inline-flex">Founder Story</SecondaryButton>
        </div>
        <button onClick={() => setBuy(true)} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-clay text-[15px] font-semibold text-oat">
          Shop & Earn {Math.round(product.cashbackRate * 100)}% Cashback <span className="rounded-full bg-oat/20 px-2 py-0.5 text-[13px]">{money(back)} back</span>
        </button>
      </div>

      <WhereToBuySheet product={product} open={buy} onOpenChange={setBuy} />
      <FounderSheet product={product} open={founder} onOpenChange={setFounder} />
      <SwatchSheet product={product} count={post.swatches} open={swatch} onOpenChange={setSwatch} />
    </section>
  );
}
