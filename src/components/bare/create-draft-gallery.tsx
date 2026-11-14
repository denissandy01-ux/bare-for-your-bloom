import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { listCreateDrafts } from '@/lib/create-drafts';
import { FileText } from 'lucide-react';
export function CreateDraftGallery({ownerId}:{ownerId:string}) {
  const drafts=useQuery({queryKey:['create-drafts',ownerId],queryFn:()=>listCreateDrafts(ownerId)});
  return <div className="my-5 text-left"><p className="mb-3 text-center text-xs text-muted-foreground">Private stories · saved on this device</p>{drafts.isPending?<p role="status">Loading drafts…</p>:drafts.isError?<p role="alert">Drafts could not be loaded on this device.</p>:drafts.data?.length?<div className="grid grid-cols-3 gap-2">{drafts.data.map(d=><Link to="/create" search={{draft:d.id}} key={d.id} className="aspect-square rounded-lg bg-secondary p-3 text-secondary-foreground"><FileText className="mb-2 h-5 w-5"/><span className="line-clamp-3 text-xs">{d.fields.title||d.fields.caption||`Untitled ${d.mode}`}</span></Link>)}</div>:<p className="text-center text-sm text-muted-foreground">No story drafts yet.</p>}</div>;
}