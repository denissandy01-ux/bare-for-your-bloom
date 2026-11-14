import { useState } from 'react';
import { Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { shareLink } from '@/lib/share';

export function ShareButton({ title, path, label = 'Share', className }: { title: string; path: string; label?: string; className?: string }) {
  const [url, setUrl] = useState('');
  return <><Button variant="ghost" size="icon" aria-label={label} title={label} className={className} onClick={async () => {
    const link = new URL(path, window.location.origin).href;
    const result = await shareLink(navigator, title, link);
    if (result === 'copied') toast.success('Link copied');
    if (result === 'manual') setUrl(link);
  }}><Share2 className="h-4 w-4"/></Button><Dialog open={!!url} onOpenChange={open => { if (!open) setUrl(''); }}><DialogContent><DialogHeader><DialogTitle>Share {title}</DialogTitle></DialogHeader><label className="text-sm text-cocoa">Link<input readOnly aria-label="Share link" value={url} onFocus={e => e.target.select()} className="bare-input"/></label><Button onClick={async () => { const result = await shareLink({ clipboard: navigator.clipboard }, title, url); if (result === 'copied') { toast.success('Link copied'); setUrl(''); } else toast.error('Select the link to copy it.'); }}><Copy className="h-4 w-4"/>Copy link</Button></DialogContent></Dialog></>;
}