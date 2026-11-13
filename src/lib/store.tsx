import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Depth, Profile, Undertone } from "./data";

export type TxnKind = "purchase" | "review" | "payout";
export interface Txn { id: string; kind: TxnKind; label: string; amount: number; status: "pending" | "available" | "requested"; date: string }
export interface CheckIn { id: string; date: string; photo?: string; barrier: number; note: string; bottles: Record<string, number> }
export interface Review { productId: string; rating: number; text: string; date: string }

export interface BareState {
  profile: Profile;
  consulted: boolean;
  savedProducts: string[];
  savedRoutines: string[];
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
  savedRoutines: [],
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
  completeConsultation: (p: Profile) => void;
  toggleProduct: (id: string) => boolean;
  toggleRoutine: (id: string) => boolean;
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

  const toggleIn = useCallback((key: "savedProducts" | "savedRoutines", id: string) => {
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
    completeConsultation: (p) => setState((s) => ({ ...s, profile: p, consulted: true })),
    toggleProduct: (id) => toggleIn("savedProducts", id),
    toggleRoutine: (id) => toggleIn("savedRoutines", id),
    applyCode: (code) => setState((s) => (s.appliedCodes.includes(code) ? s : { ...s, appliedCodes: [...s.appliedCodes, code] })),
    recordPurchase: (label, amount) => setState((s) => ({ ...s, wallet: [{ id: uid(), kind: "purchase", label, amount, status: "pending", date: new Date().toISOString() }, ...s.wallet] })),
    requestPayout: () => setState((s) => {
      const avail = s.wallet.filter((t) => t.status === "available").reduce((a, t) => a + t.amount, 0);
      if (avail <= 0) return s;
      return { ...s, wallet: [{ id: uid(), kind: "payout", label: "Payout requested", amount: -avail, status: "requested", date: new Date().toISOString() }, ...s.wallet.map((t) => (t.status === "available" ? { ...t, status: "requested" as const } : t))] };
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
