import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, Settings, Pencil, Share2, Grid2X2, Sparkles, Repeat2, Tag, FileText, Play, UserRound, ChevronRight, Package, Droplets, Scale, Clapperboard, Coins, LogOut, Plus, Loader2, Lock } from 'lucide-react';
import { UNDERTONE_SWATCH, skinTags, toneLabel } from '@/lib/data';
import { useBare, walletTotals } from '@/lib/store';
import { useJourney } from '@/lib/journey';
import { useAccount } from '@/lib/account';
import { supabase } from '@/integrations/supabase/client';
import { BRANDS } from '@/lib/atlas';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ProfileEditor } from '@/components/bare/profile-editor';
import { MyCollection } from '@/components/bare/my-collection';
import { ownedPosts, profileIdentity } from '@/lib/profile';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { shareLink } from '@/lib/share';

export const Route = createFileRoute('/me')({
  head: () => ({ meta: [{ title: 'My Profile · Becoming Bare' }, { name: 'description', content: 'Your beauty stories, private canvas and personal beauty collection.' }, { property: 'og:title', content: 'My Profile · Becoming Bare' }, { property: 'og:description', content: 'Your beauty stories, private canvas and personal beauty collection.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: Me,
});

function Me() {
  const { state, reset, toggleCreator, toggleBrandSignal } = useBare();
  const { user, ready } = useAccount();
  const qc = useQueryClient(), nav = useNavigate();
  const [tab, setTab] = useState<'posts' | 'beauty'>('posts');
  const [editing, setEditing] = useState(false), [showFollowing, setShowFollowing] = useState(false), [settings, setSettings] = useState(false), [shelf, setShelf] = useState(false), [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const [sub, setSub] = useState<'Posts' | 'Reposts' | 'Tagged' | 'Drafts'>('Posts');
  const [journey] = useJourney();
  const identity = profileIdentity(user?.user_metadata ?? {}, user?.email);
  const p = state.profile, totals = walletTotals(state.wallet);
  const following = state.followedCreators.length + state.followedBrands.length;
  const activeGoals = journey.goals.filter(goal => !goal.done).length;
  const posts = useInfiniteQuery({
    queryKey: ['my-profile-posts', user?.id], enabled: !!user, initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      if (!user) return [];
      const { data, error } = await supabase.from('beauty_posts').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }).order('id').range(pageParam, pageParam + 23);
      if (error) throw error;
      const rows = ownedPosts(data ?? [], user.id);
      if (!rows.length) return [];
      const { data: media, error: mediaError } = await supabase.storage.from('beauty-posts').createSignedUrls(rows.map(post => post.media_path), 3600);
      if (mediaError) throw mediaError;
      return rows.map(post => ({ ...post, url: media?.find(item => item.path === post.media_path)?.signedUrl ?? '' }));
    },
    getNextPageParam: (lastPage, pages) => lastPage.length === 24 ? pages.length * 24 : undefined,
    staleTime: 60_000,
  });
  const published = ownedPosts(posts.data?.pages.flat() ?? [], user?.id);
  const summary = [toneLabel(p.depth, p.undertone), ...skinTags(p), p.hair].filter(Boolean).join(' · ');

  async function signOut() {
    setSigningOut(true); setSignOutError('');
    const { error } = await supabase.auth.signOut();
    if (error) { setSignOutError('Could not sign out. Please try again.'); setSigningOut(false); return; }
    await qc.cancelQueries(); qc.clear(); reset(); void nav({ to: '/auth', replace: true });
  }

  return <div className="me-surface min-h-dvh pb-[calc(var(--tabs-h)+28px)] md:pb-12">
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <header className="flex min-h-20 items-center justify-between gap-2 py-4">
        <Link to="/" className="min-w-0 font-display text-[25px] font-semibold italic leading-tight sm:text-[32px]">Becoming Bare</Link>
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <Button asChild variant="ghost" size="icon" className="h-11 w-11 rounded-full" title="Notification preferences"><Link to="/notifications" aria-label="Notifications"><Bell className="!h-6 !w-6" strokeWidth={1.6}/></Link></Button>
          <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full" aria-label="More and Settings" title="More & Settings" onClick={() => setSettings(true)}><Settings className="!h-6 !w-6" strokeWidth={1.6}/></Button>
        </div>
      </header>

      <section aria-label="Your profile" className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-4 gap-y-3 py-3 sm:grid-cols-[136px_minmax(0,1fr)] sm:gap-x-5 sm:py-5">
        <Button variant="ghost" className="row-span-2 h-[88px] w-[88px] overflow-hidden rounded-full p-[3px] hover:bg-transparent sm:h-[136px] sm:w-[136px]" style={{ background: state.consulted ? UNDERTONE_SWATCH[p.depth][p.undertone] : 'var(--primary)' }} aria-label={user ? 'Change profile picture' : 'Profile picture'} disabled={!user} onClick={() => setEditing(true)}>
          <span className="relative grid h-full w-full place-items-center overflow-hidden rounded-full border-2 border-background bg-muted">{identity.avatar_url ? <img src={identity.avatar_url} alt="Your profile" className="h-full w-full object-cover"/> : user ? <span className="font-display text-3xl font-semibold text-foreground sm:text-5xl">{(identity.display_name || identity.username || 'B').charAt(0).toUpperCase()}</span> : <UserRound className="!h-9 !w-9 text-muted-foreground"/>}{user && !identity.avatar_url && <span className="absolute bottom-1 rounded-full bg-cocoa px-2 py-0.5 text-[9px] text-oat sm:text-[11px]">Add photo</span>}</span>
        </Button>
        <div className="min-w-0 self-center">
          <h1 className="break-words font-display text-[23px] font-semibold leading-tight sm:text-[28px]">{user ? `@${identity.username || 'bare.creator'}` : ready ? 'Your bare canvas' : 'Opening…'}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs sm:text-sm">
            <span title="Follower counts are not connected">— <span className="text-muted-foreground">Followers</span></span><span aria-hidden="true">·</span>
            <Button variant="ghost" className="h-7 rounded-none px-0 text-xs font-normal hover:bg-transparent hover:underline sm:text-sm" onClick={() => setShowFollowing(true)}>{following} <span className="text-muted-foreground">Following</span></Button>
          </div>
          {identity.bio && <p className="mt-1 break-words text-sm leading-relaxed">{identity.bio}</p>}
          {!user && <p className="mt-1 text-xs text-muted-foreground">Your stories. Your beauty journey.</p>}
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-2 sm:col-span-1 sm:col-start-2 sm:gap-3">
          {user ? <Button className="h-11 rounded-full" onClick={() => setEditing(true)}><Pencil/>Edit Profile</Button> : <Button className="h-11 rounded-full" asChild><Link to="/auth">Sign in</Link></Button>}
          <Button variant="outline" className="h-11 w-full rounded-full border-primary/35 bg-transparent text-foreground" onClick={async () => { const r = await shareLink(navigator, `${identity.username ? '@' + identity.username : 'My profile'} on Becoming Bare`, window.location.origin); if (r === 'copied') toast.success('Link copied'); else if (r === 'manual') toast.message(`Copy this link: ${window.location.origin}`); }}><Share2/>Share Profile</Button>
        </div>
      </section>

      <section aria-label="My Canvas Profile" className="me-canvas my-5 flex items-center gap-3 rounded-[20px] border border-border/60 bg-card px-4 py-4 sm:my-6 sm:gap-4 sm:px-5">
        {state.consulted ? <span className="relative h-12 w-14 shrink-0"><span className="absolute left-0 top-1 h-11 w-11 rounded-full border border-background" style={{ background: UNDERTONE_SWATCH[p.depth][p.undertone] }}/><span className="absolute left-5 top-1 h-11 w-11 rounded-full border-2 border-background/70 bg-peach/65"/></span> : <Button asChild className="h-14 w-14 shrink-0 rounded-full p-0 text-[10px] leading-tight"><Link to="/consultation"><span>Start<br/>canvas</span></Link></Button>}
        <div className="min-w-0 flex-1"><h2 className="font-display text-xl font-semibold italic sm:text-2xl">My Canvas Profile</h2><p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">{state.consulted ? summary : 'Your tone, skin & hair'}</p></div>
        <Button asChild variant="link" className="h-11 shrink-0 gap-1 px-0 text-xs sm:text-sm"><Link to="/consultation">{state.consulted ? 'Update' : 'Begin'}<ChevronRight/></Link></Button>
      </section>

      <div role="tablist" aria-label="Profile views" className="grid h-14 grid-cols-2 rounded-full bg-muted p-1">
        <Button id="my-posts-tab" role="tab" aria-selected={tab === 'posts'} aria-controls="my-posts-panel" variant="ghost" onClick={() => setTab('posts')} className={cn('h-full rounded-full text-base', tab === 'posts' && 'bg-cocoa text-oat hover:bg-cocoa hover:text-oat')}><Grid2X2 className="!h-5 !w-5"/>My Posts</Button>
        <Button id="my-beauty-tab" role="tab" aria-selected={tab === 'beauty'} aria-controls="my-beauty-panel" variant="ghost" onClick={() => setTab('beauty')} className={cn('h-full rounded-full font-display text-lg italic', tab === 'beauty' && 'bg-cocoa text-oat hover:bg-cocoa hover:text-oat')}><Sparkles className="!h-5 !w-5"/>My Beauty</Button>
      </div>

      {tab === 'posts' ? <section id="my-posts-panel" role="tabpanel" aria-labelledby="my-posts-tab">
        <div className="mt-4 grid grid-cols-4 border-b border-border/70">
          {([{ label: 'Posts', icon: Grid2X2 }, { label: 'Reposts', icon: Repeat2 }, { label: 'Tagged', icon: Tag }, ...(user ? [{ label: 'Drafts', icon: FileText }] : [])] as const).map(({ label, icon: Icon }) => <Button key={label} variant="ghost" aria-pressed={sub === label} onClick={() => setSub(label)} className={cn('h-[72px] w-full flex-col gap-1 rounded-none px-0 text-xs sm:text-sm', sub === label ? 'border-b-2 border-primary' : 'text-muted-foreground')}><Icon className="!h-5 !w-5" strokeWidth={1.7}/>{label}</Button>)}
        </div>
        {sub !== 'Posts' ? <div className="py-14 text-center">{sub === 'Reposts' ? <><Repeat2 className="mx-auto h-8 w-8 text-primary"/><h2 className="mt-4 font-display text-xl">No reposts yet</h2><p className="mt-2 text-sm text-muted-foreground">Posts you repost from the feed will live here.</p><Button asChild className="mt-5 rounded-full"><Link to="/">Browse the feed</Link></Button></> : sub === 'Tagged' ? <><Tag className="mx-auto h-8 w-8 text-primary"/><h2 className="mt-4 font-display text-xl">No tags yet</h2><p className="mt-2 text-sm text-muted-foreground">When creators tag you in a post, it shows up here.</p></> : <><FileText className="mx-auto h-8 w-8 text-primary"/><h2 className="mt-4 font-display text-xl">Your drafts</h2><p className="mt-2 text-sm text-muted-foreground">Saved review drafts live in My Reviews. Start a new story anytime.</p><div className="mt-5 flex justify-center gap-2"><Button asChild variant="outline" className="rounded-full bg-transparent"><Link to="/empty-bottle">Review drafts</Link></Button><Button asChild className="rounded-full"><Link to="/create" search={{}}>Create</Link></Button></div></>}</div> : !user ? <div className="py-14 text-center"><Grid2X2 className="mx-auto h-8 w-8 text-primary"/><h2 className="mt-4 font-display text-xl">Your stories belong here</h2><p className="mt-2 text-sm text-muted-foreground">Sign in to see your published photos and videos.</p><Button asChild className="mt-5 rounded-full"><Link to="/auth">Sign in</Link></Button></div> : posts.isPending ? <p role="status" className="flex items-center justify-center gap-2 py-14 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/>Loading your stories…</p> : posts.error ? <div role="alert" className="py-12 text-center"><p>Your posts could not be loaded.</p><Button variant="link" onClick={() => posts.refetch()}>Try again</Button></div> : published.length ? <><div className="mt-5 grid grid-cols-3 gap-2">{published.map(post => <Link key={post.id} to="/" search={{ post: post.id }} className="relative aspect-square overflow-hidden rounded-lg bg-muted" aria-label={`Open post: ${post.caption}`}>
          {post.url ? post.media_type === 'video' ? <><video src={post.url} preload="metadata" muted playsInline className="h-full w-full object-cover"/><Play className="absolute right-2 top-2 h-5 w-5 fill-oat text-oat"/></> : <img src={post.url} alt={post.caption} loading="lazy" className="h-full w-full object-cover"/> : <span className="grid h-full place-items-center p-2 text-center text-xs text-muted-foreground">Media unavailable</span>}
        </Link>)}</div>{posts.hasNextPage && <Button variant="outline" disabled={posts.isFetchingNextPage} className="mx-auto mt-5 flex rounded-full bg-transparent" onClick={() => posts.fetchNextPage()}>{posts.isFetchingNextPage ? 'Loading…' : 'Load more posts'}</Button>}</> : <div className="py-12 text-center"><Grid2X2 className="mx-auto h-9 w-9 text-primary" strokeWidth={1.3}/><h2 className="mt-4 font-display text-2xl">A little bare, for now</h2><p className="mt-2 text-sm text-muted-foreground">Your published beauty stories will appear here.</p><Button asChild className="mt-5 rounded-full"><Link to="/create"><Plus/>Create your first post</Link></Button></div>}
      </section> : <section id="my-beauty-panel" role="tabpanel" aria-labelledby="my-beauty-tab" className="mt-5">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="ghost" onClick={() => setShelf(true)} className="h-auto min-h-32 flex-col items-start gap-2 whitespace-normal rounded-lg border border-border/60 bg-card p-4 text-left"><Package className="!h-6 !w-6 text-primary"/><span className="font-display text-lg">My Collection</span><span className="text-xs font-normal text-muted-foreground">Your products & beauty experiences</span></Button>
          {([{ to: '/empty-bottle', icon: Droplets, title: 'My Reviews', detail: 'Your product & service reviews' }, { to: '/bare-or-buy', icon: Scale, title: 'Bare or Buy?', detail: 'Compare your next discovery' }, { to: '/create', icon: Clapperboard, title: 'Creator Studio', detail: 'Create & manage your stories' }] as const).map(({ to, icon: Icon, title, detail }) => <Button key={to} asChild variant="ghost" className="h-auto min-h-32 flex-col items-start gap-2 whitespace-normal rounded-lg border border-border/60 bg-card p-4 text-left"><Link to={to}><Icon className="!h-6 !w-6 text-primary"/><span className="font-display text-lg">{title}</span><span className="text-xs font-normal text-muted-foreground">{detail}</span></Link></Button>)}
        </div>
        <Button asChild className="mt-4 h-auto min-h-20 w-full justify-start gap-3 whitespace-normal rounded-lg px-4 py-4"><Link to="/canvas"><Sparkles className="!h-6 !w-6"/><span className="min-w-0 flex-1 text-left"><span className="block font-display text-xl italic">My Beauty Journey</span><span className="mt-1 block text-xs font-normal">{journey.goals.length ? `${activeGoals} active goals · ${journey.entries.length} journal entries` : 'Personal goals & moments of progress'}</span></span><ChevronRight/></Link></Button>
      </section>}
    </div>

    {editing && user && <ProfileEditor key={user.id} identity={identity} onClose={() => setEditing(false)}/>}
    <Sheet open={showFollowing} onOpenChange={setShowFollowing}><SheetContent side="bottom" className="me-surface max-h-[80vh] overflow-y-auto"><div className="mx-auto max-w-xl pb-6"><SheetHeader><SheetTitle className="font-display text-2xl">Following · {following}</SheetTitle><SheetDescription>Your creators, specialists and brands.</SheetDescription></SheetHeader><div className="mt-4">{!following && <p className="py-8 text-center text-sm text-muted-foreground">Your following list is still bare.</p>}{state.followedCreators.map(handle => <div key={handle} className="flex items-center justify-between gap-3 border-b py-3"><span className="min-w-0 break-words text-sm">{handle.startsWith('@') ? handle : 'Community creator'}</span><Button variant="outline" size="sm" className="rounded-full bg-transparent" onClick={() => toggleCreator(handle)}>Unfollow</Button></div>)}{BRANDS.filter(brand => state.followedBrands.includes(brand.id)).map(brand => <div key={brand.id} className="flex items-center justify-between gap-3 border-b py-3"><Link to="/brand/$id" params={{ id: brand.id }} className="text-sm" onClick={() => setShowFollowing(false)}>{brand.name}</Link><Button variant="outline" size="sm" className="rounded-full bg-transparent" onClick={() => toggleBrandSignal('followedBrands', brand.id)}>Unfollow</Button></div>)}</div></div></SheetContent></Sheet>
    <Sheet open={settings} onOpenChange={setSettings}><SheetContent className="me-surface overflow-y-auto"><SheetHeader><SheetTitle className="font-display text-2xl">More & Settings</SheetTitle><SheetDescription>Your account and beauty preferences.</SheetDescription></SheetHeader><div className="mt-6 space-y-1">
      {([{ to: '/wallet', icon: Coins, title: `${Math.round(totals.available)} Bare Points` }, { to: '/notifications', icon: Bell, title: 'Notification preferences' }, { to: '/consultation', icon: Lock, title: 'Private Canvas Profile' }, { to: '/saved', icon: Package, title: 'Saved collection' }, { to: '/studio', icon: Clapperboard, title: 'Creator & brand workspaces' }] as const).map(({ to, icon: Icon, title }) => <Button key={to} variant="ghost" asChild className="h-14 w-full justify-start whitespace-normal"><Link to={to} onClick={() => setSettings(false)}><Icon/><span className="flex-1 text-left">{title}</span><ChevronRight/></Link></Button>)}
      {user ? <><Button variant="ghost" className="h-14 w-full justify-start" onClick={() => { setSettings(false); setEditing(true); }}><Pencil/>Edit account profile</Button><Button variant="ghost" disabled={signingOut} className="mt-4 h-14 w-full justify-start border-t text-primary" onClick={() => void signOut()}><LogOut/>{signingOut ? 'Signing out…' : 'Sign out'}</Button>{signOutError && <p role="alert" className="text-sm text-destructive">{signOutError}</p>}</> : <Button asChild className="mt-4 w-full rounded-full"><Link to="/auth">Sign in / Create account</Link></Button>}
    </div></SheetContent></Sheet>
    <Sheet open={shelf} onOpenChange={setShelf}><SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto me-surface"><div className="mx-auto max-w-2xl pb-6"><SheetHeader className="mb-5"><SheetTitle>My Collection</SheetTitle><SheetDescription>Your products & beauty experiences</SheetDescription></SheetHeader><MyCollection/></div></SheetContent></Sheet>
  </div>;
}
