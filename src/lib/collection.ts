import { useEffect, useState } from 'react';
export const USAGE_STATUSES = ['Currently Using', 'Used Before', 'Finished'] as const;
export type UsageStatus = typeof USAGE_STATUSES[number];
export interface ServiceVisit { id: string; specialistId: string; service: string; date: string; notes: string }
interface CollectionData { statuses: Record<string, UsageStatus>; visits: ServiceVisit[] }
const EMPTY: CollectionData = {statuses:{}, visits:[]};
export function useCollection(owner?: string) {
  const key = `becoming-bare:collection:${owner ?? 'guest'}`;
  const [data,setData] = useState<CollectionData>(EMPTY), [ready,setReady] = useState(false);
  useEffect(()=>{setReady(false);try{const raw=localStorage.getItem(key);setData(raw ? {...EMPTY,...JSON.parse(raw)} : EMPTY);}catch{setData(EMPTY);}setReady(true);},[key]);
  useEffect(()=>{if(ready) localStorage.setItem(key,JSON.stringify(data));},[key,data,ready]);
  return {data, setStatus:(id:string,status:UsageStatus)=>setData(s=>({...s,statuses:{...s.statuses,[id]:status}})),
    addVisit:(visit:Omit<ServiceVisit,'id'>)=>setData(s=>({...s,visits:[{...visit,id:crypto.randomUUID()},...s.visits]})),
    removeVisit:(id:string)=>setData(s=>({...s,visits:s.visits.filter(v=>v.id!==id)}))};
}