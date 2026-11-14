import { describe, expect, it } from 'vitest';
import { mediaError, postSchema, MAX_MEDIA_BYTES, compareCategory } from '@/lib/community';
import { tabPosts } from '@/lib/feed-tabs';
import { FEED } from '@/lib/data';
const input={caption:'Finished my cleanser',author:'Creator',kind:'Empty Bottle' as const,product_id:'cerave-hydrating-cleanser',brand_id:'cerave',media_path:'owner/photo.jpg',media_type:'image' as const,country_id:'united-states',duration_weeks:8,repurchase:true,disclosure:'Not sponsored' as const};
describe('beauty publishing and collections',()=>{
 it('accepts photo and video publishing',()=>{expect(mediaError({type:'image/jpeg',size:500})).toBeNull();expect(mediaError({type:'video/mp4',size:1000})).toBeNull();expect(mediaError({type:'text/html',size:500})).not.toBeNull();});
 it('rejects oversized media',()=>{expect(mediaError({type:'video/mp4',size:MAX_MEDIA_BYTES+1})).not.toBeNull();});
 it('requires product lifespan and repurchase decision for empty bottle reviews',()=>{expect(postSchema.safeParse(input).success).toBe(true);for(const field of ['product_id','duration_weeks','repurchase'])expect(postSchema.safeParse({...input,[field]:null}).success).toBe(false);});
 it('supports tutorial publishing without product tags',()=>{expect(postSchema.safeParse({...input,kind:'Tutorial',product_id:null,duration_weeks:null,repurchase:null}).success).toBe(true);});
 it('following shows only followed creators or brands',()=>{expect(tabPosts(FEED,'Following',[],['@nia.bare'],'united-states').map(p=>p.id)).toEqual(['p1']);expect(tabPosts(FEED,'Following',[],[],'united-states')).toHaveLength(0);});
 it('does not relabel wear tests as tutorials',()=>{expect(tabPosts(FEED,'Tips',[],[],'united-states')).toHaveLength(0);});
 it('distinguishes comparable categories',()=>{expect(compareCategory({category:'Hair'},{category:'Hair'})).toBe(true);expect(compareCategory({category:'Hair'},{category:'Makeup'})).toBe(false);});
});