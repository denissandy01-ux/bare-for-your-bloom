import type { FeedPost } from './data';
import { brandForProduct } from './atlas';
export const FEED_TABS = ['For You','Following','Global','Tips'] as const;
export function tabPosts(posts: FeedPost[], tab: typeof FEED_TABS[number], followedBrands: string[], followedCreators: string[], country: string) {
 return posts.filter(p => {
  const brand=brandForProduct(p.productId);
  if(tab==='Following')return followedCreators.includes(p.creator.handle) || (!!brand && followedBrands.includes(brand.id));
  if(tab==='Global')return !!brand && brand.countryId!==country;
  if(tab==='Tips')return false;
  return true;
 });
}