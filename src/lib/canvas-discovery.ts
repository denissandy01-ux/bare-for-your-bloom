import { FEED, isShadeProduct, skinTags, type Product, type Profile } from './data';
import type { Specialist } from './specialists';

/** Recorded sample relevance, never a verified formulation compatibility claim. */
export function matchesCanvasProduct(product: Product, canvas: Profile) {
  if (product.fits?.depths && !product.fits.depths.includes(canvas.depth)) return false;
  const tags = skinTags(canvas);
  if (product.category === 'Hair') {
    if (!canvas.hair) return false;
    return !!product.fits?.hair?.includes(canvas.hair) || FEED.some(p => p.productId === product.id && p.creator.hair === canvas.hair);
  }
  if (isShadeProduct(product)) return FEED.some(p => p.productId === product.id && p.creator.depth === canvas.depth && p.creator.undertone === canvas.undertone);
  if (!['Skincare', 'Body', 'Beard'].includes(product.category) || !tags.length) return false;
  if (product.fits?.skinTypes) return tags.some(tag => product.fits?.skinTypes?.includes(tag));
  return FEED.some(p => p.productId === product.id && tags.includes(p.creator.skinType));
}

export function matchesCanvasSpecialist(s: Specialist, canvas: Profile) {
  if (s.discipline === 'Hair' || s.discipline === 'Barbering') return !!canvas.hair && s.hair.includes(canvas.hair);
  if (s.discipline === 'Skin' || s.discipline === 'Makeup') return s.depths.includes(canvas.depth);
  return true;
}