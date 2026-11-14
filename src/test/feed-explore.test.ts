import { describe, expect, it } from 'vitest';
import { FEED, feedForTone, lifeStageBoost, productById } from '@/lib/data';
import { FEED_TABS, tabPosts, topicForCategory, postTopic } from '@/lib/feed-tabs';
import { brandForProduct } from '@/lib/atlas';

describe('feed tabs', () => {
  it('orders tabs For You, Following, Explore, Global', () => { expect([...FEED_TABS]).toEqual(['For You','Following','Explore','Global']); });
  it('Explore ignores the canvas and shows everyone', () => { expect(tabPosts(FEED,'Explore',[],[],'united-states')).toHaveLength(FEED.length); });
  it('Explore Hair only shows hair posts', () => { const r=tabPosts(FEED,'Explore',[],[],'united-states',{topic:'Hair'}); expect(r.length).toBeGreaterThan(0); expect(r.every(p=>postTopic(p)==='Hair')).toBe(true); });
  it('Learn never relabels wear tests', () => { expect(tabPosts(FEED,'Explore',[],[],'united-states',{topic:'Learn'})).toHaveLength(0); });
  it('maps service categories to topics', () => { expect(topicForCategory('Nails')).toBe('Nails'); expect(topicForCategory('Braids')).toBe('Hair'); expect(topicForCategory('Brows')).toBe('Makeup'); });
  it('Global region bubble keeps only brands from that region', () => { const r=tabPosts(FEED,'Global',[],[],'united-states',{region:'asia'}); expect(r.every(p=>brandForProduct(p.productId)?.regions.includes('asia'))).toBe(true); });
  it('search matches brand names', () => { const r=tabPosts(FEED,'Explore',[],[],'united-states',{query:'cosrx'}); expect(r.length).toBeGreaterThan(0); expect(r.every(p=>productById(p.productId)?.brand==='COSRX')).toBe(true); });
});
describe('private life stage', () => {
  it('only nudges ranking when stages match and is zero otherwise', () => {
    expect(lifeStageBoost({ageStage:'55+'},{depth:'Deep',undertone:'Neutral',ageStage:'55+'})).toBe(5);
    expect(lifeStageBoost({ageStage:'25–34'},{depth:'Deep',undertone:'Neutral',ageStage:'55+'})).toBe(0);
    expect(lifeStageBoost({},{depth:'Deep',undertone:'Neutral'})).toBe(0);
  });
  it('does not remove posts from For You', () => { const p={depth:'Deep' as const,undertone:'Neutral' as const}; expect(feedForTone(FEED,{...p,ageStage:'55+'}).length).toBe(feedForTone(FEED,p).length); });
});
