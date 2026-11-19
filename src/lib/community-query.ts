import { supabase } from '@/integrations/supabase/client';
import { signPublishedMedia } from './public-media.functions';
export const communityOptions = {
  queryKey: ['community-posts'],
  queryFn: async () => {
    const { data, error } = await supabase.from('beauty_posts').select('*').order('created_at', { ascending: false }).limit(100);
    if (error) throw new Error(error.message);
    const posts = data ?? [];
    if (!posts.length) return [];
    const paths=posts.map(p=>p.media_path).filter(Boolean);
    const urls = paths.length ? await signPublishedMedia({ data: { paths } }) : [];
    return posts.map(p => ({ ...p, url: urls?.find(u => u.path === p.media_path)?.signedUrl ?? '' }));
  },
  staleTime: 60_000,
};