import { supabase } from '@/integrations/supabase/client';
import type { BeautyReview } from './beauty-reviews';
export function beautyReviewsOptions(owner?: string) {
  return {queryKey: ['beauty-reviews', owner ?? 'published'], queryFn: async (): Promise<BeautyReview[]> => {
    let query = supabase.from('beauty_reviews').select('*').order('created_at',{ascending:false});
    query = owner ? query.eq('owner_id',owner) : query.eq('status','published');
    const {data,error} = await query;
    if(error) throw new Error(error.message);
    const rows = data ?? [], paths = rows.flatMap(r => r.media_path ? [r.media_path] : []);
    if(!paths.length) return rows;
    const {data:urls,error:mediaError} = await supabase.storage.from('beauty-posts').createSignedUrls(paths,3600);
    if(mediaError) throw new Error(mediaError.message);
    return rows.map(r => ({...r,url:urls?.find(u => u.path === r.media_path)?.signedUrl ?? ''}));
  }, staleTime: 30_000};
}