import { createFileRoute,Link } from '@tanstack/react-router';
import { useEffect,useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Page } from '@/components/bare/kit';
import { workspaceHead } from '@/lib/workspace';
export const Route=createFileRoute('/reset-password')({head:()=>workspaceHead('Reset password','Set a new Becoming Bare account password.'),component:Reset});
function Reset(){const [recovery,setRecovery]=useState(false),[password,setPassword]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{setRecovery(window.location.hash.includes('type=recovery'));},[]);
 return <Page className="max-w-lg pt-10 space-y-5"><h1 className="font-display text-3xl">A fresh start</h1>{recovery?<form className="space-y-4" onSubmit={async e=>{e.preventDefault();setBusy(true);const {error}=await supabase.auth.updateUser({password});setMessage(error?error.message:'Password updated. You can sign in with your new password.');setBusy(false);}}><label>New password<input type="password" autoComplete="new-password" className="bare-input" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)}/></label><Button disabled={busy}>Save new password</Button><p role="status">{message}</p></form>:<p>Open the password reset link from your email. If it has expired, request another.</p>}<Link to="/auth" className="block text-peach">Back to sign in</Link></Page>;}
