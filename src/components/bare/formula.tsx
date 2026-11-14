import { Link } from '@tanstack/react-router';
import { FlaskConical, Droplets, ChevronDown } from 'lucide-react';
import { useBare } from '@/lib/store';
import { canvasInsights, formulaById } from '@/lib/formula';
import type { Product } from '@/lib/data';
import { BareSheet } from './sheets';
export function FormulaContent({product}:{product:Product}){
 const {state}=useBare();const formula=formulaById(product.id);
 return <div className="space-y-5 text-sm leading-relaxed">
 <p className="text-umber">{product.brand} · {product.name}</p>
 {formula ? <>
 <section><h3 className="font-display text-lg">What’s This Formula Good For?</h3><div className="mt-3 grid grid-cols-3 gap-2">{formula.benefits.map(b=><div key={b} className="rounded-2xl bg-sand/50 p-3"><Droplets className="mb-2 h-4 w-4 text-clay"/><p className="text-xs">{b}</p></div>)}</div><p className="mt-2 text-xs text-umber">Ingredient functions are educational; labeled claims belong to the manufacturer.</p></section>
 <section><h3 className="mb-2 font-display text-lg">Meet the Key Ingredients</h3>{formula.ingredients.map(i=><details key={i.name} className="border-b border-sand py-3"><summary className="flex cursor-pointer list-none items-center justify-between gap-2"><span>{i.name}<span className="block text-xs text-umber">{i.benefit}</span></span><ChevronDown className="h-4 w-4 shrink-0 text-clay"/></summary><p className="mt-3 text-umber">{i.explanation}</p></details>)}</section>
 <details className="border-b border-sand pb-3"><summary className="cursor-pointer font-display text-lg">View Full Ingredients</summary><p className="mt-3 break-words text-xs text-umber">{formula.inci}</p><p className="mt-2 text-xs text-umber">Formulas can change by market and over time. Your package label takes precedence.</p></details>
 <section><h3 className="font-display text-lg">Product Recognition</h3><ul className="mt-2 space-y-1 text-xs text-umber">{formula.recognition.map(r=><li key={r}>{r}</li>)}</ul></section>
 </> : <div className="border-y border-sand py-4"><p className="font-display text-lg">Ingredients Not Confirmed</p><p className="mt-1 text-umber">No verified ingredient deck or recognition is recorded for this sample listing. Check the current label before purchase.</p></div>}
 <section><h3 className="font-display text-lg">Why It Fits Your Canvas</h3><ul className="mt-2 space-y-2">{canvasInsights(product,state.profile).map(n=><li key={n} className="border-l-2 border-clay pl-3 text-umber">{n}</li>)}</ul><Link to="/consultation" className="mt-3 inline-block text-clay underline">My Canvas Consultation</Link></section>
 {formula&&<a href={formula.source} target="_blank" rel="noopener noreferrer" className="block text-xs text-clay underline">Manufacturer source · checked {formula.checked}</a>}
 </div>;
}
export function FormulaSection({product}:{product:Product}){return <details className="border-y border-oat/15 py-5"><summary className="flex cursor-pointer list-none items-center gap-2 font-display text-xl"><FlaskConical className="h-5 w-5 text-peach"/>Inside the Formula<ChevronDown className="ml-auto h-4 w-4"/></summary><div className="mt-4 rounded-[28px] bg-oat p-5 text-cocoa"><FormulaContent product={product}/></div></details>;}
export function FormulaSheet({product,open,onOpenChange}:{product:Product;open:boolean;onOpenChange:(o:boolean)=>void}){return <BareSheet open={open} onOpenChange={onOpenChange} title="Inside the Formula"><FormulaContent product={product}/></BareSheet>;}
