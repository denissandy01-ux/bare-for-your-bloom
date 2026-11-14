import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Depth, Profile, Undertone } from "./data";
import { supabase } from '@/integrations/supabase/client';
import { useAccount } from './account';
import { DEPTHS, UNDERTONES } from './data';
import { toast } from 'sonner';

export type TxnKind = "purchase" | "review" | "payout";
export interface Txn { id: string; kind: TxnKind; label: string; amount: number; status: "pending" | "available" | "requested"; date: string }
export interface CheckIn { id: string; date: string; photo?: string; barrier: number; note: string; bottles: Record<string, number> }
export interface Review { productId: string; rating: number; text: string; date: string }

export interface BareState {
  profile: Profile;
  consulted: boolean;
  savedProducts: string[];
  savedSpecialists: string[];
  likedPosts: string[];
  savedRoutines: string[];
  shoppingCountry: string;
  followedBrands: string[];
  brandInterest: string[];
  brandNotifications: string[];
  appliedCodes: string[];
  wallet: Txn[];
  canvasStart?: string;
  trackedBottles: string[];
  checkIns: CheckIn[];
  reviews: Review[];
}

const DEFAULT: BareState = {
  profile: { depth: "Deep", undertone: "Neutral" },
  consulted: false,
  savedProducts: [],
  savedSpecialists: [],
  likedPosts: [],
  savedRoutines: [],
  shoppingCountry: 'united-states',
  followedBrands: [],
  brandInterest: [],
  brandNotifications: [],
  appliedCodes: [],
  wallet: [],
  trackedBottles: [],
  checkIns: [],
  reviews: [],
};

const KEY = "becoming-bare:v1";
const uid = () => Math.random().toString(36).slice(2, 10);

interface Ctx {
  state: BareState;
  ready: boolean;
  setTone: (d: Depth, u: Undertone) => void;
  setCanvas: (p: Profile) => void;
  toggleSpecialist: (id: string) => boolean;
  completeConsultation: (p: Profile) => void;
  toggleProduct: (id: string) => boolean;
  toggleLike: (id: string) => boolean;
  toggleRoutine: (id: string) => boolean;
  setShoppingCountry: (id: string) => void;
  toggleBrandSignal: (key: 'followedBrands' | 'brandInterest' | 'brandNotifications', id: string) => boolean;
  applyCode: (code: string) => void;
  recordPurchase: (label: string, amount: number) => void;
  requestPayout: () => void;
  startCanvas: (bottles: string[]) => void;
  addCheckIn: (c: Omit<CheckIn, "id" | "date">) => void;
  addReview: (r: Omit<Review, "date">, reward: number) => void;
  reset: () => void;
}

const BareCtx = createContext<Ctx | null>(null);

export function BareProvider({ children }: { children: ReactNode }) {
  const { user } = useAccount();
  const [cloudReady, setCloudReady] = useState<string | null>(null);
  const synced = useRef('');
  const [state, setState] = useState<BareState>(DEFAULT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...DEFAULT, ...JSON.parse(raw) });
    } catch { /* corrupted storage: start fresh */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* quota full */ }
  }, [state, ready]);

  useEffect(() => {
    setCloudReady(null); synced.current = '';
    if (!user) return;
    let active = true;
    void supabase.from('profiles').select('canvas').eq('id', user.id).single().then(({data,error}) => {
      if (!active) return;
      if (error) { toast.error('Your saved canvas could not be loaded.'); return; }
      const p = data?.canvas;
      if (p && typeof p === 'object' && !Array.isArray(p) && DEPTHS.some(d => d === p['depth']) && UNDERTONES.some(u => u === p['undertone'])) {
        const profile = p as unknown as Profile;
        synced.current = JSON.stringify(profile);
        setState(s => ({...s, profile}));
      }
      setCloudReady(user.id);
    });
    return () => { active = false; };
  }, [user?.id]);
  useEffect(() => {
    if (!user || cloudReady !== user.id) return;
    const serialized = JSON.stringify(state.profile);
    if (serialized === synced.current) return;
    const timer = setTimeout(() => {
      void supabase.from('profiles').update({canvas:JSON.parse(serialized)}).eq('id',user.id).then(({error})=>{
        if (error) toast.error('Canvas saved on this device only. Please try again.');
        else synced.current=serialized;
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [state.profile, user?.id, cloudReady]);

  const toggleIn = useCallback((key: "savedProducts" | "savedRoutines" | "savedSpecialists" | 'likedPosts' | 'followedBrands' | 'brandInterest' | 'brandNotifications', id: string) => {
    let added = false;
    setState((s) => {
      const has = s[key].includes(id);
      added = !has;
      return { ...s, [key]: has ? s[key].filter((x) => x !== id) : [id, ...s[key]] };
    });
    return added;
  }, []);

  const value = useMemo<Ctx>(() => ({
    state, ready,
    setTone: (depth, undertone) => setState((s) => ({ ...s, profile: { ...s.profile, depth, undertone } })),
    setCanvas: (profile) => setState(s => ({...s, profile})),
    toggleSpecialist: (id) => toggleIn('savedSpecialists', id),
    completeConsultation: (p) => setState((s) => ({ ...s, profile: p, consulted: true })),
    toggleProduct: (id) => toggleIn("savedProducts", id),
    toggleLike: (id) => toggleIn("likedPosts", id),
    toggleRoutine: (id) => toggleIn("savedRoutines", id),
    setShoppingCountry: (shoppingCountry) => setState(s => ({...s, shoppingCountry})),
    toggleBrandSignal: (key,id) => toggleIn(key,id),
    applyCode: (code) => setState((s) => (s.appliedCodes.includes(code) ? s : { ...s, appliedCodes: [...s.appliedCodes, code] })),
    recordPurchase: (label, amount) => setState((s) => ({ ...s, wallet: [{ id: uid(), kind: "purchase", label, amount, status: "pending", date: new Date().toISOString() }, ...s.wallet] })),
    requestPayout: () => setState((s) => {
      const avail = s.wallet.filter((t) => t.status === "available" || t.kind === "payout").reduce((a, t) => a + t.amount, 0);
      const spend = Math.floor(avail / 500) * 500;
      if (spend <= 0) return s;
      return { ...s, wallet: [{ id: uid(), kind: "payout", label: `$${spend / 100} reward redeemed`, amount: -spend, status: "requested", date: new Date().toISOString() }, ...s.wallet] };
    }),
    startCanvas: (bottles) => setState((s) => ({ ...s, canvasStart: new Date().toISOString(), trackedBottles: bottles, checkIns: [] })),
    addCheckIn: (c) => setState((s) => ({ ...s, checkIns: [...s.checkIns, { ...c, id: uid(), date: new Date().toISOString() }] })),
    addReview: (r, reward) => setState((s) => ({
      ...s,
      reviews: [...s.reviews, { ...r, date: new Date().toISOString() }],
      wallet: [{ id: uid(), kind: "review", label: "Verified 30-day review", amount: reward, status: "available", date: new Date().toISOString() }, ...s.wallet],
    })),
    reset: () => setState(DEFAULT),
  }), [state, ready, toggleIn]);

  return <BareCtx.Provider value={value}>{children}</BareCtx.Provider>;
}

export function useBare() {
  const c = useContext(BareCtx);
  if (!c) throw new Error("useBare outside BareProvider");
  return c;
}

export function walletTotals(w: Txn[]) {
  const sum = (st: Txn["status"]) => Math.round(w.filter((t) => t.status === st && t.amount > 0).reduce((a, t) => a + t.amount, 0) * 100) / 100;
  return { pending: sum("pending"), available: sum("available"), requested: sum("requested") };
}

export const daysSince = (iso?: string) => (iso ? Math.floor((Date.now() - new Date(iso).getTime()) / 86400000) + 1 : 0);
