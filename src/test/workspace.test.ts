import {describe,it,expect} from 'vitest';
import { canAccessWorkspace,canRespondToLicense,draftSchema,licenseSchema } from '@/lib/workspace';
import { SERVICE_FEED,mixFeed } from '@/lib/service-feed';
describe('creator and brand access',()=>{
 it('does not treat a customer as a brand',()=>expect(canAccessWorkspace([], 'brand')).toBe(false));
 it('keeps creator and brand workspace permissions distinct',()=>expect(canAccessWorkspace(['creator'], 'brand')).toBe(false));
 it('allows only the content owner to respond to a request',()=>expect(canRespondToLicense('creator-a','brand-b','requested')).toBe(false));
 it('does not reopen accepted licensing requests',()=>expect(canRespondToLicense('creator-a','creator-a','accepted')).toBe(false));
 it('requires creator licensing opt-in',()=>expect(draftSchema.safeParse({title:'Braids',caption:'',category:'Hair',disclosure:'Own product',product_name:'',license_available:true}).success).toBe(true));
 it('rejects a free or negative license budget',()=>expect(licenseSchema.safeParse({usage:'Social campaign',days:30,budget:0}).success).toBe(false));
 it('includes nails, salons, braids, blowouts and brows in the feed',()=>expect(SERVICE_FEED.map(p=>p.category)).toEqual(['Nails','Hair','Braids','Blowout','Brows']));
 it('retains product discovery when adding service posts',()=>expect(mixFeed(['spf'],SERVICE_FEED).map(x=>x.kind)).toEqual(['product','service','service','service','service','service']));
});