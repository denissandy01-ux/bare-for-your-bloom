import { createFileRoute } from '@tanstack/react-router';
import { Bell, Heart, Globe, ShoppingBag, Droplets } from 'lucide-react';
import { BareHeader, Page } from '@/components/bare/kit';
import { Switch } from '@/components/ui/switch';
import { NOTIFICATION_TOPICS } from '@/lib/community';
import { useBare } from '@/lib/store';
import { workspaceHead } from '@/lib/workspace';
export const Route = createFileRoute('/notifications')({ head: () => workspaceHead('Notifications', 'Manage community, brand, global discovery and beauty collection notification preferences.'), component: Notifications });
function Notifications() {
  const { state, setNotification } = useBare();
  const icons = { community: Heart, brands: Bell, global: Globe, prices: ShoppingBag, empties: Droplets };
  return <><BareHeader/><Page className="mt-6 max-w-2xl space-y-6"><h1 className="font-display text-3xl">Notifications</h1><section className="border-y border-oat/15 py-7 text-center"><Bell className="mx-auto h-7 w-7 text-peach"/><h2 className="mt-3 font-display text-xl">You’re all caught up</h2><p className="mt-2 text-sm text-sand">No notifications yet. Live alerts and price tracking are not connected.</p></section><h2 className="font-display text-xl">Your preferences</h2>{(Object.keys(NOTIFICATION_TOPICS) as (keyof typeof NOTIFICATION_TOPICS)[]).map(key => { const Icon = icons[key]; return <label key={key} className="flex items-center gap-3 border-b border-oat/15 pb-4"><Icon className="h-5 w-5 text-peach"/><span className="flex-1 text-sm">{NOTIFICATION_TOPICS[key]}</span><Switch aria-label={NOTIFICATION_TOPICS[key]} checked={state.notificationPrefs[key]} onCheckedChange={value => setNotification(key,value)}/></label>; })}<p className="text-xs text-sand">Preferences saved on this device; enabling them does not activate delivery.</p></Page></>;
}