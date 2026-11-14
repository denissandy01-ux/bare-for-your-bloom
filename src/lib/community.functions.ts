import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { postSchema } from './community';
export const publishPost = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(postSchema).handler(async ({ data, context }) => {
  if (!data.media_path.startsWith(`${context.userId}/`)) throw new Error('This media does not belong to your account.');
  const path = data.media_path.slice(context.userId.length + 1);
  if (!path || path.includes('/')) throw new Error('Invalid media path.');
  const { data: files, error: fileError } = await context.supabase.storage.from('beauty-posts').list(context.userId, { search: path });
  if (fileError || !files?.some(f => f.name === path)) throw new Error('Upload your media before publishing.');
  const { data: post, error } = await context.supabase.from('beauty_posts').insert({ ...data, owner_id: context.userId }).select('id').single();
  if (error) throw new Error(error.message);
  return post;
});
export const removePost = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(z.string().uuid()).handler(async ({ data, context }) => {
  const { data: post, error } = await context.supabase.from('beauty_posts').select('media_path').eq('id', data).eq('owner_id', context.userId).single();
  if (error || !post) throw new Error('Post not found in your account.');
  const result = await context.supabase.from('beauty_posts').delete().eq('id', data).eq('owner_id', context.userId);
  if (result.error) throw new Error(result.error.message);
  const {data:reviews} = await context.supabase.from('beauty_reviews').select('id').eq('media_path',post.media_path).limit(1);
  if(!reviews?.length) await context.supabase.storage.from('beauty-posts').remove([post.media_path]);
});