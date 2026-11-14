import { describe, it, expect } from 'vitest';
import { collectEmpties, emptyVerdict, hallOfFame } from '@/lib/empties';
import { findSpecialists } from '@/lib/specialists';
const rows = [
  { kind: 'Empty Bottle', product_id: 'a', duration_weeks: 6, repurchase: true },
  { kind: 'Empty Bottle', product_id: 'a', duration_weeks: 8, repurchase: true },
  { kind: 'Experience', product_id: 'a', duration_weeks: null, repurchase: null },
  { kind: 'Empty Bottle', product_id: 'b', duration_weeks: 4, repurchase: false },
  { kind: 'Empty Bottle', product_id: 'b', duration_weeks: 4, repurchase: true },
];
describe('empty bottle verdicts', () => {
  it('only counts empty bottle posts', () => expect(collectEmpties(rows).length).toBe(4));
  it('computes repurchase and average weeks', () => expect(emptyVerdict(collectEmpties(rows), 'a')).toMatchObject({ count: 2, repurchasePct: 100, avgWeeks: 7 }));
  it('returns null with no reviews', () => expect(emptyVerdict([], 'a')).toBeNull());
  it('hall of fame needs 85%+ repurchase', () => expect(hallOfFame(collectEmpties(rows)).map(x => x.id)).toEqual(['a']));
});
describe('multi-select studio services', () => {
  it('matches any selected service', () => {
    const ids = findSpecialists({ query: '', discipline: 'All', radius: 50, hair: '', specialty: '', specialties: ['Bridal', 'Fades'] }).map(r => r.specialist.id);
    expect(ids).toEqual(expect.arrayContaining(['zara-mitchell', 'dre-james']));
    expect(ids).not.toContain('maya-lin');
  });
});
