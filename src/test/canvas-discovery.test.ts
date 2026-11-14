import { describe, expect, it } from 'vitest';
import { browsingCanvas, skinTags, fitScore, feedForTone, productById, productGroup, matchesPrice, matchesStore, type Profile } from '@/lib/data';
import { canvasInsights } from '@/lib/formula';
import { disciplineFilters, findSpecialists } from '@/lib/specialists';

const saved: Profile = { depth: 'Deep', undertone: 'Neutral', skinTypes: ['Combination', 'Sensitive', 'Reactive / easily irritated'] };
describe('canvas and discovery choices', () => {
  it('retains combination, sensitivity and irritation together', () => {
    expect(skinTags(saved)).toEqual(['Combination', 'Sensitive', 'Reactive / easily irritated']);
  });
  it('temporary browsing never mutates the saved canvas', () => {
    const guest: Profile = { depth: 'Fair', undertone: 'Cool' };
    expect(browsingCanvas(saved, guest).depth).toBe('Fair');
    expect(saved.depth).toBe('Deep');
    expect(browsingCanvas(saved, null)).toEqual(saved);
  });
  it('keeps old single-choice profiles and allows clearing all choices', () => {
    expect(skinTags({ depth: 'Deep', undertone: 'Neutral', skinType: 'Dry' })).toEqual(['Dry']);
    expect(skinTags({ depth: 'Deep', undertone: 'Neutral', skinType: 'Dry', skinTypes: [] })).toEqual([]);
  });
  it('recognizes sensitivity even when combination is also selected', () => {
    const p = productById('squalane'); if (!p) throw new Error('Missing product');
    expect(canvasInsights(p, saved).some(n => n.includes('small patch'))).toBe(true);
  });
  it('skin fit considers all selected tags', () => {
    const p = productById('calm-barrier-cream'); if (!p) throw new Error('Missing product');
    expect(fitScore(p, {handle:'sample',depth:'Deep',undertone:'Neutral',skinType:'Sensitive',hair:''}, saved)).toBe(92);
  });
  it('hair filters ignore unrelated skin tone', () => {
    expect(disciplineFilters('Hair')).toEqual({depth:false,hair:true});
    expect(findSpecialists({query:'',discipline:'Hair',radius:50,depth:'Fair',hair:'4C Coily'}).map(x=>x.specialist.id)).toContain('amara-reed');
  });
  it('nail discovery ignores unrelated hair filters', () => {
    expect(findSpecialists({query:'',discipline:'Nails',radius:50,hair:'4C Coily'}).length).toBe(2);
  });
  it('skin discovery hides hair and makeup retains complexion', () => {
    expect(disciplineFilters('Skin')).toEqual({depth:true,hair:false});
    expect(disciplineFilters('Makeup')).toEqual({depth:true,hair:false});
  });
  it('matching hair appears regardless of depth', () => {
    const p = productById('leave-in-conditioner'); if (!p) throw new Error('Missing product');
    const post = {id:'sample',productId:p.id,media:'',wearTest:'',caption:'',swatches:0,creator:{handle:'sample',depth:'Deep' as const,undertone:'Cool' as const,skinType:'Dry',hair:'4C Coily'}};
    expect(feedForTone([post],{depth:'Fair',undertone:'Cool',hair:'4C Coily'})).toHaveLength(1);
  });
  it('places tint in face and sun protection in sun care', () => {
    const tint=productById('skin-tint'), sun=productById('cosrx-aloe-spf50'); if (!tint || !sun) throw new Error('Missing product');
    expect(productGroup(tint)).toBe('Face'); expect(productGroup(sun)).toBe('Sun Care');
  });
  it('uses explicit prices and recorded stores only', () => {
    const p=productById('cosrx-aloe-spf50'); if (!p) throw new Error('Missing product');
    expect(matchesPrice(p,'Under $15')).toBe(true);
    expect(matchesPrice(p,'$15–$35')).toBe(false);
    expect(matchesStore(p,'Drugstore')).toBe(true);
    expect(matchesStore(p,'Beauty Supply')).toBe(false);
  });
});