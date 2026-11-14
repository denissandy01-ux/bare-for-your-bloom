import { describe, expect, it } from 'vitest';
import { postSchema, mediaError } from '@/lib/community';
const base={caption:'A gentle skincare guide',title:'My routine',author:'Creator',kind:'Experience',product_id:null,brand_id:null,media_path:'',media_type:'text',country_id:'united-states',duration_weeks:null,repurchase:null,disclosure:'Not sponsored'};
describe('focused Create rules',()=>{
  it('supports written posts without mandatory media',()=>expect(postSchema.safeParse(base).success).toBe(true));
  it('requires a title for written stories',()=>expect(postSchema.safeParse({...base,title:''}).success).toBe(false));
  it('requires media for photo and video posts',()=>{for(const type of ['image','video'])expect(postSchema.safeParse({...base,media_type:type}).success).toBe(false);});
  it('allows both Feed and Learn destinations',()=>{for(const destination of ['Feed','Learn'])expect(postSchema.parse({...base,destination}).destination).toBe(destination);expect(postSchema.safeParse({...base,destination:'Shop'}).success).toBe(false);});
  it('supports multiple products and specialists without duplicating posts',()=>{const result=postSchema.parse({...base,product_ids:['skin-tint','squalane'],specialist_ids:['maya-lin','sofia-reyes']});expect(result.product_ids).toEqual(['skin-tint','squalane']);expect(result.specialist_ids).toHaveLength(2);});
  it('accepts browser-recorded WebM with codec metadata',()=>expect(mediaError({type:'video/webm;codecs=vp9,opus',size:1000})).toBeNull());
});