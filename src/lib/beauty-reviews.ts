import { z } from 'zod';
import { productById } from './data';
import { specialistById } from './specialists';
import type { Database } from '@/integrations/supabase/types';
import type { DiscoveryReview, PublishedPost } from './discover-reviews';
import { productReviews } from './discover-reviews';

export type BeautyReview = Database['public']['Tables']['beauty_reviews']['Row'] & { url?: string };
export const reviewSchema = z.object({
  id: z.string().uuid().optional(), kind: z.enum(['product', 'service']),
  product_id: z.string().nullable(), specialist_id: z.string().nullable(),
  service: z.string().trim().max(200).default(''), rating: z.number().int().min(1).max(5),
  decision: z.enum(['Yes', 'Maybe', 'No']), finished: z.boolean(),
  experience: z.string().trim().max(2000), media_path: z.string().nullable(),
  media_type: z.enum(['image', 'video']).nullable(), status: z.enum(['private', 'draft', 'published']),
}).superRefine((r, ctx) => {
  if (r.kind === 'product' ? !r.product_id || !productById(r.product_id) || r.specialist_id !== null : !r.specialist_id || !specialistById(r.specialist_id) || r.product_id !== null || !r.service || r.finished) ctx.addIssue({ code: 'custom', message: 'Choose a product or a specialist and service received.' });
  if ((r.media_path === null) !== (r.media_type === null)) ctx.addIssue({ code: 'custom', message: 'Check your media attachment.' });
});
export function toDiscoveryReview(r: BeautyReview): DiscoveryReview {
  return { id: r.id, author: r.author, text: r.experience, kind: r.kind === 'service' ? 'service' : r.finished ? 'empty' : 'product',
    ...(r.product_id ? { productId: r.product_id } : {}), ...(r.specialist_id ? { specialistId: r.specialist_id } : {}),
    ...(r.rating ? { rating: r.rating } : {}), ...(r.decision ? { decision: r.decision as 'Yes' | 'Maybe' | 'No' } : {}),
    ...(r.kind === 'service' && r.decision ? { bookAgain: r.decision as 'Yes' | 'Maybe' | 'No' } : {}),
    service: r.service, ...(r.url ? {url:r.url} : {}), ...(r.media_type ? {mediaType:r.media_type} : {}), date: r.created_at };
}
export function publishedReviews(rows: BeautyReview[], posts: PublishedPost[] = []): DiscoveryReview[] {
  const publicRows = rows.filter(r => r.status === 'published');
  const linked = new Set(publicRows.map(r => r.legacy_post_id).filter(Boolean));
  return [...publicRows.map(toDiscoveryReview), ...productReviews(posts.filter(p => !p.review_id && !linked.has(p.id)))].sort((a,b) => b.date.localeCompare(a.date));
}
export function emptyInsights(reviews: DiscoveryReview[]) {
  const finished = reviews.filter(r => r.kind === 'empty');
  const votes = finished.flatMap(r => r.decision === 'Yes' || r.decision === 'No' ? [r.decision] : r.repurchase !== undefined ? [r.repurchase ? 'Yes' : 'No'] : []);
  return { count: finished.length, eligible: votes.length, repurchase: votes.length ? Math.round(votes.filter(v => v === 'Yes').length / votes.length * 100) : null };
}