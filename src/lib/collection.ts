import { useSyncExternalStore } from 'react';
export const USAGE_STATUSES = ['Currently Using', 'Used Before', 'Finished'] as const;
export type UsageStatus = typeof USAGE_STATUSES[number];
export type VisitStatus = 'Upcoming' | 'Completed';
export interface ServiceVisit { id: string; specialistId: string; service: string; date: string; notes: string; time?: string; status?: VisitStatus }
/** One collection entry per service + specialist; repeat visits share the key. */
export const serviceKey = (v: Pick<ServiceVisit,'specialistId'|'service'>) => `${v.specialistId}::${v.service.trim().toLowerCase().replace(/\s+/g,' ')}`;
export function groupVisits(visits: ServiceVisit[]) {
  const m = new Map<string, ServiceVisit[]>();
  for (const v of visits) { const k = serviceKey(v); m.set(k, [...(m.get(k) ?? []), v]); }
  return [...m.values()].map(list => list.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')));
}
export const visitStatus = (v: ServiceVisit): VisitStatus => v.status ?? (v.date && v.date > new Date().toISOString().slice(0, 10) ? 'Upcoming' : 'Completed');
interface CollectionData { statuses: Record<string, UsageStatus>; visits: ServiceVisit[] }
const EMPTY: CollectionData = {statuses:{}, visits:[]};
const cache = new Map<string,{raw:string|null;data:CollectionData}>();
function read(key:string) {
  const raw=localStorage.getItem(key), previous=cache.get(key);
  if(previous?.raw===raw)return previous.data;
  let data=EMPTY;try{if(raw)data={...EMPTY,...JSON.parse(raw)};}catch{ /* retain an empty collection */ }
  cache.set(key,{raw,data});return data;
}
export function useCollection(owner?: string) {
  const key = `becoming-bare:collection:${owner ?? 'guest'}`;
  const data=useSyncExternalStore(callback=>{window.addEventListener('storage',callback);window.addEventListener('bare-collection',callback);return()=>{window.removeEventListener('storage',callback);window.removeEventListener('bare-collection',callback);};},()=>read(key),()=>EMPTY);
  const setData=(update:(s:CollectionData)=>CollectionData)=>{localStorage.setItem(key,JSON.stringify(update(read(key))));window.dispatchEvent(new Event('bare-collection'));};
  return {data, setStatus:(id:string,status:UsageStatus)=>setData(s=>({...s,statuses:{...s.statuses,[id]:status}})),
    addVisit:(visit:Omit<ServiceVisit,'id'>)=>setData(s=>({...s,visits:[{...visit,id:crypto.randomUUID()},...s.visits]})),
    updateVisit:(id:string,patch:Partial<Omit<ServiceVisit,'id'>>)=>setData(s=>({...s,visits:s.visits.map(v=>v.id===id?{...v,...patch}:v)})),
    removeVisit:(id:string)=>setData(s=>({...s,visits:s.visits.filter(v=>v.id!==id)}))};
}