import { z } from 'zod';
export const POST_KINDS = ['Experience', 'Tutorial', 'Empty Bottle'] as const;
export const MAX_MEDIA_BYTES = 50 * 1024 * 1024;
export const postSchema = z.object({
  title: z.string().trim().max(120).default(''),
  destination: z.enum(['Feed', 'Learn']).default('Feed'),
  product_ids: z.array(z.string().max(100)).max(12).default([]),
  specialist_ids: z.array(z.string().max(100)).max(12).default([]),
  people_tags: z.array(z.object({ id: z.string().uuid(), name: z.string().trim().min(1).max(80) })).max(12).default([]),
  service_credit: z.string().trim().max(120).default(''),
  review_id: z.string().uuid().nullable().optional(),
  caption: z.string().trim().min(1).max(2000), author: z.string().trim().min(1).max(80),
  kind: z.enum(POST_KINDS), product_id: z.string().nullable(), brand_id: z.string().nullable(),
  media_path: z.string(), media_type: z.enum(['image', 'video', 'text']), country_id: z.string().min(1),
  duration_weeks: z.number().int().min(1).max(520).nullable(), repurchase: z.boolean().nullable(),
  disclosure: z.enum(['Not sponsored', 'Paid partnership', 'Own product']),
}).superRefine((v, ctx) => {
  if (v.media_type !== 'text' && !v.media_path) ctx.addIssue({ code: 'custom', message: 'Choose a photo or video.' });
  if (v.media_type === 'text' && !v.title) ctx.addIssue({ code: 'custom', message: 'Give your story a title.' });
  if (v.kind === 'Empty Bottle' && (!v.product_id || v.duration_weeks === null || v.repurchase === null)) ctx.addIssue({ code: 'custom', message: 'Choose the finished product, weeks used and repurchase decision.' });
});
export function mediaError(file: { type: string; size: number }) {
  if (!['image/jpeg','image/png','image/webp','video/mp4','video/webm','video/quicktime'].includes(file.type.split(';')[0] ?? '')) return 'Choose a JPG, PNG, WebP, MP4, WebM or MOV file.';
  if (file.size > MAX_MEDIA_BYTES) return 'Choose a file smaller than 50 MB.';
  if (file.size === 0) return 'This file is empty.';
  return null;
}
export const NOTIFICATION_TOPICS = { community: 'Your community', brands: 'Brands you follow', global: 'Global discoveries', prices: 'Saved product updates', empties: 'Empty Bottle Club' } as const;
export type NotificationTopic = keyof typeof NOTIFICATION_TOPICS;
export interface EmptyBottle { id: string; productId: string; weeks: number; repurchase: boolean; note: string; date: string }
export function compareCategory(a: { category: string }, b: { category: string }) { return a.category === b.category; }