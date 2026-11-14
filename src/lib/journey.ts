import { useEffect, useState } from "react";

export const GOAL_AREAS = ["Barrier repair & calm", "Even tone", "Clearer skin", "Scalp & length retention", "Curl & texture definition", "Grey & silver care", "Find my core routine", "Something else"] as const;

export interface Goal { id: string; title: string; area: string; why?: string | undefined; created: string; done?: string | undefined }
export interface Entry { id: string; goalId?: string | undefined; date: string; text: string; photo?: string | undefined; feel?: number | undefined; replies: { date: string; text: string }[] }
export interface Journey { goals: Goal[]; entries: Entry[] }

const KEY = "bb-journey-v1";
const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

export function addGoal(j: Journey, g: Pick<Goal, "title" | "area" | "why">): Journey {
  const title = g.title.trim();
  if (!title) return j;
  return { ...j, goals: [{ ...g, title, id: uid(), created: now() }, ...j.goals] };
}
export const toggleGoal = (j: Journey, id: string): Journey => ({ ...j, goals: j.goals.map((g) => g.id === id ? (g.done ? { ...g, done: undefined } : { ...g, done: now() }) : g) });
export const removeGoal = (j: Journey, id: string): Journey => ({ goals: j.goals.filter((g) => g.id !== id), entries: j.entries.map((e) => e.goalId === id ? { ...e, goalId: undefined } : e) });
export function addEntry(j: Journey, e: Pick<Entry, "text" | "goalId" | "photo" | "feel">): Journey {
  if (!e.text.trim() && !e.photo) return j;
  return { ...j, entries: [{ ...e, text: e.text.trim(), id: uid(), date: now(), replies: [] }, ...j.entries] };
}
export function addReply(j: Journey, id: string, text: string): Journey {
  if (!text.trim()) return j;
  return { ...j, entries: j.entries.map((e) => e.id === id ? { ...e, replies: [...e.replies, { date: now(), text: text.trim() }] } : e) };
}
export const removeEntry = (j: Journey, id: string): Journey => ({ ...j, entries: j.entries.filter((e) => e.id !== id) });

export function useJourney() {
  const [j, setJ] = useState<Journey>({ goals: [], entries: [] });
  useEffect(() => { try { const r = localStorage.getItem(KEY); if (r) setJ(JSON.parse(r)); } catch { /* ignore */ } }, []);
  const update = (f: (j: Journey) => Journey) => setJ((cur) => { const n = f(cur); try { localStorage.setItem(KEY, JSON.stringify(n)); } catch { /* full */ } return n; });
  return [j, update] as const;
}
