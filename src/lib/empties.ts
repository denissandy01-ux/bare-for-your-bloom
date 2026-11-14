export interface EmptyEntry { productId: string; weeks: number; repurchase: boolean; note?: string; source: 'community' | 'you'; author?: string }
type CommunityRow = { kind: string; product_id: string | null; duration_weeks: number | null; repurchase: boolean | null; caption?: string | null };
type LocalEmpty = { productId: string; weeks: number; repurchase: boolean; note: string };

/** Combine published community empties with the visitor's own logged empties. Never invents entries. */
export function collectEmpties(rows: CommunityRow[] = [], local: LocalEmpty[] = []): EmptyEntry[] {
  const fromCommunity = rows.filter(r => r.kind === 'Empty Bottle' && r.product_id && r.duration_weeks !== null && r.repurchase !== null)
    .map(r => ({ productId: r.product_id!, weeks: r.duration_weeks!, repurchase: r.repurchase!, note: r.caption ?? '', source: 'community' as const }));
  return [...fromCommunity, ...local.map(l => ({ ...l, source: 'you' as const }))];
}

export function emptyVerdict(entries: EmptyEntry[], productId: string) {
  const list = entries.filter(e => e.productId === productId);
  if (!list.length) return null;
  return { count: list.length, repurchasePct: Math.round(list.filter(e => e.repurchase).length / list.length * 100), avgWeeks: Math.round(list.reduce((a, e) => a + e.weeks, 0) / list.length * 10) / 10, entries: list };
}

/** Products with at least `min` empties and 85%+ would repurchase. */
export function hallOfFame(entries: EmptyEntry[], min = 2) {
  return [...new Set(entries.map(e => e.productId))].map(id => ({ id, v: emptyVerdict(entries, id)! }))
    .filter(x => x.v.count >= min && x.v.repurchasePct >= 85).sort((a, b) => b.v.repurchasePct - a.v.repurchasePct || b.v.count - a.v.count);
}
