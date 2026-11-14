import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Star, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PRODUCTS, productById } from '@/lib/data';
import { SPECIALISTS, specialistById } from '@/lib/specialists';
import { useAccount } from '@/lib/account';
import { useBare } from '@/lib/store';
import { useCollection } from '@/lib/collection';
import { mediaError } from '@/lib/community';
import { supabase } from '@/integrations/supabase/client';
import { saveBeautyReview } from '@/lib/beauty-reviews.functions';
import { reviewSchema, type BeautyReview } from '@/lib/beauty-reviews';

export function ReviewEditor({ kind, productId, specialistId, serviceName, review, onClose }: {kind:'product'|'service'; productId?:string; specialistId?:string; serviceName?:string; review?:BeautyReview; onClose:()=>void}) {
  const {user} = useAccount(), {state,toggleOwned} = useBare(), collection = useCollection(user?.id);
  const save = useServerFn(saveBeautyReview), qc = useQueryClient();
  const [item,setItem] = useState(review?.product_id ?? review?.specialist_id ?? productId ?? specialistId ?? (kind==='product' ? state.ownedProducts[0] ?? PRODUCTS[0]?.id : SPECIALISTS[0]?.id) ?? '');
  const [service,setService] = useState(review?.service ?? serviceName ?? ''), [rating,setRating] = useState(review?.rating ?? 0), [decision,setDecision] = useState(review?.decision ?? ''), [finished,setFinished] = useState(review?.finished ?? false), [text,setText] = useState(review?.experience ?? '');
  const [file,setFile] = useState<File|null>(null), [busy,setBusy] = useState(false), [published,setPublished] = useState<BeautyReview|null>(null);
  const product = kind==='product' ? productById(item) : undefined, specialist = kind==='service' ? specialistById(item) : undefined;
  async function submit(status:'private'|'published'|'draft') {
    if(!user || busy) return;
    const parsed = reviewSchema.safeParse({id:review?.id,kind,product_id:kind==='product'?item:null,specialist_id:kind==='service'?item:null,service,rating,decision,finished:kind==='product'&&finished,experience:text,media_path:review?.media_path ?? null,media_type:review?.media_type ?? null,status});
    if(!parsed.success){toast.error(parsed.error.issues[0]?.message ?? 'Choose a rating and answer.');return;}
    setBusy(true); let uploaded:string|null=null;
    try {
      const fields = parsed.data;
      if(file){const ext=file.name.split('.').pop()?.replace(/[^a-z0-9]/gi,'') || 'bin';uploaded=`${user.id}/${crypto.randomUUID()}.${ext}`;const {error}=await supabase.storage.from('beauty-posts').upload(uploaded,file,{contentType:file.type});if(error)throw error;fields.media_path=uploaded;fields.media_type=file.type.startsWith('video/')?'video':'image';}
      const row = await save({data:fields});
      if(kind==='product'&&finished){if(!state.ownedProducts.includes(item))toggleOwned(item);collection.setStatus(item,'Finished');}
      await qc.invalidateQueries({queryKey:['beauty-reviews']});
      toast.success(status==='published'?'Review published':status==='draft'?'Draft saved':'Review saved privately');
      if(status==='published')setPublished(row);else onClose();
    }catch(e){if(uploaded)await supabase.storage.from('beauty-posts').remove([uploaded]);toast.error(e instanceof Error?e.message:'Review could not be saved.');}finally{setBusy(false);}
  }
  return <Dialog open onOpenChange={open=>{if(!open&&!busy)onClose();}}><DialogContent className="me-surface max-h-[85dvh] overflow-y-auto"><DialogHeader><DialogTitle className="font-display text-2xl">{published?'Your review is published':kind==='product'?'Your product review':'Your service review'}</DialogTitle></DialogHeader>{!user?<><p>Sign in to save or publish your reviews.</p><Button asChild><Link to="/auth">Sign in</Link></Button></>:published?<div className="space-y-4"><p className="text-sm text-muted-foreground">Your experience is now visible in Discover.</p><Button asChild className="w-full"><Link to="/create" search={{review:published.id}}>Share to Feed</Link></Button><Button variant="outline" className="w-full" onClick={onClose}>Done</Button></div>:<form className="space-y-5" onSubmit={e=>{e.preventDefault();void submit('private');}}>
    <label className="block text-sm">{kind==='product'?'Product':'Specialist / studio'}<select className="bare-input" value={item} disabled={!!productId || !!review} onChange={e=>{setItem(e.target.value);setService('');}}>{kind==='product'?PRODUCTS.map(p=><option key={p.id} value={p.id}>{p.brand} · {p.name}</option>):SPECIALISTS.map(s=><option key={s.id} value={s.id}>{s.name} · {s.studio}</option>)}</select></label>
    {(product||specialist)&&<div className="flex items-center gap-3"><img src={product?.image ?? specialist?.image} alt="" className="h-16 w-16 rounded-lg object-cover"/><p className="font-display text-lg">{product?.name ?? specialist?.studio}</p></div>}
    {kind==='service'&&<label className="block text-sm">Service received<input required className="bare-input" list="review-services" maxLength={200} value={service} onChange={e=>setService(e.target.value)}/><datalist id="review-services">{specialist?.services.map(s=><option key={s.name} value={s.name}/>)}</datalist></label>}
    <fieldset><legend className="text-sm">How would you rate it?</legend><div className="mt-2 flex gap-1">{[1,2,3,4,5].map(n=><Button key={n} type="button" variant="ghost" size="icon" aria-label={`${n} stars`} aria-pressed={rating===n} onClick={()=>setRating(n)}><Star className={`!h-7 !w-7 ${rating>=n?'fill-primary text-primary':'text-muted-foreground'}`}/></Button>)}</div></fieldset>
    <fieldset><legend className="text-sm">{kind==='product'?'Would you repurchase?':'Would you book again?'}</legend><div className="mt-2 grid grid-cols-3 gap-2">{['Yes','Maybe','No'].map(d=><Button type="button" key={d} variant={decision===d?'default':'outline'} aria-pressed={decision===d} onClick={()=>setDecision(d)}>{d}</Button>)}</div></fieldset>
    {kind==='product'&&<label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={finished} onChange={e=>setFinished(e.target.checked)}/>I finished this product</label>}
    <label className="block text-sm">Your experience <span className="text-muted-foreground">(optional)</span><textarea className="bare-input min-h-24" maxLength={2000} value={text} onChange={e=>setText(e.target.value)}/></label>
    <label className="block text-sm"><span className="flex items-center gap-2"><Upload className="h-4 w-4"/>Add Media (optional)</span><input className="mt-2 w-full text-xs" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" onChange={e=>{const f=e.target.files?.[0];if(!f)return;const error=mediaError(f);if(error){toast.error(error);return;}setFile(f);}}/>{review?.media_path&&!file&&<span className="mt-2 block text-xs text-muted-foreground">Existing attachment retained</span>}</label>
    <p className="text-xs text-muted-foreground">Private reviews are visible only to you. Publishing shares your review and attachment in Discover, not the Feed.</p>
    <div className="grid grid-cols-2 gap-2"><Button type="submit" variant="outline" disabled={busy}>Save Privately</Button><Button type="button" disabled={busy} onClick={()=>void submit('published')}>{busy?'Saving…':'Publish Review'}</Button></div><Button type="button" variant="link" disabled={busy} onClick={()=>void submit('draft')}>Save Draft</Button>
  </form>}</DialogContent></Dialog>;
}