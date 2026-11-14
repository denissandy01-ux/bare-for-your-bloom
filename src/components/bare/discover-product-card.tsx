import { toast } from 'sonner';
import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { money, whereSold, type Product } from '@/lib/data';
import { useBare } from '@/lib/store';
import { cn } from '@/lib/utils';
export function DiscoverProductCard({ product: p }: { product: Product }) {
  const { state, toggleProduct } = useBare();
  const saved = state.savedProducts.includes(p.id);
  const shops = whereSold(p);
  return <article className="relative min-w-0 overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
    <Link to="/product/$id" params={{ id: p.id }} className="block"><img src={p.image} alt={p.name} loading="lazy" className="aspect-square w-full object-cover"/></Link>
    <Button variant="secondary" size="icon" aria-label={`${saved ? 'Unsave' : 'Save'} ${p.name}`} aria-pressed={saved} onClick={() => {toggleProduct(p.id);toast.success(saved ? 'Removed from Saved' : 'Saved to Products');}} className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/95"><Heart className={cn('h-4 w-4', saved && 'fill-primary text-primary')}/></Button>
    <Link to="/product/$id" params={{ id: p.id }} className="block space-y-1 p-3"><p className="text-[11px] font-semibold text-muted-foreground">{p.brand}</p><h3 className="min-h-10 text-sm font-medium leading-5">{p.name}</h3><p className="text-sm font-semibold">{Number.isFinite(shops.from) ? `From ${money(shops.from)}` : 'Price unavailable'}</p><p className="text-[11px] text-muted-foreground">{shops.shops.length ? `${shops.shops.slice(0, 2).join(' · ')}${shops.shops.length > 2 ? ` · +${shops.shops.length - 2}` : ''}` : 'See shopping options'}</p></Link>
  </article>;
}