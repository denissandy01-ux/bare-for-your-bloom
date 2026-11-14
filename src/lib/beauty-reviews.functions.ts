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
  const author = String(context.claims['user_metadata'] && typeof context.claims['user_metadata'] === 'object' ? (context.claims['user_metadata'] as Record<string,unknown>)['display_name'] || 'Bare community' : 'Bare community');
  const query = id ? context.supabase.from('beauty_reviews').update(fields).eq('id',id).eq('owner_id',context.userId) : context.supabase.from('beauty_reviews').insert({...fields,owner_id:context.userId,author});
  const {data:row,error} = await query.select('*').single();
  if(error) throw new Error(error.message);
  return row;
});
export const removeBeautyReview = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.string().uuid()).handler(async({data,context})=>{
  const {error} = await context.supabase.from('beauty_reviews').delete().eq('id',data).eq('owner_id',context.userId);
  if(error) throw new Error(error.message);
});