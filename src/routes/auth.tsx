import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect,useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { useAccount } from '@/lib/account';
import { workspaceHead } from '@/lib/workspace';
import { Button } from '@/components/ui/button';
import { Page, Wordmark } from '@/components/bare/kit';
import '@lovable.dev/cloud-auth-js/styles.css';
export const Route=createFileRoute('/auth')({head:()=>workspaceHead('Welcome to your canvas','Sign in or create a Becoming Bare customer, creator or brand account.'),component:Auth});
function Auth(){
 const {user}=useAccount(),nav=useNavigate();
 const [mode,setMode]=useState<'signin'|'signup'|'forgot'>('signin'),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[name,setName]=useState(''),[kind,setKind]=useState('user'),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 useEffect(()=>{if(user) void nav({to:'/me'});},[user,nav]);
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setMessage('');try{
  if(mode==='forgot'){const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/reset-password`});if(error)throw error;setMessage('Check your email for a password reset link.');}
  else if(mode==='signup'){const {error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin,data:{display_name:name,account_interest:kind}}});if(error)throw error;setMessage('Check your email to confirm your account, then sign in.');}
  else{const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;}
 }catch(e){setMessage(e instanceof Error?e.message:'Unable to sign in.');}finally{setBusy(false);}}
 async function social(provider:'google'|'lovable'){const r=await lovable.auth.signInWithOAuth(provider,{redirect_uri:`${window.location.origin}/auth`});if(r.error)toast.error(String(r.error));}
 return <Page className="max-w-lg pt-8 space-y-5"><Wordmark/><h1 className="font-display text-3xl">Your canvas. Your community.</h1><div className="flex gap-2"><Button variant={mode==='signin'?'default':'secondary'} onClick={()=>{setMode('signin');setMessage('');}}>Sign in</Button><Button variant={mode==='signup'?'default':'secondary'} onClick={()=>{setMode('signup');setMessage('');}}>Create account</Button></div><form onSubmit={submit} className="space-y-4">
 {mode==='signup'&&<><label className="block">Display name<input className="bare-input" value={name} onChange={e=>setName(e.target.value)} maxLength={100} required autoComplete="name"/></label><label className="block">I'm here as<select className="bare-input" value={kind} onChange={e=>setKind(e.target.value)}><option value="user">Beauty & grooming explorer</option><option value="creator">Creator / specialist</option><option value="brand">Brand</option></select></label></>}
 <label className="block">Email<input className="bare-input" type="email" required value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/></label>
 {mode!=='forgot'&&<label className="block">Password<input className="bare-input" type="password" required minLength={8} value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==='signup'?'new-password':'current-password'}/></label>}
 <Button disabled={busy} className="w-full h-12">{busy?'Please wait…':mode==='forgot'?'Send reset link':mode==='signup'?'Create account':'Sign in'}</Button><p role="status" className="text-sand">{message}</p></form>
 {mode==='signin'&&<Button variant="ghost" onClick={()=>setMode('forgot')}>Forgot password?</Button>}
 <Button className="google-auth w-full h-11" onClick={()=>social('google')}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>Continue with Google</Button>
 <Button className="lovable-auth-button w-full" onClick={()=>social('lovable')}>Continue with Lovable</Button><Link to="/studio" className="block text-peach">Explore creator & brand workspaces →</Link></Page>;
}
