import makeup from '@/assets/specialist-makeup.jpg';
import nails from '@/assets/specialist-nails.jpg';
import curls from '@/assets/feed-olive-waves.jpg';
import barber from '@/assets/feed-barber.jpg';
import skin from '@/assets/feed-deep-spf.jpg';
import calm from '@/assets/feed-fair-beard.jpg';
import braids from '@/assets/service-braids.jpg';
import { DEPTHS, type Depth, type Profile } from './data';

export const DISCIPLINES = ['All', 'Hair', 'Skin', 'Nails', 'Makeup', 'Barbering'] as const;
export type Discipline = (typeof DISCIPLINES)[number];
export interface Point { lat: number; lng: number }
export const CITIES = [
  { name: 'Miami, FL', lat: 25.7617, lng: -80.1918 },
  { name: 'Fort Lauderdale, FL', lat: 26.1224, lng: -80.1373 },
  { name: 'Palm Beach, FL', lat: 26.7056, lng: -80.0364 },
  { name: 'New York, NY', lat: 40.7128, lng: -74.006 },
  { name: 'Atlanta, GA', lat: 33.749, lng: -84.388 },
] as const;
export interface Specialist {
  id: string; name: string; studio: string; discipline: Exclude<Discipline, 'All'>;
  credential: string; verification: 'Not verified'; city: string; neighborhood: string;
  point: Point; image: string; specialties: string[]; depths: readonly Depth[];
  hair: string[]; story: string; philosophy: string; tier: string;
  services: { name: string; price: number; minutes: number }[];
  shelf: { productId: string; role: 'Used in studio' | 'Used & sold' }[];
}
// Illustrative listings, not real providers, verified credentials, rates, or booking inventory.
export const SPECIALISTS: Specialist[] = [
  { id:'amara-reed', name:'Amara Reed', studio:'Root & Rhythm Braids', discipline:'Hair', credential:'Braiding specialist', verification:'Not verified', city:'Miami, FL', neighborhood:'Little Haiti', point:{lat:25.8307,lng:-80.1918}, image:braids, specialties:['Knotless braids','Protective styling','Scalp comfort'], depths:DEPTHS, hair:['3 Curly','4A Coily','4B Coily','4C Coily'], story:'Protective styling built around comfort, careful sectioning and your own rhythm.', philosophy:'A beautiful style should feel as good as it looks.',tier:'Independent braiding studio',services:[{name:'Knotless braids',price:180,minutes:240}],shelf:[{productId:'squalane',role:'Used in studio'}] },
  { id: 'maya-lin', name: 'Maya Lin', studio: 'Canvas Skin Studio', discipline: 'Skin', credential: 'Esthetician', verification: 'Not verified', city: 'Miami, FL', neighborhood: 'Wynwood', point: { lat: 25.8007, lng: -80.1994 }, image: skin, specialties: ['Hyperpigmentation', 'Sensitive barrier', 'Acne care'], depths: ['Medium', 'Tan', 'Deep'], hair: [], story: 'A quiet, unhurried space centered on melanin-rich skin. Maya’s approach puts barrier comfort before aggressive treatments.', philosophy: 'Gentle care. Clear expectations. No one-size-fits-all treatments.', tier: 'Specialist studio', services: [{ name: 'Barrier comfort facial', price: 95, minutes: 60 }, { name: 'Hyperpigmentation consultation', price: 45, minutes: 30 }], shelf: [{ productId: 'lumiere-gel-cleanser', role: 'Used & sold' }, { productId: 'calm-barrier-cream', role: 'Used in studio' }] },
  { id: 'sofia-reyes', name: 'Sofía Reyes', studio: 'Pattern House', discipline: 'Hair', credential: 'Cosmetologist', verification: 'Not verified', city: 'Fort Lauderdale, FL', neighborhood: 'Flagler Village', point: { lat: 26.1314, lng: -80.1433 }, image: curls, specialties: ['Curl cuts', 'Silk press', 'Protective styling'], depths: DEPTHS, hair: ['1 Straight', '2 Wavy', '3 Curly', '4A Coily', '4B Coily', '4C Coily'], story: 'Your pattern sets the plan. From straight hair to tight coils, Sofía builds a cut and a home routine around your texture, not a trend.', philosophy: 'Texture-first cuts, transparent pricing, and a finish you can maintain.', tier: 'Independent studio', services: [{ name: 'Texture consultation & cut', price: 85, minutes: 75 }, { name: 'Silk press', price: 110, minutes: 90 }], shelf: [{ productId: 'curl-defining-cream', role: 'Used & sold' }, { productId: 'squalane', role: 'Used in studio' }] },
  { id: 'dre-james', name: 'Dre James', studio: 'The Gentle Line', discipline: 'Barbering', credential: 'Barber', verification: 'Not verified', city: 'Miami, FL', neighborhood: 'Little River', point: { lat: 25.8485, lng: -80.191 }, image: barber, specialties: ['Razor bumps', 'Coarse beards', 'Fades'], depths: DEPTHS, hair: ['3 Curly', '4A Coily', '4B Coily', '4C Coily', 'Shaved / beard focus'], story: 'A clean lineup should not come with irritated skin. Dre focuses on coarse beard patterns and a comfortable finish.', philosophy: 'Precision without overworking the skin.', tier: 'Accessible barbershop', services: [{ name: 'Cut & lineup', price: 40, minutes: 45 }, { name: 'Beard shape & skin prep', price: 30, minutes: 30 }], shelf: [{ productId: 'bump-patrol', role: 'Used & sold' }] },
  { id: 'hana-cho', name: 'Hana Cho', studio: 'Calm Canvas', discipline: 'Skin', credential: 'Scalp care specialist', verification: 'Not verified', city: 'New York, NY', neighborhood: 'SoHo', point: { lat: 40.7233, lng: -74.003 }, image: calm, specialties: ['Sensitive barrier', 'Scalp comfort', 'Redness'], depths: DEPTHS, hair: ['1 Straight', '2 Wavy', '3 Curly'], story: 'Hana brings skin and scalp care together in a calm space that welcomes questions and reactive canvases.', philosophy: 'Comfort first, with referral to a clinician when needed.', tier: 'Specialist studio', services: [{ name: 'Skin & scalp consultation', price: 65, minutes: 45 }, { name: 'Gentle scalp treatment', price: 100, minutes: 60 }], shelf: [{ productId: 'calm-barrier-cream', role: 'Used in studio' }] },
  { id: 'imani-brooks', name: 'Imani Brooks', studio: 'Soft Set Nail Atelier', discipline: 'Nails', credential: 'Nail technician', verification: 'Not verified', city: 'Atlanta, GA', neighborhood: 'Old Fourth Ward', point: { lat: 33.7664, lng: -84.3709 }, image: nails, specialties: ['Structured gel', 'Natural nails', 'Nail art'], depths: DEPTHS, hair: [], story: 'Thoughtful nail care and color that complements your hands. Imani favors healthy natural nails and small, expressive details.', philosophy: 'Nail health before length. Every shade, every hand.', tier: 'Independent atelier', services: [{ name: 'Structured gel manicure', price: 60, minutes: 75 }, { name: 'Natural nail care', price: 35, minutes: 40 }], shelf: [{ productId: 'squalane', role: 'Used & sold' }] },
  { id: 'zara-mitchell', name: 'Zara Mitchell', studio: 'True Tone Makeup', discipline: 'Makeup', credential: 'Makeup artist', verification: 'Not verified', city: 'Palm Beach, FL', neighborhood: 'Downtown', point: { lat: 26.7105, lng: -80.0492 }, image: makeup, specialties: ['Bridal', 'Undertone matching', 'Soft glam'], depths: DEPTHS, hair: [], story: 'Skin still looks like skin. Zara builds bridal and event makeup around your undertone, texture, and the finish that feels like you.', philosophy: 'A shade match is the starting point, not an afterthought.', tier: 'High-artistry specialist', services: [{ name: 'Event makeup', price: 120, minutes: 60 }, { name: 'Bridal trial', price: 150, minutes: 90 }], shelf: [{ productId: 'skin-tint', role: 'Used in studio' }] },
];
SPECIALISTS.push({ ...SPECIALISTS.find(s => s.id === 'imani-brooks')!, id: 'lena-ortiz', name: 'Lena Ortiz', credential: 'Nail artist', specialties: ['Hand-painted art', 'Chrome', 'Short natural sets'], story: 'Lena chairs at Soft Set alongside Imani, known for tiny hand-painted details.', services: [{ name: 'Gel manicure', price: 40, minutes: 60 }, { name: 'Art add-on', price: 15, minutes: 20 }] });
/** Public @handle for an artist, e.g. @imani.nails. */
export const handleFor = (s: Specialist) => `@${s.name.split(' ')[0]!.normalize('NFD').replace(/[^a-zA-Z]/g, '').toLowerCase()}.${({ Hair: 'hair', Skin: 'skin', Nails: 'nails', Makeup: 'mua', Barbering: 'cuts' } as const)[s.discipline]}`;
/** Everyone who works at the same studio, the given artist first. */
export const studioTeam = (s: Specialist) => [s, ...SPECIALISTS.filter(o => o.studio === s.studio && o.id !== s.id)];
export const specialistById = (id: string) => SPECIALISTS.find(s => s.id === id);
export const FEED_SPECIALISTS: Record<string, string> = { p2: 'maya-lin', p4: 'sofia-reyes', p6: 'dre-james', p7: 'hana-cho' };
export function distanceMiles(a: Point, b: Point) {
  const rad = (n: number) => n * Math.PI / 180;
  const dlat = rad(b.lat - a.lat), dlng = rad(b.lng - a.lng);
  const h = Math.sin(dlat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dlng / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}
export const disciplineFilters = (d: Discipline) => ({ depth: ['All', 'Skin', 'Makeup'].includes(d), hair: ['All', 'Hair', 'Barbering'].includes(d) });
export interface SpecialistFilters { query: string; discipline: Discipline; origin?: Point | undefined; radius: number; depth?: Depth | undefined; hair?: string; specialty?: string; specialties?: string[] }
export function findSpecialists(filters: SpecialistFilters) {
  const q = filters.query.trim().toLowerCase();
  return SPECIALISTS.map(s => ({ specialist: s, distance: filters.origin ? distanceMiles(filters.origin, s.point) : undefined }))
    .filter(({ specialist: s, distance }) =>
      (filters.discipline === 'All' || s.discipline === filters.discipline) &&
      (!q || [s.name, s.studio, s.city, s.neighborhood, ...s.specialties].join(' ').toLowerCase().includes(q)) &&
      (!disciplineFilters(filters.discipline).depth || !filters.depth || s.depths.includes(filters.depth)) &&
      (!disciplineFilters(filters.discipline).hair || !filters.hair || s.hair.includes(filters.hair)) &&
      (!filters.specialty || s.specialties.includes(filters.specialty)) &&
      (!filters.specialties?.length || filters.specialties.some(x => s.specialties.includes(x))) &&
      (distance === undefined || distance <= filters.radius))
    .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
}
export function canvasCoverage(s: Specialist, p: Profile) {
  return s.depths.includes(p.depth) && (!p.hair || s.hair.length === 0 || s.hair.includes(p.hair));
}