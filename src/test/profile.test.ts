import { describe, expect, it } from 'vitest';
import { ownedPosts, profileIdentity, profileIdentitySchema } from '@/lib/profile';

describe('real owner profile content', () => {
  it('only shows posts published by the current account', () => {
    expect(ownedPosts([{ id: 'mine', owner_id: 'owner' }, { id: 'another', owner_id: 'someone-else' }], 'owner').map(post => post.id)).toEqual(['mine']);
  });
  it('never shows personal posts when signed out', () => {
    expect(ownedPosts([{ owner_id: 'owner' }], undefined)).toEqual([]);
  });
  it('does not invent profile biography or photo', () => {
    expect(profileIdentity({}, 'real@example.test')).toEqual({ display_name: '', username: 'real', bio: '', avatar_url: '' });
  });
  it('rejects executable avatar URLs', () => {
    expect(profileIdentitySchema.safeParse({ display_name: 'Real Name', username: 'real.name', bio: '', avatar_url: 'javascript:alert(1)' }).success).toBe(false);
  });
  it('accepts edited account identity without canvas fields', () => {
    expect(profileIdentitySchema.parse({ display_name: 'Sandy', username: 'sandy.bare', bio: 'My beauty journey', avatar_url: '', canvas: { depth: 'Deep' } })).toEqual({ display_name: 'Sandy', username: 'sandy.bare', bio: 'My beauty journey', avatar_url: '' });
  });
});