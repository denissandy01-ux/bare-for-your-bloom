import { Link } from '@tanstack/react-router';
import { productById } from '@/lib/data';
import { specialistById, handleFor } from '@/lib/specialists';
import type { CommunityPost } from './community-feed';
export function PostTags({post,hideProducts}:{post:CommunityPost;hideProducts?:boolean}) {
  const people=Array.isArray(post.people_tags)?post.people_tags.filter((p):p is {id:string;name:string}=>!!p&&typeof p==='object'&&!Array.isArray(p)&&typeof p['id']==='string'&&typeof p['name']==='string'):[];
  const products=[...new Set([...(post.product_ids??[]),...(post.product_id?[post.product_id]:[])])].map(productById).filter((p):p is NonNullable<typeof p>=>!!p&&!hideProducts);
  const specialists=(post.specialist_ids??[]).map(specialistById).filter(s=>!!s);
  if(!people.length&&!products.length&&!specialists.length&&!post.service_credit)return null;
  return <div className="flex max-h-28 flex-wrap gap-2 overflow-y-auto text-xs">{people.map(p=><Link key={p.id} to="/creator/$id" params={{id:p.id}} className="rounded-full bg-secondary px-3 py-2 text-secondary-foreground">@{p.name.replace(/^@/,'').replace(/\s+/g,'.')}</Link>)}{products.map(p=><Link key={p.id} to="/product/$id" params={{id:p.id}} className="rounded-full bg-secondary px-3 py-2 text-secondary-foreground">{p.name}</Link>)}{specialists.map(s=><Link key={s.id} to="/specialist/$id" params={{id:s.id}} className="rounded-full bg-secondary px-3 py-2 text-secondary-foreground">{handleFor(s)}</Link>)}{post.service_credit&&<span className="rounded-full bg-secondary px-3 py-2 text-secondary-foreground">Credit: {post.service_credit}</span>}</div>;
}