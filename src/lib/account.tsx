import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
const Account = createContext<{user:User|null; ready:boolean}>({user:null,ready:false});
export function AccountProvider({children}:{children:ReactNode}) {
 const [user,setUser]=useState<User|null>(null), [ready,setReady]=useState(false);
 const router=useRouter(), qc=useQueryClient();
 useEffect(()=>{
  let active=true;
  const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
   if(!['SIGNED_IN','SIGNED_OUT','USER_UPDATED','INITIAL_SESSION'].includes(event)) return;
   setUser(session?.user??null); setReady(true);
   if(event!=='INITIAL_SESSION'){ void router.invalidate(); if(event!=='SIGNED_OUT') void qc.invalidateQueries(); }
  });
  void supabase.auth.getUser().then(({data})=>{if(active){setUser(data.user);setReady(true);}});
  return ()=>{active=false;subscription.unsubscribe();};
 },[router,qc]);
 return <Account.Provider value={{user,ready}}>{children}</Account.Provider>;
}
export const useAccount=()=>useContext(Account);
