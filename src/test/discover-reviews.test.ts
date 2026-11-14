import { describe, expect, it } from 'vitest';
import { productReviews, ratingSummary, serviceReviews, type PublishedPost } from '@/lib/discover-reviews';
import { matchesCategory, productTypes } from '@/lib/discover-catalog';
import { PRODUCTS } from '@/lib/data';
const post: PublishedPost = { id: 'published', author: 'Creator', kind: 'Empty Bottle', product_id: 'skin-tint', caption: 'Finished it', duration_weeks: 8, repurchase: true, media_type: 'image', url: '', created_at: '2026-11-14' };
describe('Discover published reviews', () => {
  it('returns no reviews when no published records exist', () => expect(productReviews([])).toEqual([]));
  it('preserves a published finished-product review and repurchase decision', () => expect(productReviews([post], 'skin-tint')[0]).toMatchObject({ id: 'published', kind: 'empty', weeks: 8, repurchase: true }));
  it('keeps product reviews attached to the correct product', () => expect(productReviews([post], 'squalane')).toEqual([]));
  it('keeps general experiences separate from finished-product reviews', () => expect(productReviews([{ ...post, kind: 'Experience' }])[0]?.kind).toBe('product'));
  it('does not invent missing star ratings', () => expect(ratingSummary(productReviews([post]))).toBeNull());
  it('never counts a tutorial as a product review', () => expect(productReviews([{ ...post, kind: 'Tutorial' }])).toEqual([]));
  it('only reads service reviews for the requested specialist', () => expect(serviceReviews([{ id: 'one', kind: 'service', specialistId: 'maya-lin', author: 'A', text: 'Visit', date: '' }], ['imani-brooks'])).toEqual([]));
});
describe('progressive product discovery', () => {
  it('offers Concealer under Makeup Face', () => expect(productTypes('Makeup', 'Face', PRODUCTS)).toContain('Concealer'));
  it('does not mutate catalog shade-specific categories', () => { const tint = PRODUCTS.find(p => p.id === 'skin-tint'); if (!tint) throw new Error('Missing tint'); expect(matchesCategory(tint, 'Makeup', 'Face', 'Concealer')).toBe(false); expect(matchesCategory(tint, 'Makeup', 'Face', 'Skin Tint')).toBe(true); });
});
