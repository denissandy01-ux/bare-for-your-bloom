import { Link } from '@tanstack/react-router';
import { Bell } from 'lucide-react';
import { BareHeader } from './kit';
export function DiscoverHeader({ title }: { title?: string }) {
  return <><header className="flex items-center justify-between gap-3 px-4 py-4 md:px-6"><Link to="/discover" className="font-display text-[24px] italic sm:text-[28px]">Becoming Bare</Link><Link to="/notifications" aria-label="Notifications" className="grid h-11 w-11 place-items-center rounded-full border border-border"><Bell className="h-5 w-5"/></Link></header>{title && <h1 className="px-4 font-display text-3xl md:px-6">{title}</h1>}</>;
}
export function DiscoveryCanvas() { return <div className="discovery-canvas"><BareHeader/></div>; }