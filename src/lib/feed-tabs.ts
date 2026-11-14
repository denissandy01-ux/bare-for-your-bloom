import type { FeedPost } from './data';
import { productById } from './data';
import { brandForProduct, type RegionId } from './atlas';
export const FEED_TABS = ['For You','Following','Explore','Global'] as const;
export type FeedTab = typeof FEED_TABS[number];
export const EXPLORE_TOPICS = ['All','Skin','Hair','Makeup','Nails','Learn'] as const;
export type ExploreTopic = typeof EXPLORE_TOPICS[number];
const TOPIC_OF: Record<string, ExploreTopic> = { Skincare:'Skin', Body:'Skin', Beard:'Hair', Hair:'Hair', Makeup:'Makeup', Nails:'Nails' };
export function topicForCategory(category: string): ExploreTopic | undefined {
 if (TOPIC_OF[category]) return TOPIC_OF[category];
 if (/nail/i.test(category)) return 'Nails';
 if (/brow|lash|makeup/i.test(category)) return 'Makeup';
 if (/facial|skin|esthet/i.test(category)) return 'Skin';
 if (/hair|braid|loc|blowout|barber|cut|salon/i.test(category)) return 'Hair';
 return undefined;
}
export function postTopic(p: FeedPost) { const pr = productById(p.productId); return pr ? topicForCategory(pr.category) : undefined; }
/** Learn only holds explicit tutorials; wear tests are never relabelled. */
export function topicMatches(topic: ExploreTopic, own: ExploreTopic | undefined, isTutorial = false) {
 if (topic === 'All') return true; if (topic === 'Learn') return isTutorial; return own === topic;
}
export function matchesSearch(q: string, ...fields: (string | undefined)[]) {
 const t = q.trim().toLowerCase(); if (!t) return true; return fields.some(f => f?.toLowerCase().includes(t));
}
export function postSearchText(p: FeedPost) { const pr = productById(p.productId); return [p.caption, p.creator.handle, p.wearTest, p.creator.hair, pr?.name, pr?.brand, pr?.category, pr?.sub]; }
export interface FeedFilter { topic?: ExploreTopic; region?: RegionId | 'all'; query?: string }
export function tabPosts(posts: FeedPost[], tab: FeedTab, followedBrands: string[], followedCreators: string[], country: string, f: FeedFilter = {}) {
 return posts.filter(p => {
  const brand=brandForProduct(p.productId);
  if (!matchesSearch(f.query ?? '', ...postSearchText(p))) return false;
  if(tab==='Following')return followedCreators.includes(p.creator.handle) || (!!brand && followedBrands.includes(brand.id));
  if(tab==='Global'){ if(!brand||brand.countryId===country) return false; return !f.region||f.region==='all'||brand.regions.includes(f.region); }
  if(tab==='Explore')return topicMatches(f.topic ?? 'All', postTopic(p));
  return true;
 });
}
