import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const pathsSchema = z.object({ paths: z.array(z.string().regex(/^[0-9a-f-]{36}\/[A-Za-z0-9._-]{1,200}$/)).max(200) });

// Signs media only for published posts/reviews whose owner uploaded the file.
export const signPublishedMedia = createServerFn({ method: 'POST' }).inputValidator(pathsSchema).handler(async ({ data }) => {
  const paths = [...new Set(data.paths)];
  if (!paths.length) return [] as { path: string; signedUrl: string }[];
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const [posts, reviews] = await Promise.all([
    supabaseAdmin.from('beauty_posts').select('media_path, owner_id').in('media_path', paths),
    supabaseAdmin.from('beauty_reviews').select('media_path, owner_id').eq('status', 'published').in('media_path', paths),
  ]);
  if (posts.error || reviews.error) throw new Error('Media could not be loaded.');
  const allowed = new Set([...(posts.data ?? []), ...(reviews.data ?? [])]
    .filter(r => r.media_path && r.media_path.split('/')[0] === r.owner_id).map(r => r.media_path as string));
  const ok = paths.filter(p => allowed.has(p));
  if (!ok.length) return [];
  const { data: urls, error } = await supabaseAdmin.storage.from('beauty-posts').createSignedUrls(ok, 3600);
  if (error) throw new Error('Media could not be loaded.');
  return (urls ?? []).flatMap(u => u.path && u.signedUrl ? [{ path: u.path, signedUrl: u.signedUrl }] : []);
});
