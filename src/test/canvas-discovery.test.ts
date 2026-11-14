import { describe, expect, it } from 'vitest';
import { matchesCanvasProduct, matchesCanvasSpecialist } from '../lib/canvas-discovery';
import { PRODUCTS, type Profile } from '../lib/data';
import { SPECIALISTS } from '../lib/specialists';
const canvas: Profile = { depth: 'Deep', undertone: 'Neutral', skinTypes: ['Sensitive'], hair: '4C Coily' };
describe('Canvas discovery', () => {
  it('uses recorded skin needs, not unrelated skin tone for skin care', () => {
    const p = PRODUCTS.find(p => p.id === 'calm-barrier-cream');
    if (!p) throw new Error('Missing fixture');
    expect(matchesCanvasProduct(p, canvas)).toBe(true);
    expect(matchesCanvasProduct(p, {...canvas, skinTypes: ['Oily']})).toBe(false);
  });
  it('does not turn an unknown nail product into a compatibility match', () => {
    const p = PRODUCTS[0];
    if (!p) throw new Error('Missing fixture');
    expect(matchesCanvasProduct({...p, category: 'Nails'}, canvas)).toBe(false);
  });
  it('matches hair services using recorded texture without excluding by skin tone', () => {
    const s = SPECIALISTS.find(s => s.id === 'amara-reed');
    if (!s) throw new Error('Missing fixture');
    expect(matchesCanvasSpecialist(s, canvas)).toBe(true);
    expect(matchesCanvasSpecialist(s, {...canvas, hair: 'Traditional locs'})).toBe(false);
  });
});