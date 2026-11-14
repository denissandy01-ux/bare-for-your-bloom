import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { reviewSchema } from './beauty-reviews';

export const saveBeautyReview = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(reviewSchema).handler(async ({data,context}) => {
  if (data.media_path) {
    if (!data.media_path.startsWith(`${context.userId}/`)) throw new Error('This attachment does not belong to you.');
    const name = data.media_path.slice(context.userId.length + 1);
    if (!name || name.includes('/')) throw new Error('Invalid attachment.');
    const {data:files,error} = await context.supabase.storage.from('beauty-posts').list(context.userId,{search:name});
    if (error || !files?.some(f => f.name === name)) throw new Error('Upload your attachment first.');
  }
  const {id,...fields} = data;
  if(id && data.status !== 'published') {
    const {data:existing,error:readError}=await context.supabase.from('beauty_reviews').select('legacy_post_id').eq('id',id).eq('owner_id',context.userId).single();
    if(readError) throw new Error('Review not found in your account.');
    if(existing.legacy_post_id) throw new Error('This review is also an existing published Feed post. Remove that post in Create before saving a private replacement.');
    const {data:shares}=await context.supabase.from('beauty_posts').select('id').eq('review_id',id).eq('owner_id',context.userId).limit(1);
    if(shares?.length) throw new Error('Remove the shared Feed post in Create before making this review private.');
  }
  const author = String(context.claims['user_metadata'] && typeof context.claims['user_metadata'] === 'object' ? (context.claims['user_metadata'] as Record<string,unknown>)['display_name'] || 'Bare community' : 'Bare community');
  const query = id ? context.supabase.from('beauty_reviews').update(fields).eq('id',id).eq('owner_id',context.userId) : context.supabase.from('beauty_reviews').insert({...fields,owner_id:context.userId,author});
  const {data:row,error} = await query.select('*').single();
  if(error) throw new Error(error.message);
  return row;
});
export const removeBeautyReview = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.string().uuid()).handler(async({data,context})=>{
  const {data:review}=await context.supabase.from('beauty_reviews').select('legacy_post_id').eq('id',data).eq('owner_id',context.userId).single();
  if(!review)throw new Error('Review not found in your account.');
  if(review.legacy_post_id){const {error}=await context.supabase.from('beauty_posts').delete().eq('id',review.legacy_post_id).eq('owner_id',context.userId);if(error)throw new Error(error.message);return;}
  const {error} = await context.supabase.from('beauty_reviews').delete().eq('id',data).eq('owner_id',context.userId);
  if(error) throw new Error(error.message);
});