/** Only the public beauty_posts publication stream is accepted here, never local logs. */
export interface PublishedPost {
  review_id?: string | null;
  id: string; author: string; kind: string; product_id: string | null;
  caption: string; duration_weeks: number | null; repurchase: boolean | null;
  media_type: string; url: string; created_at: string;
}
export interface DiscoveryReview {
  id: string; author: string; text: string; productId?: string; specialistId?: string;
  kind: 'product' | 'empty' | 'service'; weeks?: number; repurchase?: boolean;
  rating?: number; service?: string; bookAgain?: 'Yes' | 'Maybe' | 'No';
  decision?: 'Yes' | 'Maybe' | 'No';
  mediaType?: string; url?: string; date: string;
}
export function productReviews(posts: PublishedPost[], productId?: string): DiscoveryReview[] {
  return posts.flatMap(post => {
    if (!post.product_id || (productId && post.product_id !== productId)) return [];
    if (post.kind !== 'Experience' && post.kind !== 'Empty Bottle') return [];
    if (post.kind === 'Empty Bottle' && (post.duration_weeks === null || post.repurchase === null)) return [];
    return [{ id: post.id, author: post.author, text: post.caption, productId: post.product_id,
      kind: post.kind === 'Empty Bottle' ? 'empty' as const : 'product' as const,
      ...(post.duration_weeks !== null ? { weeks: post.duration_weeks } : {}),
      ...(post.repurchase !== null ? { repurchase: post.repurchase } : {}),
      url: post.url, mediaType: post.media_type, date: post.created_at }];
  });
}
/** Service publication is not connected; do not convert sample feed posts into reviews. */
export const publishedServiceReviews: DiscoveryReview[] = [];
export function serviceReviews(reviews: DiscoveryReview[], ids: string[]) {
  return reviews.filter(review => review.kind === 'service' && !!review.specialistId && ids.includes(review.specialistId));
}
export function ratingSummary(reviews: DiscoveryReview[]) {
  const ratings = reviews.flatMap(r => typeof r.rating === 'number' && r.rating >= 1 && r.rating <= 5 ? [r.rating] : []);
  if (!ratings.length) return null;
  return { count: ratings.length, average: ratings.reduce((sum, n) => sum + n, 0) / ratings.length,
    distribution: [5, 4, 3, 2, 1].map(stars => ({ stars, count: ratings.filter(n => Math.round(n) === stars).length })) };
}