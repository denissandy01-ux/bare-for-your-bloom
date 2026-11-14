import { ShareButton } from '@/components/bare/share-button';
import { LikeBurst, useDoubleTapLike } from '@/components/bare/like-burst';
import { EmptyGallery } from '@/components/bare/empty-gallery';
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Bell, Check, Plus, Search, X, BookOpen, Bookmark, FlaskConical, Heart, Play, Share2, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BareHeader, EmptyState, SecondaryButton } from "@/components/bare/kit";
import { CreatorSheet } from '@/components/bare/creator-sheet';
import { FounderSheet, SwatchSheet, ToneSheet, WhereToBuySheet } from "@/components/bare/sheets";
import { UNDERTONE_SWATCH, FEED, whereSold, bestOffer, cashbackFor, pointsFor, feedForTone, money, productById, skinTwinScore, fitScore, matchKind, MATCH_LABEL, type FeedPost } from "@/lib/data";
import { useBare } from "@/lib/store";
import { suggestShade } from "@/lib/shades";
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
import { EXPLORE_TOPICS, FEED_TABS, matchesSearch, tabPosts, topicForCategory, topicMatches, type ExploreTopic, type FeedTab } from '@/lib/feed-tabs';
import { REGIONS, countryById, type RegionId } from '@/lib/atlas';
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
  const { state, browseProfile, temporaryCanvas } = useBare();
  const [showAll, setShowAll] = useState(false);
  const [toneOpen, setToneOpen] = useState(false);
  const [tab,setTab]=useState<FeedTab>('For You');
  const [topic,setTopic]=useState<ExploreTopic>('All');
  const [region,setRegion]=useState<RegionId|'all'>('all');
  const [query,setQuery]=useState('');
  const [searching,setSearching]=useState(false);
  const community=useQuery(communityOptions);
  const search=Route.useSearch();
  const matched = feedForTone(FEED, browseProfile);
  const base = showAll ? [...FEED].sort((a, b) => skinTwinScore(b.creator, browseProfile) - skinTwinScore(a.creator, browseProfile)) : matched;
  const filter={topic,region,query};
  const posts = search.post ? FEED.filter(p=>p.id===search.post) : tabPosts(tab==='For You'?base:FEED,tab,state.followedBrands,state.followedCreators,state.shoppingCountry,filter);
  const shared=community.data?.filter(p=>{
    if(search.post) return p.id===search.post;
    if(!matchesSearch(query,p.caption,p.author,p.kind)) return false;
    if(tab==='Following') return state.followedCreators.includes(p.owner_id)||(!!p.brand_id&&state.followedBrands.includes(p.brand_id));
    if(tab==='Global') return p.country_id!==state.shoppingCountry&&(region==='all'||!!countryById(p.country_id)?.regions.includes(region));
    if(tab==='Explore') { const pr=p.product_id?productById(p.product_id):undefined; return topicMatches(topic,pr?topicForCategory(pr.category):undefined,p.kind==='Tutorial'); }
    return true;
  })??[];
  const services=search.post?SERVICE_FEED.filter(p=>p.id===search.post):SERVICE_FEED.filter(p=>{
    const s=specialistById(p.specialistId);
    if(!matchesSearch(query,p.title,p.caption,p.category,s?.name,s?.studio,s&&handleFor(s))) return false;
    if(tab==='For You') return true;
    if(tab==='Following') return !!s&&state.followedCreators.includes(handleFor(s));
    if(tab==='Explore') return topicMatches(topic,topicForCategory(p.category));
    return false;
  });
  useEffect(() => setShowAll(false), [browseProfile.depth, browseProfile.undertone]);

  return (
    <div className="bare-feed relative mx-auto h-[calc(100dvh-var(--tabs-h))] w-full max-w-[480px] overflow-hidden md:my-0 md:h-dvh">
      <header className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-cocoa/80 to-transparent px-4 pt-4 pb-3">
        <div className="flex items-center justify-between gap-2"><Button variant="ghost" onClick={()=>setToneOpen(true)} aria-label="Choose your browsing canvas" className="h-auto min-w-0 gap-2 bg-transparent p-0 text-oat hover:bg-transparent hover:text-peach"><span className="h-6 w-6 shrink-0 rounded-full ring-1 ring-oat/60" style={{background:UNDERTONE_SWATCH[browseProfile.depth][browseProfile.undertone]}}/><span className="min-w-0 text-left"><span className="block font-display text-[22px] leading-tight">Becoming Bare</span>{temporaryCanvas && <span className="block text-[10px] text-sand">Browsing · {browseProfile.depth} {browseProfile.undertone}</span>}</span></Button><div className="flex shrink-0 gap-2"><Button variant="ghost" size="icon" aria-label="Search the feed" onClick={()=>setSearching(x=>!x)} className="h-10 w-10 rounded-full bg-cocoa/45 text-oat hover:bg-cocoa/60 hover:text-oat"><Search className="h-5 w-5"/></Button><Link to="/notifications" aria-label="Notifications" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cocoa/45 text-oat"><Bell className="h-5 w-5"/></Link></div></div>
        <div role="tablist" aria-label="Feed categories" className="mt-3 grid grid-cols-4 gap-1 border-b border-oat/20">{FEED_TABS.map(t=><Button role="tab" aria-selected={tab===t} key={t} size="sm" variant="ghost" className={cn('h-9 rounded-none border-b-2 bg-transparent px-1 text-xs text-oat hover:bg-oat/10 hover:text-oat',tab===t?'border-peach font-semibold':'border-transparent text-oat/75')} onClick={()=>setTab(t)}>{t}</Button>)}</div>
        {searching && <div className="mt-2 flex h-10 items-center gap-2 rounded-full bg-cocoa/50 px-3 backdrop-blur-md"><Search className="h-4 w-4 shrink-0 text-sand"/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} aria-label="Search the feed" placeholder="Search locs, retinol, @creator…" className="min-w-0 flex-1 bg-transparent text-sm text-oat outline-none placeholder:text-sand"/><button aria-label="Close search" onClick={()=>{setQuery('');setSearching(false);}} className="text-sand"><X className="h-4 w-4"/></button></div>}
        {tab==='Explore' && <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">{EXPLORE_TOPICS.map(t=><button key={t} aria-pressed={topic===t} onClick={()=>setTopic(t)} className={cn('h-8 shrink-0 rounded-full px-3 text-xs backdrop-blur-md',topic===t?'bg-oat text-cocoa font-semibold':'bg-cocoa/40 text-oat')}>{t}</button>)}</div>}
        {tab==='Global' && <div className="no-scrollbar mt-2 flex items-center gap-2 overflow-x-auto"><button aria-pressed={region==='all'} onClick={()=>setRegion('all')} className={cn('h-8 shrink-0 rounded-full px-3 text-xs backdrop-blur-md',region==='all'?'bg-oat text-cocoa font-semibold':'bg-cocoa/40 text-oat')}>All global</button>{REGIONS.map(r=><button key={r.id} aria-pressed={region===r.id} onClick={()=>setRegion(r.id)} className={cn('h-8 shrink-0 rounded-full px-3 text-xs backdrop-blur-md',region===r.id?'bg-oat text-cocoa font-semibold':'bg-cocoa/40 text-oat')}>{r.name}</button>)}<Link to="/atlas" className="shrink-0 text-xs text-sand underline-offset-2 hover:underline">Atlas →</Link></div>}
      </header>
      <ToneSheet open={toneOpen} onOpenChange={setToneOpen} browsing />
      {posts.length === 0 && shared.length===0 && services.length===0 ? (
        <div className="flex h-full items-center px-6">
          <EmptyGallery
            title={query?'Nothing matches that yet':tab==='Following'?'Your people, your feed':tab==='Explore'&&topic==='Learn'?'Fresh lessons are on the way':tab==='Global'?'More global stories to come':tab==='Explore'?'Nothing here yet':'No wear tests for your tone yet'}
            body={query?'Try another word, ingredient or handle.':tab==='Following'?'Follow a creator or brand to keep their stories here.':tab==='Explore'&&topic==='Learn'?'Share a tutorial or explore ingredient education.':'Browse more discoveries or adjust your canvas.'}
            action={query?<Button onClick={()=>setQuery('')}>Clear search</Button>:tab==='Explore'&&topic==='Learn'?<Button asChild><Link to="/create">Share a tutorial</Link></Button>:tab==='Following'?<Button asChild><Link to="/discover">Discover brands</Link></Button>:<div className="flex flex-wrap justify-center gap-2"><Button onClick={() => {setShowAll(true);setTab('For You');}}>Show all tones</Button><Button variant="secondary" onClick={() => setToneOpen(true)}>Change tone</Button></div>}
          />

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
  const { state, browseProfile, toggleProduct, toggleLike, toggleCreator, togglePost } = useBare();
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
  const [creator,setCreator]=useState(false);
  const kind = product ? matchKind(product) : "skin";
  const score = product ? fitScore(product, post.creator, browseProfile) : skinTwinScore(post.creator, browseProfile);
  const tryShade = product && kind === "shade" ? suggestShade(product.id, browseProfile) : null;
  const shadeColor = UNDERTONE_SWATCH[tryShade?.depth ?? browseProfile.depth][tryShade?.undertone ?? browseProfile.undertone];
  const saved = product ? state.savedProducts.includes(product.id) : false;

  // Play only while on screen, like a reel.
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setPaused(!e?.isIntersecting), { threshold: 0.6 });
    io.observe(el); return () => io.disconnect();
  }, []);

  const doubleTap = useDoubleTapLike(liked, () => toggleLike(post.id));

  if (!product || !offer) return null;
  const brand=brandForProduct(product.id);
  return (
    <section ref={ref} className="relative h-full snap-start overflow-hidden bg-cocoa">
      <Button variant="ghost" onDoubleClick={doubleTap.onDoubleClick} onTouchEnd={doubleTap.onTouchEnd} onClick={() => setPaused((x) => !x)} className="absolute inset-0 block h-full w-full rounded-none p-0 hover:bg-transparent" aria-label={paused ? "Play wear test" : "Pause wear test"}>
        <img src={post.media} alt={`${post.creator.handle} wear test of ${product.name}`} className={cn("h-full w-full object-cover animate-kenburns", paused && "[animation-play-state:paused]")} />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cocoa/70 to-transparent" />
        <span className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cocoa/40 to-transparent" />
        {paused && <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-oat/90 text-cocoa"><Play className="ml-1 h-6 w-6 fill-current" /></span>}
      </Button>
      <LikeBurst burst={doubleTap.burst}/>

      <p className="feed-wear-label pointer-events-none absolute left-4 top-[172px] z-10 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-oat/90">
        <span className="h-1.5 w-1.5 rounded-full bg-peach" />{post.wearTest}
      </p>


      <div className="feed-actions absolute bottom-[118px] right-3 z-10 flex flex-col items-center gap-4">
        {kind === "shade"
          ? <button onClick={() => setSwatch(true)} className="flex flex-col items-center gap-1.5" aria-label={`${score}% Shade Twin. Shade to try: ${tryShade?.code ?? `${browseProfile.depth} ${browseProfile.undertone}`}. Open swatches`}>
              <div className="grid h-[58px] w-[58px] place-items-center rounded-full" style={{ background: `conic-gradient(var(--peach) ${score}%, color-mix(in oklab, var(--oat) 35%, transparent) 0)` }}>
                <div className="grid h-[44px] w-[44px] place-items-center rounded-full font-display text-[13px] font-semibold text-oat ring-2 ring-cocoa/70" style={{ background: shadeColor, textShadow: "0 1px 3px rgb(0 0 0 / .55)" }}>{tryShade?.code ?? `${score}%`}</div>
              </div>
              <span className="text-[11px] text-oat/90">{tryShade ? "Shade to try" : MATCH_LABEL[kind]}</span>
            </button>
          : <button onClick={() => setFit(true)} className="flex flex-col items-center gap-1.5" aria-label={`Why this is a ${score}% ${MATCH_LABEL[kind]}`}>
              <div className="grid h-[58px] w-[58px] place-items-center rounded-full" style={{ background: `conic-gradient(var(--peach) ${score}%, color-mix(in oklab, var(--oat) 35%, transparent) 0)` }}>
                <div className="grid h-[44px] w-[44px] place-items-center rounded-full bg-cocoa/85 font-display text-[15px] font-semibold text-oat">{score}%</div>
              </div>
              <span className="text-[11px] text-oat/90">{MATCH_LABEL[kind]}</span>
            </button>}
        <button onClick={() => toggleLike(post.id)} className="flex flex-col items-center gap-1" aria-pressed={liked} aria-label={liked ? "Unlike post" : "Like post"}>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-cocoa/45 text-oat backdrop-blur"><Heart className={cn("h-5 w-5", liked && "fill-clay text-clay")} /></span>
          <span className="text-[11px] text-oat/90">{likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}k` : likeCount}</span>
        </button>
        <button onClick={() => { toggleProduct(product.id); togglePost(post.id); toast.success(saved ? "Removed from Saved" : "Saved to Products & Media"); }} className="flex flex-col items-center gap-1" aria-pressed={saved}>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-cocoa/45 text-oat backdrop-blur"><Bookmark className={cn("h-5 w-5", saved && "fill-current")} /></span>
          <span className="text-[11px] text-oat/90">Save</span>
        </button>
        <ShareButton title={post.caption} path={`/?post=${post.id}`} className="h-10 w-10 rounded-full bg-cocoa/45 text-oat backdrop-blur"/>
      </div>

      <div className="feed-shop absolute inset-x-3 bottom-3 z-10 space-y-2.5">
        <p className="flex flex-wrap items-center gap-x-1.5 text-sm text-oat">
          {post.official && brand
            ? <Link to="/brand/$id" params={{id:brand.id}} className="inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline">{post.creator.handle}<BadgeCheck className="h-4 w-4 text-peach" aria-label="Official brand"/></Link>
            : <button onClick={()=>setCreator(true)} className="font-semibold underline-offset-2 hover:underline">{post.creator.handle}</button>}
          {!post.official && <><span className="text-sand">·</span>{brand ? <Link to="/brand/$id" params={{id:brand.id}} className="text-sand underline-offset-2 hover:underline">{product.brand}</Link> : <span className="text-sand">{product.brand}</span>}</>}
          <FollowPill following={state.followedCreators.includes(post.creator.handle)} name={post.creator.handle} onToggle={()=>toggleCreator(post.creator.handle)}/>
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
      {!post.official && <CreatorSheet creator={post.creator} open={creator} onOpenChange={setCreator}/>}
      <FormulaSheet product={product} open={formula} onOpenChange={setFormula}/>
      <FounderSheet product={product} open={founder} onOpenChange={setFounder} />
      <FitSheet product={product} creator={post.creator} score={score} open={fit} onOpenChange={setFit} />
      {kind === "shade" && <SwatchSheet product={product} count={post.swatches} open={swatch} onOpenChange={setSwatch} />}
    </section>
  );
}

import { FollowPill } from '@/components/bare/follow-pill';
export { FollowPill };
