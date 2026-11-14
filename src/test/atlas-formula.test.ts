import {describe,it,expect} from 'vitest';
import {BRANDS,COUNTRIES,REGIONS,searchAtlas,shoppingStatus} from '@/lib/atlas';
import {FORMULAS,canvasInsights} from '@/lib/formula';
import {PRODUCTS} from '@/lib/data';
describe('Atlas catalog rules',()=>{
 it('keeps the seven requested regions in order',()=>expect(REGIONS.map(r=>r.name)).toEqual(['Africa','Caribbean','Latin America','Asia','Europe','North America','Oceania']));
 it('uses one country record across cultural regions',()=>{expect(COUNTRIES.filter(c=>c.id==='dominican-republic')).toHaveLength(1);expect(COUNTRIES.find(c=>c.id==='dominican-republic')?.regions).toEqual(['caribbean','latin-america']);});
 it('searches countries, brands and products',()=>{expect(searchAtlas('Haiti').countries.map(c=>c.id)).toContain('haiti');expect(searchAtlas('COSRX').brands.map(b=>b.id)).toContain('cosrx');expect(searchAtlas('Squalane').products.map(p=>p.id)).toContain('squalane');});
 it('does not turn a store link into a shipping claim',()=>{const b=BRANDS.find(b=>b.id==='the-ordinary');if(!b)throw new Error('Missing brand');expect(b.shoppingLinks.length).toBe(1);expect(shoppingStatus(b,'united-states')).toBe('Availability Not Confirmed');});
 it('links each existing product to one canonical brand',()=>PRODUCTS.forEach(p=>expect(BRANDS.filter(b=>b.productIds.includes(p.id))).toHaveLength(1)));
});
describe('formula rules',()=>{
 it('uses the published single-ingredient squalane INCI',()=>expect(FORMULAS['squalane']?.inci).toBe('Squalane.'));
 it('does not invent ingredients for a sample product',()=>expect(FORMULAS['lumiere-gel-cleanser']).toBeUndefined());
 it('limits canvas observations to three and uses existing sensitive skin answers',()=>{const p=PRODUCTS.find(p=>p.id==='skin-tint');if(!p)throw new Error('Missing product');const notes=canvasInsights(p,{depth:'Deep',undertone:'Neutral',skinType:'Sensitive',fragrance:'Avoid fragrance',exclusions:'aloe'});expect(notes.length).toBeLessThanOrEqual(3);expect(notes.some(n=>n.includes('small patch'))).toBe(true);expect(notes.some(n=>n.includes('Deep Neutral'))).toBe(true);});
});
