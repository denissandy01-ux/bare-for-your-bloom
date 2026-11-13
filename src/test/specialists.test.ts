import { describe, it, expect } from 'vitest';
import { CITIES, DISCIPLINES, SPECIALISTS, distanceMiles, findSpecialists } from '@/lib/specialists';

const base = { query: '', discipline: 'All' as const, radius: 50 };
describe('specialist discovery', () => {
  it.each(DISCIPLINES.slice(1))('includes the requested %s service discipline', discipline => {
    const results = findSpecialists({ ...base, discipline });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r => r.specialist.discipline === discipline)).toBe(true);
  });
  it('finds specialists by their specialty', () => {
    expect(findSpecialists({ ...base, query: 'structured gel' }).map(r => r.specialist.id)).toEqual(['imani-brooks']);
  });
  it('supports deep skin and 4C hair filtering together', () => {
    const results = findSpecialists({ ...base, discipline: 'Hair', depth: 'Deep', hair: '4C Coily' });
    expect(results.map(r => r.specialist.id)).toEqual(['amara-reed', 'sofia-reyes']);
  });
  it('limits results to the chosen proximity rather than city labels', () => {
    const origin = CITIES[0];
    expect(findSpecialists({ ...base, origin, radius: 10 }).map(r => r.specialist.id)).toEqual(['maya-lin', 'amara-reed', 'dre-james']);
    expect(findSpecialists({ ...base, origin, radius: 50 }).map(r => r.specialist.id)).toContain('sofia-reyes');
    expect(findSpecialists({ ...base, origin, radius: 50 }).map(r => r.specialist.id)).not.toContain('hana-cho');
  });
  it('calculates geographic distances and sorts nearest first', () => {
    expect(distanceMiles(CITIES[0], CITIES[0])).toBe(0);
    expect(distanceMiles(CITIES[0], CITIES[3])).toBeGreaterThan(1000);
    const results = findSpecialists({ ...base, origin: CITIES[0] });
    expect(results.map(r => r.distance)).toEqual(results.map(r => r.distance).sort((a, b) => (a ?? 0) - (b ?? 0)));
  });
  it('does not represent demo provider credentials as verified', () => {
    expect(SPECIALISTS.every(s => s.verification === 'Not verified')).toBe(true);
  });
});