import { SUBCATEGORIES, productGroup, type Category, type Product } from './data';
export const DISCOVER_CATEGORIES: Category[] = ['Skincare', 'Makeup', 'Hair', 'Body', 'Nails', 'Beard', 'Tools & Accessories'];
export const categoryLabel = (category: Category) => category === 'Beard' ? 'Grooming' : category;
export function productTypes(category: Category, group: string, products: Product[]) {
  if (category === 'Makeup' && group === 'Face') return ['Foundation', 'Skin Tint', 'Concealer', 'Blush', 'Contour & Bronzer', 'Powder', 'Primer'];
  return [...new Set(products.filter(p => p.category === category && productGroup(p) === group).map(p => p.sub ?? group))];
}
export function categoryGroups(category: Category) { return SUBCATEGORIES[category]; }
export function matchesCategory(p: Product, category: Category | null, group: string | null, type: string | null) {
  return (!category || p.category === category) && (!group || productGroup(p) === group) && (!type || p.sub === type);
}