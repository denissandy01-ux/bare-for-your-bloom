import { describe, expect, it } from 'vitest';
import { groupVisits } from '@/lib/collection';
import { savePlan, editEntry } from '@/lib/journey';
describe('service visits', () => {
  it('groups repeat visits of the same service and specialist into one entry', () => {
    const v = (id: string, specialistId: string, service: string, date: string) => ({ id, specialistId, service, date, notes: '' });
    const g = groupVisits([v('1', 'a', 'Knotless Braids', '2026-08-03'), v('2', 'a', 'knotless  braids', '2026-10-12'), v('3', 'b', 'Knotless Braids', '2026-11-21')]);
    expect(g.length).toBe(2);
    expect(g.find(l => l[0]!.specialistId === 'a')!.length).toBe(2);
  });
});
describe('plans and entries', () => {
  it('editing a plan does not duplicate it', () => {
    let j = savePlan({ goals: [], entries: [] }, { title: 'Wash day', date: '2026-11-14', category: 'Routine' });
    const id = j.plans![0]!.id;
    j = savePlan(j, { id, title: 'Wash day', date: '2026-11-18', category: 'Routine' });
    expect(j.plans!.length).toBe(1); expect(j.plans![0]!.date).toBe('2026-11-18');
  });
  it('edits a journal entry in place', () => {
    const j = editEntry({ goals: [], entries: [{ id: 'e', date: '', text: 'old', replies: [] }] }, 'e', { text: 'new', topic: 'T', goalId: undefined });
    expect(j.entries).toHaveLength(1); expect(j.entries[0]!.text).toBe('new');
  });
});
