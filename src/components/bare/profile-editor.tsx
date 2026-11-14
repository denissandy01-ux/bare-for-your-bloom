import { useState } from 'react';
import { Camera, Loader2, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { profileIdentitySchema, resizeAvatar, type ProfileIdentity } from '@/lib/profile';

export function ProfileEditor({ identity, onClose }: { identity: ProfileIdentity; onClose: () => void }) {
  const [draft, setDraft] = useState(identity);
  const [busy, setBusy] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [error, setError] = useState('');
  async function save() {
    const parsed = profileIdentitySchema.safeParse(draft);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Check your profile.'); return; }
    setBusy(true); setError('');
    try {
      const { error: failure } = await supabase.auth.updateUser({ data: parsed.data });
      if (failure) throw failure;
      toast.success('Profile updated'); onClose();
    } catch { setError('Your profile could not be saved. Please try again.'); }
    finally { setBusy(false); }
  }
  return <Sheet open onOpenChange={open => { if (!open && !busy && !photoBusy) onClose(); }}>
    <SheetContent className="me-surface overflow-y-auto" side="bottom">
      <div className="mx-auto max-w-xl pb-6">
        <SheetHeader><SheetTitle className="font-display text-2xl">Edit Profile</SheetTitle><SheetDescription>Your name, photo and bio.</SheetDescription></SheetHeader>
        <form className="mt-6 space-y-4" onSubmit={event => { event.preventDefault(); void save(); }}>
          <div className="flex items-center gap-4">
            <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary">{draft.avatar_url ? <img src={draft.avatar_url} alt="Profile photo preview" className="h-full w-full object-cover"/> : <UserRound className="h-8 w-8 text-muted-foreground"/>}</span>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-primary"><Camera className="h-4 w-4"/>{photoBusy ? 'Opening photo…' : 'Change photo'}<input aria-label="Change profile photo" className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy || photoBusy} onChange={async event => {
              const file = event.target.files?.[0]; if (!file) return;
              setPhotoBusy(true); setError('');
              try { const avatar_url = await resizeAvatar(file); setDraft(value => ({ ...value, avatar_url })); }
              catch (failure) { setError(failure instanceof Error ? failure.message : 'Photo could not be opened.'); }
              finally { setPhotoBusy(false); }
            }}/></label>
            {draft.avatar_url && <Button type="button" variant="ghost" size="sm" disabled={busy || photoBusy} onClick={() => setDraft(value => ({ ...value, avatar_url: '' }))}>Remove</Button>}
          </div>
          <label className="block text-sm font-medium">Display name<input required maxLength={80} className="bare-input" value={draft.display_name} onChange={event => setDraft(value => ({ ...value, display_name: event.target.value }))}/></label>
          <label className="block text-sm font-medium">Username<input required maxLength={30} autoCapitalize="none" className="bare-input" value={draft.username} onChange={event => setDraft(value => ({ ...value, username: event.target.value }))}/></label>
          <label className="block text-sm font-medium">Bio<textarea maxLength={160} rows={3} className="bare-input" value={draft.bio} onChange={event => setDraft(value => ({ ...value, bio: event.target.value }))}/><span className="mt-1 block text-right text-xs text-muted-foreground">{draft.bio.length}/160</span></label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button className="h-11 w-full rounded-full" disabled={busy || photoBusy} type="submit">{busy && <Loader2 className="animate-spin"/>}{busy ? 'Saving…' : 'Save profile'}</Button>
        </form>
      </div>
    </SheetContent>
  </Sheet>;
}