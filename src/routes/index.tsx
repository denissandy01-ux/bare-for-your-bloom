import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, BookOpen, Bookmark, FlaskConical, Heart, Play, Share2, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BareHeader, EmptyState, SecondaryButton } from "@/components/bare/kit";
import { FounderSheet, SwatchSheet, ToneSheet, WhereToBuySheet } from "@/components/bare/sheets";
import { DEPTH_SWATCH, FEED, whereSold, bestOffer, cashbackFor, pointsFor, feedForTone, money, productById, skinTwinScore, fitScore, matchKind, MATCH_LABEL, type FeedPost } from "@/lib/data";
import { useBare } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SERVICE_FEED, mixFeed } from '@/lib/service-feed';
import { ServiceFeedItem } from '@/components/bare/service-feed-item';
import { FormulaSheet } from '@/components/bare/formula';
import { brandForProduct } from '@/lib/atlas';
import { Button } from '@/components/ui/button';
import { FitSheet } from '@/components/bare/fit-sheet';
import { useQuery } from '@tanstack/react-query';
import { communityOptions } from '@/lib/community-query';
import { CommunityFeedItem } from '@/components/bare/community-feed';
import { FEED_TABS, tabPosts } from '@/lib/feed-tabs';
import { z } from 'zod';
import { handleFor, specialistById } from '@/lib/specialists';

export const Route = createFileRoute("/")({
  validateSearch: z.object({post: z.string().optional()}),
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
  const [tab,setTab]=useState<(typeof FEED_TABS)[number]>('For You');
  const community=useQuery(communityOptions);
  const search=Route.useSearch();
  const matched = feedForTone(FEED, state.profile);
  const base = showAll ? [...FEED].sort((a, b) => skinTwinScore(b.creator, state.profile) - skinTwinScore(a.creator, state.profile)) : matched;
  const posts = search.post ? FEED.filter(p=>p.id===search.post) : tabPosts(tab==='For You'?base:FEED,tab,state.followedBrands,state.followedCreators,state.shoppingCountry);
  const shared=community.data?.filter(p=>search.post ? p.id===search.post : tab==='Following' ? state.followedCreators.includes(p.owner_id)||(!!p.brand_id&&state.followedBrands.includes(p.brand_id)) : tab==='Global' ? p.country_id!==state.shoppingCountry : tab==='Tips' ? p.kind==='Tutorial' : true)??[];
  const services=search.post?SERVICE_FEED.filter(p=>p.id===search.post):tab==='For You'?SERVICE_FEED:tab==='Following'?SERVICE_FEED.filter(p=>{const s=specialistById(p.specialistId);return s&&state.followedCreators.includes(handleFor(s));}):[];
  useEffect(() => setShowAll(false), [state.profile.depth, state.profile.undertone]);

  return (
    <div className="bare-feed relative mx-auto h-[calc(100dvh-var(--tabs-h))] w-full max-w-[480px] overflow-hidden md:my-0 md:h-dvh">
      <header className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-cocoa/80 to-transparent px-4 pt-4 pb-3"><div className="flex items-center justify-between gap-3"><Link to="/" className="font-display text-[24px] leading-tight text-oat">Becoming Bare</Link><Link to="/notifications" aria-label="Notifications" className="grid h-10 w-10 place-items-center rounded-full bg-cocoa/45 text-oat"><Bell className="h-5 w-5"/></Link></div><div role="tablist" aria-label="Feed categories" className="mt-3 grid grid-cols-4 gap-1">{FEED_TABS.map(t=><Button role="tab" aria-selected={tab===t} key={t} size="sm" variant={tab===t?'secondary':'ghost'} className={cn('rounded-full px-1 text-xs',tab!==t&&'text-oat hover:bg-oat/15 hover:text-oat')} onClick={()=>setTab(t)}>{t}</Button>)}</div></header>
      {posts.length === 0 && shared.length===0 && services.length===0 ? (
        <div className="flex h-full items-center px-6">
          <EmptyState
            title={tab==='Following'?'Your people, your feed':tab==='Tips'?'Fresh tips are on the way':tab==='Global'?'More global stories to come':'No wear tests for your tone yet'}
            body={tab==='Following'?'Follow a creator or brand to keep their stories here.':tab==='Tips'?'Share a tutorial or explore ingredient education.':'Browse more discoveries or adjust your canvas.'}
            action={tab==='Tips'?<Button asChild><Link to="/create">Share a tutorial</Link></Button>:tab==='Following'?<Button asChild><Link to="/discover">Discover brands</Link></Button>:<div className="flex flex-wrap justify-center gap-2"><Button onClick={() => {setShowAll(true);setTab('For You');}}>Show all tones</Button><Button variant="secondary" onClick={() => setToneOpen(true)}>Change tone</Button></div>}
          />
          <ToneSheet open={toneOpen} onOpenChange={setToneOpen} />
        </div>
      ) : (
        <div className="no-scrollbar h-full snap-y snap-mandatory overflow-y-scroll">
          {shared.map(p=><CommunityFeedItem key={p.id} post={p}/>)}
          {mixFeed(posts, services).map(item => item.kind === 'product' ? <FeedItem key={item.post.id} post={item.post} /> : <ServiceFeedItem key={item.post.id} post={item.post} />)}
          {tab==='For You'&&!search.post&&!showAll && matched.length < FEED.length && (
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
  const product = productById(post.productId);
  const { state, toggleProduct, toggleLike, toggleCreator, togglePost } = useBare();
  const liked = state.likedPosts.includes(post.id);
  const likeCount = (post.likes ?? 0) + (liked ? 1 : 0);
  const nav = useNavigate();
  const [paused, setPaused] = useState(false);
  const [buy, setBuy] = useState(false);
  const [founder, setFounder] = useState(false);
  const [swatch, setSwatch] = useState(false);
  const [formula,setFormula]=useState(false);
  const ref = useRef<HTMLElement>(null);
  const offer = product ? bestOffer(product) : undefined;
  const back = product && offer ? cashbackFor(offer.price, product.cashbackRate) : 0;
  const [fit,setFit]=useState(false);
  const kind = product ? matchKind(product) : "skin";
  const score = product ? fitScore(product, post.creator, state.profile) : skinTwinScore(post.creator, state.profile);
  const saved = product ? state.savedProducts.includes(product.id) : false;

  // Play only while on screen, like a reel.
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setPaused(!e?.isIntersecting), { threshold: 0.6 });
    io.observe(el); return () => io.disconnect();
  }, []);

  const share = async () => {
    if (!product) return;
    const url = `${window.location.origin}/product/${product.id}`;
    try {
      if (navigator.share) await navigator.share({ title: `${product.brand} ${product.name}`, url });
      else { await navigator.clipboard.writeText(url); toast("Link copied"); }
    } catch { /* share dismissed */ }
  };

  if (!product || !offer) return null;
  const brand=brandForProduct(product.id);
  return (
    <section ref={ref} className="relative h-full snap-start overflow-hidden bg-cocoa">
      <button onClick={() => setPaused((x) => !x)} className="absolute inset-0 block h-full w-full" aria-label={paused ? "Play wear test" : "Pause wear test"}>
        <img src={post.media} alt={`${post.creator.handle} wear test of ${product.name}`} className={cn("h-full w-full object-cover animate-kenburns", paused && "[animation-play-state:paused]")} />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cocoa/70 to-transparent" />
        <span className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cocoa/40 to-transparent" />
        {paused && <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-oat/90 text-cocoa"><Play className="ml-1 h-6 w-6 fill-current" /></span>}
      </button>

      <p className="feed-wear-label pointer-events-none absolute left-4 top-[126px] z-10 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-oat/90">
        <span className="h-1.5 w-1.5 rounded-full bg-peach" />{post.wearTest}
      </p>


      <div className="feed-actions absolute bottom-[150px] right-3 z-10 flex flex-col items-center gap-4">
        <button onClick={() => setFit(true)} className="flex flex-col items-center gap-1" aria-label={`Why this is a ${score}% ${MATCH_LABEL[kind]}`}>
          <div className="grid h-[58px] w-[58px] place-items-center rounded-full" style={{ background: `conic-gradient(var(--peach) ${score}%, color-mix(in oklab, var(--oat) 35%, transparent) 0)` }}>
            <div className="grid h-[44px] w-[44px] place-items-center rounded-full bg-cocoa/85 font-display text-[15px] font-semibold text-oat">{score}%</div>
          </div>
          <span className="text-[11px] text-oat/90">{MATCH_LABEL[kind]}</span>
        </button>
        {kind === "shade" && <button onClick={() => setSwatch(true)} className="flex flex-col items-center gap-1" aria-label="Verified swatches">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-cocoa/45 backdrop-blur">
            <span className="flex -space-x-1.5">{(["Deep", "Tan", "Medium"] as const).map((d) => <span key={d} className="h-4 w-4 rounded-full ring-1 ring-oat" style={{ background: DEPTH_SWATCH[d] }} />)}</span>
          </span>
          <span className="text-[11px] text-oat/90">{post.swatches}</span>
        </button>}
        <button onClick={() => toggleLike(post.id)} className="flex flex-col items-center gap-1" aria-pressed={liked} aria-label={liked ? "Unlike post" : "Like post"}>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-cocoa/45 text-oat backdrop-blur"><Heart className={cn("h-5 w-5", liked && "fill-clay text-clay")} /></span>
          <span className="text-[11px] text-oat/90">{likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}k` : likeCount}</span>
        </button>
        <button onClick={() => { toggleProduct(product.id); togglePost(post.id); toast("Saved collection updated"); }} className="flex flex-col items-center gap-1" aria-pressed={saved}>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-cocoa/45 text-oat backdrop-blur"><Bookmark className={cn("h-5 w-5", saved && "fill-current")} /></span>
          <span className="text-[11px] text-oat/90">Save</span>
        </button>
        <button onClick={share} className="grid h-10 w-10 place-items-center rounded-full bg-cocoa/45 text-oat backdrop-blur" aria-label="Share"><Share2 className="h-4 w-4" /></button>
      </div>

      <div className="feed-shop absolute inset-x-3 bottom-3 z-10 space-y-2.5">
        <p className="flex flex-wrap items-center gap-x-1.5 text-sm text-oat">
          <Button variant="ghost" className="h-auto p-0 text-sm font-semibold text-oat hover:bg-transparent hover:text-peach" aria-label={`Follow ${post.creator.handle}`} onClick={()=>toggleCreator(post.creator.handle)}>{post.creator.handle}{state.followedCreators.includes(post.creator.handle)&&' ✓'}</Button>
          <span className="text-sand">·</span>
          {brand ? <Link to="/brand/$id" params={{id:brand.id}} className="text-sand underline-offset-2 hover:underline">{product.brand}</Link> : <span className="text-sand">{product.brand}</span>}
        </p>
        <p className="max-w-[80%] text-[15px] text-oat">{post.caption}</p>
        <div className="flex items-center gap-2 rounded-[22px] bg-cocoa/45 p-2 text-oat backdrop-blur-md">
          <img src={product.image} alt="" className="h-11 w-11 shrink-0 rounded-[14px] object-cover" />
          <span className="min-w-0 flex-1">
            <Link to="/product/$id" params={{id:product.id}} className="block truncate font-display text-[16px] leading-tight">{product.name}</Link>
            <span className="block truncate text-[12px] text-sand">{whereSold(product).label} · from {money(whereSold(product).from)}</span>
          </span>
          <Button variant="ghost" size="icon" onClick={()=>setFounder(true)} aria-label="Founder story" className="h-9 w-9 shrink-0 rounded-full bg-oat/15 text-oat"><BookOpen className="h-4 w-4"/></Button>
          <Button size="icon" onClick={() => setBuy(true)} aria-label={`Shop, earns about ${pointsFor(offer.price)} Bare Points`} className="feed-buy relative h-10 w-10 shrink-0 rounded-full bg-clay text-oat">
            <ShoppingBag className="h-4 w-4"/><Sparkles className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 fill-peach text-peach"/>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2"><Button variant="secondary" size="sm" className="h-8 rounded-full bg-cocoa/60 text-xs text-oat hover:bg-cocoa-soft" onClick={()=>setFormula(true)}><FlaskConical className="h-3.5 w-3.5"/>Inside the Formula</Button><Button asChild variant="secondary" size="sm" className="h-8 rounded-full bg-cocoa/60 text-xs text-oat hover:bg-cocoa-soft"><Link to="/bare-or-buy" search={{product:product.id}}>Bare or Buy?</Link></Button></div>
      </div>

      <WhereToBuySheet product={product} open={buy} onOpenChange={setBuy} />
      <FormulaSheet product={product} open={formula} onOpenChange={setFormula}/>
      <FounderSheet product={product} open={founder} onOpenChange={setFounder} />
      <FitSheet product={product} creator={post.creator} score={score} open={fit} onOpenChange={setFit} />
      {kind === "shade" && <SwatchSheet product={product} count={post.swatches} open={swatch} onOpenChange={setSwatch} />}
    </section>
  );
}
