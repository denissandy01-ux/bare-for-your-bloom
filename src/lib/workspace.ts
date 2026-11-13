import { z } from 'zod';
export const draftSchema=z.object({title:z.string().trim().min(1).max(160),caption:z.string().max(2000),category:z.enum(['Product','Hair','Skin','Nails','Brows','Makeup']),disclosure:z.enum(['Not sponsored','Paid partnership','Own product']),product_name:z.string().max(160),license_available:z.boolean()});
export const licenseSchema=z.object({usage:z.string().trim().min(1).max(500),days:z.number().int().min(1).max(365),budget:z.number().positive()});
export function canAccessWorkspace(roles:string[],kind:'creator'|'brand'){return roles.includes(kind);}
export function canRespondToLicense(creatorId:string,userId:string,status:string){return creatorId===userId && status==='requested';}
export const workspaceHead=(title:string,description:string)=>({meta:[{title:`${title} · Becoming Bare`},{name:'description',content:description},{property:'og:title',content:`${title} · Becoming Bare`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary'}]});
