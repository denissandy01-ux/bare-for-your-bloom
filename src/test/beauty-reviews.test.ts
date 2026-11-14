import { describe,it,expect } from 'vitest';
import { emptyInsights, publishedReviews, reviewSchema, type BeautyReview } from '@/lib/beauty-reviews';
import type { DiscoveryReview } from '@/lib/discover-reviews';
const form={kind:'product',product_id:'skin-tint',specialist_id:null,service:'',rating:5,decision:'Yes',finished:false,experience:'',media_path:null,media_type:null,status:'private'};
describe('Unified reviews',()=>{
  it('accepts a rating and answer without text, media or weeks',()=>expect(reviewSchema.safeParse(form).success).toBe(true));
  it('requires a rating from 1 to 5',()=>{expect(reviewSchema.safeParse({...form,rating:0}).success).toBe(false);expect(reviewSchema.safeParse({...form,rating:6}).success).toBe(false);});
  it('accepts Maybe as a repurchase response',()=>expect(reviewSchema.safeParse({...form,decision:'Maybe'}).success).toBe(true));
  it('rejects finished-product status for service reviews',()=>expect(reviewSchema.safeParse({...form,kind:'service',product_id:null,specialist_id:'maya-lin',service:'Facial',finished:true}).success).toBe(false));
  it('excludes private and draft records from discovery',()=>{const row={...form,id:'r',owner_id:'u',author:'A',created_at:'2026',legacy_post_id:null} as BeautyReview;expect(publishedReviews([row,{...row,status:'draft'}])).toEqual([]);});
  it('counts finished reviews and excludes Maybe and unfinished answers from repurchase denominator',()=>{const base:DiscoveryReview={id:'r',kind:'empty',author:'A',text:'',date:''};expect(emptyInsights([{...base,decision:'Yes'},{...base,id:'2',decision:'No'},{...base,id:'3',decision:'Maybe'},{...base,id:'4'},{...base,id:'5',kind:'product',decision:'Yes'}])).toEqual({count:4,eligible:2,repurchase:50});});
  it('does not invent a percentage with no eligible answers',()=>expect(emptyInsights([{id:'r',kind:'empty',author:'A',text:'',date:'',decision:'Maybe'}]).repurchase).toBeNull());
  it('does not duplicate migrated published post reviews',()=>{const row={...form,id:'r',owner_id:'u',author:'A',created_at:'2026',legacy_post_id:'post',status:'published'} as BeautyReview;expect(publishedReviews([row],[{id:'post',kind:'Experience',author:'A',caption:'test',product_id:'skin-tint',duration_weeks:null,repurchase:null,media_type:'image',url:'',created_at:'2026'}])).toHaveLength(1);});
});