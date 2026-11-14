import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useBare } from '@/lib/store';
import { useAccount } from '@/lib/account';
import { productById } from '@/lib/data';
import { specialistById } from '@/lib/specialists';
import { beautyReviewsOptions } from '@/lib/beauty-reviews-query';
import { removeBeautyReview } from '@/lib/beauty-reviews.functions';
import type { BeautyReview } from '@/lib/beauty-reviews';
import { ReviewEditor } from './review-editor';
export function MyReviews() {
  const {user}=useAccount(), {state,removeEmpty}=useBare(), qc=useQueryClient(), remove=useServerFn(removeBeautyReview);
  const [kind,setKind]=useState<'product'|'service'>('product'), [status,setStatus]=useState('All'), [edit,setEdit]=useState<BeautyReview|null>(null), [creating,setCreating]=useState(false);
  const reviews=useQuery({...beautyReviewsOptions(user?.id),enabled:!!user});
  const rows=(reviews.data??[]).filter(r=>r.kind===kind&&(status==='All'||r.status===status.toLowerCase().replace('drafts','draft')));
  return <section className="space-y-5"><h1 className="font-display text-3xl">My Reviews</h1><p className="text-sm text-muted-foreground">Your product & service reviews</p><div className="grid grid-cols-2 gap-2">{(['product','service'] as const).map(k=><Button key={k} variant={kind===k?'default':'outline'} aria-pressed={kind===k} onClick={()=>setKind(k)}>{k==='product'?'Products':'Services'}</Button>)}</div><div className="flex flex-wrap gap-1">{['All','Published','Drafts','Private'].map(s=><Button key={s} variant={status===s?'default':'ghost'} size="sm" className="rounded-full" onClick={()=>setStatus(s)}>{s}</Button>)}</div><Button onClick={()=>setCreating(true)}><Plus/>Write a Review</Button>
  {!user&&<p className="text-sm">Your existing personal logs are below. <Link to="/auth" className="underline">Sign in</Link> to save new reviews.</p>}{reviews.isPending&&user&&<p role="status">Loading your reviews…</p>}{reviews.error&&<div role="alert">Reviews could not be loaded.<Button variant="link" onClick={()=>reviews.refetch()}>Try again</Button></div>}
  {rows.map(r=>{const p=r.product_id?productById(r.product_id):undefined,s=r.specialist_id?specialistById(r.specialist_id):undefined;return <article key={r.id} className="flex gap-3 border-b border-border py-4"><img src={r.url||p?.image||s?.image} alt="" className="h-16 w-16 rounded-lg object-cover"/><div className="min-w-0 flex-1"><h2 className="font-display text-lg">{p?.name??s?.studio}</h2><p className="text-xs text-primary">{r.rating?`${r.rating} ★ · `:''}{r.status}{r.finished?' · Finished Product':''}</p><p className="text-xs">{r.kind==='product'?'Repurchase':'Book again'}: {r.decision??'Not recorded'}{r.service&&` · ${r.service}`}</p><p className="mt-2 line-clamp-3 text-sm">{r.experience}</p><Button variant="link" className="px-0" onClick={()=>setEdit(r)}><Pencil/>View / Edit</Button></div><Button variant="ghost" size="icon" aria-label="Delete review" onClick={async()=>{if(!window.confirm('Delete this review?'))return;try{await remove({data:r.id});await qc.invalidateQueries({queryKey:['beauty-reviews']});toast.success('Review deleted');}catch{toast.error('Could not delete review.');}}}><Trash2/></Button></article>;})}
  {kind==='product'&&(status==='All'||status==='Private')&&state.emptyBottles.map(e=><article key={e.id} className="flex gap-3 border-b border-border py-4"><div className="min-w-0 flex-1"><h2 className="font-display text-lg">{productById(e.productId)?.name}</h2><p className="text-xs text-primary">Private · Finished Product · {e.repurchase?'Would repurchase':'Would not repurchase'}</p><p className="mt-2 text-sm">{e.note}</p><p className="text-xs text-muted-foreground">Legacy bottle log · {e.weeks} weeks</p></div><Button variant="ghost" size="icon" aria-label="Remove legacy log" onClick={()=>removeEmpty(e.id)}><Trash2/></Button></article>)}
  {!rows.length&&!(kind==='product'&&(status==='All'||status==='Private')&&state.emptyBottles.length)&&!reviews.isFetching&&<p className="py-8 text-center text-sm text-muted-foreground">No {status==='All'?'':status.toLowerCase()} reviews yet.</p>}
  {(creating||edit)&&<ReviewEditor key={edit?.id??kind} kind={edit?.kind==='service'?'service':edit?'product':kind} {...(edit?{review:edit}:{})} onClose={()=>{setCreating(false);setEdit(null);}}/>}
  </section>;
}