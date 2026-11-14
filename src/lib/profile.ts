import { z } from 'zod';

export const profileIdentitySchema = z.object({
  display_name: z.string().trim().min(1, 'Enter your display name.').max(80),
  username: z.string().trim().regex(/^[a-zA-Z0-9._]{2,30}$/, 'Use 2–30 letters, numbers, dots or underscores.'),
  bio: z.string().trim().max(160),
  avatar_url: z.string().max(300_000).refine(value => !value || /^https:\/\//.test(value) || /^data:image\/(jpeg|png|webp);base64,/.test(value), 'Choose a valid profile photo.'),
});
export type ProfileIdentity = z.infer<typeof profileIdentitySchema>;

export function profileIdentity(metadata: Record<string, unknown>, email?: string): ProfileIdentity {
  const text = (key: string) => typeof metadata[key] === 'string' ? metadata[key] as string : '';
  const candidate = text('avatar_url') || text('picture');
  return {
    display_name: text('display_name') || text('full_name') || text('name'),
    username: text('username') || (email?.split('@')[0] ?? '').replace(/[^a-zA-Z0-9._]/g, '').slice(0, 30),
    bio: text('bio'),
    avatar_url: /^https:\/\//.test(candidate) || /^data:image\/(jpeg|png|webp);base64,/.test(candidate) ? candidate : '',
  };
}

export function ownedPosts<T extends { owner_id: string }>(posts: T[], ownerId: string | undefined): T[] {
  return ownerId ? posts.filter(post => post.owner_id === ownerId) : [];
}

export async function resizeAvatar(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPG, PNG or WebP photo.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Choose a photo smaller than 10 MB.');
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your photo could not be opened.');
    const side = Math.min(bitmap.width, bitmap.height);
    context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, 256, 256);
    return canvas.toDataURL('image/jpeg', 0.8);
  } finally { bitmap.close(); }
}