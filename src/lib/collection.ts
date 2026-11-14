import { useSyncExternalStore } from 'react';
export const USAGE_STATUSES = ['Currently Using', 'Used Before', 'Finished'] as const;
export type UsageStatus = typeof USAGE_STATUSES[number];
export interface ServiceVisit { id: string; specialistId: string; service: string; date: string; notes: string }
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
    removeVisit:(id:string)=>setData(s=>({...s,visits:s.visits.filter(v=>v.id!==id)}))};
}