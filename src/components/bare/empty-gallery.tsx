import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { PRODUCTS } from '@/lib/data';
export function EmptyGallery({ title, body, action }: { title: string; body: string; action: ReactNode }) {
  return <section className="mx-auto w-full max-w-sm py-8 text-center"><div aria-hidden="true" className="relative mx-auto mb-6 flex h-32 w-52 items-center justify-center gap-2">{PRODUCTS.slice(0, 3).map((p, i) => <img key={p.id} src={p.image} alt="" className={`h-24 w-16 rounded-lg object-cover ${i === 1 ? '-translate-y-3' : i === 0 ? '-rotate-12' : 'rotate-12'}`}/>)}<span className="absolute bottom-0 right-4 grid h-9 w-9 place-items-center rounded-full bg-clay text-oat"><Sparkles className="h-4 w-4"/></span></div><h3 className="font-display text-2xl">{title}</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed opacity-75">{body}</p><div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div></section>;
}