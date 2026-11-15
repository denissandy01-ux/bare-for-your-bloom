import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Pencil, Plus, Scissors, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PLAN_CATEGORIES, removePlan, savePlan, togglePlan, useJourney, type Plan } from '@/lib/journey';
import { useCollection, visitStatus } from '@/lib/collection';
import { useAccount } from '@/lib/account';
import { specialistById } from '@/lib/specialists';

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Private monthly calendar: personal plans plus dated service visits from My Collection (same records, never copied). */
export function JourneyCalendar() {
  const [j, update] = useJourney();
  const { user } = useAccount();
  const { data, updateVisit } = useCollection(user?.id);
  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [sel, setSel] = useState(iso(today));
  const [form, setForm] = useState<(Partial<Plan> & { title: string; date: string; category: string }) | null>(null);
  const plans = j.plans ?? [];
  const visits = data.visits.filter(v => v.date);
  const dots = new Set([...plans.map(p => p.date), ...visits.map(v => v.date)]);
  const first = month.getDay(), days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const dayPlans = plans.filter(p => p.date === sel), dayVisits = visits.filter(v => v.date === sel);
  const label = new Date(sel + 'T12:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return <section className="space-y-4">
    <div className="flex items-center justify-between"><Button variant="ghost" size="icon" aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft /></Button><h2 className="font-display text-xl">{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2><Button variant="ghost" size="icon" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight /></Button></div>
    <div className="grid grid-cols-7 gap-1 text-center text-xs">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <span key={d} className="text-sand">{d}</span>)}
      {Array.from({ length: first }, (_, i) => <span key={`b${i}`} />)}
      {Array.from({ length: days }, (_, i) => { const d = iso(new Date(month.getFullYear(), month.getMonth(), i + 1)); return <button key={d} aria-pressed={sel === d} onClick={() => setSel(d)} className={`relative h-10 rounded-lg text-sm ${sel === d ? 'bg-clay text-oat' : 'bg-oat/10'}`}>{i + 1}{dots.has(d) && <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-peach" />}</button>; })}
    </div>
    <div className="space-y-2 rounded-[24px] border border-oat/15 p-4">
      <h3 className="font-display text-lg">{label} — Your plans <span className="text-xs text-sand">· {dayPlans.length + dayVisits.length} activities</span></h3>
      {!dayPlans.length && !dayVisits.length && <p className="text-sm text-sand">Nothing planned for this day.</p>}
      {dayPlans.map(p => <div key={p.id} className="flex items-center gap-3"><button aria-label={p.done ? 'Mark not done' : 'Mark completed'} onClick={() => update(x => togglePlan(x, p.id))} className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${p.done ? 'border-peach bg-peach text-cocoa' : 'border-oat/40'}`}>{p.done && <Check className="h-4 w-4" />}</button><span className="min-w-0 flex-1"><span className={`block text-sm font-semibold ${p.done ? 'line-through text-sand' : ''}`}>{p.title}</span><span className="block text-xs text-sand">{p.category}{p.notes ? ` · ${p.notes}` : ''}</span></span><Button variant="ghost" size="icon" aria-label={`Edit ${p.title}`} onClick={() => setForm({ ...p })}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label={`Delete ${p.title}`} onClick={() => update(x => removePlan(x, p.id))}><Trash2 className="h-4 w-4" /></Button></div>)}
      {dayVisits.map(v => { const st = visitStatus(v); return <div key={v.id} className="flex items-center gap-3"><Scissors className="h-5 w-5 shrink-0 text-peach" /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{v.service}</span><span className="block text-xs text-sand">{specialistById(v.specialistId)?.studio}{v.time ? ` · ${v.time}` : ''} · {st} · from My Collection</span></span>{st === 'Upcoming' && <Button size="sm" variant="secondary" onClick={() => { updateVisit(v.id, { status: 'Completed' }); toast.success('Visit completed'); }}>Done</Button>}</div>; })}
    </div>
    <Button className="w-full" onClick={() => setForm({ title: '', date: sel, category: PLAN_CATEGORIES[0] })}><Plus />Add a Beauty Plan</Button>
    <Dialog open={!!form} onOpenChange={o => { if (!o) setForm(null); }}><DialogContent className="me-surface"><DialogHeader><DialogTitle>{form?.id ? 'Edit Beauty Plan' : 'Add a Beauty Plan'}</DialogTitle></DialogHeader>{form && <form className="space-y-4" onSubmit={e => { e.preventDefault(); update(x => savePlan(x, form)); setSel(form.date); setForm(null); toast.success('Saved to your calendar'); }}>
      <label className="block text-sm">Title<input required maxLength={120} className="bare-input" placeholder="Wash day + deep conditioning" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
      <div className="grid grid-cols-3 gap-2">{PLAN_CATEGORIES.map(c => <Button type="button" key={c} variant={form.category === c ? 'default' : 'outline'} aria-pressed={form.category === c} className="h-auto whitespace-normal px-2 py-2 text-xs" onClick={() => setForm({ ...form, category: c })}>{c}</Button>)}</div>
      <label className="block text-sm">Date<input type="date" required className="bare-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></label>
      <label className="block text-sm">Notes (optional)<textarea maxLength={1000} className="bare-input" value={form.notes ?? ''} onChange={e => setForm({ ...form, notes: e.target.value || undefined })} /></label>
      <Button type="submit" className="w-full">{form.id ? 'Save changes' : 'Add to Calendar'}</Button>
    </form>}</DialogContent></Dialog>
  </section>;
}
