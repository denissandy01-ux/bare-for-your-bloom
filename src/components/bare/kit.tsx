import { Link, useRouterState } from "@tanstack/react-router";
import { Check, ChevronDown, ChevronRight, Bell, Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DEPTH_SWATCH, UNDERTONE_SWATCH, toneLabel } from "@/lib/data";
import { useBare } from "@/lib/store";
import { ToneSheet } from "./sheets";
import { Button } from '@/components/ui/button';

export function Wordmark({ className }: { className?: string }) {
  return <Link to="/" className={cn("font-display text-[30px] italic leading-none text-oat", className)}>bare</Link>;
}

/** Kit mobile header: wordmark, tone/title pill, Trending badge. */
export function BareHeader({ title, overlay }: { title?: string; overlay?: boolean }) {
  const { browseProfile, temporaryCanvas } = useBare();
  const [open, setOpen] = useState(false);
  const label = title ?? temporaryCanvas ? `Browsing · ${browseProfile.depth} ${browseProfile.undertone}` : toneLabel(browseProfile.depth, browseProfile.undertone);
  return (
    <header className={cn("z-20 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 pt-3", overlay ? "absolute inset-x-0 top-0" : "relative")}>
      <Wordmark className="md:hidden" />
      <Button variant="secondary" onClick={() => setOpen(true)} className="flex h-11 min-w-0 items-center gap-2 whitespace-normal rounded-full bg-oat/95 pl-2.5 pr-3.5 text-[13px] font-medium text-cocoa md:col-start-1 md:col-end-3 md:justify-self-start" aria-label="Choose your browsing canvas">
        <span className="h-5 w-5 shrink-0 rounded-full ring-2 ring-oat" style={{ background: UNDERTONE_SWATCH[browseProfile.depth][browseProfile.undertone] }} />
        <span className="min-w-0 flex-1 text-center leading-tight line-clamp-2">{label}</span>
        <ChevronDown className="h-3 w-3 shrink-0" />
      </Button>
      <Link to="/notifications" aria-label="Notifications" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cocoa-soft text-oat">
        <Bell className="h-5 w-5" />
      </Link>
      <ToneSheet open={open} onOpenChange={setOpen} browsing />
    </header>
  );
}

const TABS = [
  { to: "/", label: "Feed", icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="6" y="3" width="12" height="18" rx="3" /><path d="M11 10l3 2-3 2z" /></svg>) },
  { to: "/discover", label: "Discover", icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>) },
  { to: "/create", label: "Create", icon: <Plus className="h-[22px] w-[22px]"/> },
  { to: "/saved", label: "Saved", icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 3h12v18l-6-4-6 4z" /></svg>) },
  { to: "/me", label: "Me", icon: null },
] as const;

function isActive(path: string, to: string) {
  if (to === "/") return path === "/";
  if (to === '/saved') return ['/saved','/bare-or-buy','/empty-bottle'].some(p=>path.startsWith(p));
  if (to === "/me") return ["/me", "/wallet", "/canvas", "/consultation"].some((p) => path.startsWith(p));
  if (to === "/discover") return path.startsWith("/discover") || path.startsWith('/atlas') || path.startsWith("/routine") || path.startsWith("/specialist") || path.startsWith("/shade-finder");
  return path.startsWith(to);
}

export function TabBar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { state } = useBare();
  return (
    <>
      <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-30 flex h-[var(--tabs-h)] items-start justify-around rounded-t-[28px] border-t border-sand bg-oat/95 px-2 pt-2 backdrop-blur md:hidden">
        {TABS.map((t) => {
          const active = isActive(path, t.to);
          return (
            <Link key={t.to} to={t.to} className={cn("flex h-11 min-w-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium", active ? "font-semibold text-clay" : "text-umber")}>
              {t.icon ?? <span className="h-[22px] w-[22px] rounded-full ring-2 ring-sand" style={{ background: DEPTH_SWATCH[state.profile.depth] }} />}
              {t.label}
            </Link>
          );
        })}
      </nav>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col gap-1 border-r border-cocoa-soft bg-cocoa px-4 py-6 md:flex">
        <Wordmark className="mb-6 px-3 text-[34px]" />
        {TABS.map((t) => {
          const active = isActive(path, t.to);
          return (
            <Link key={t.to} to={t.to} className={cn("flex h-12 items-center gap-3 rounded-full px-4 text-[14px] font-medium", active ? "bg-oat font-semibold text-clay" : "text-sand hover:bg-cocoa-soft")}>
              {t.icon ?? <span className="h-[22px] w-[22px] rounded-full ring-2 ring-sand" style={{ background: DEPTH_SWATCH[state.profile.depth] }} />}
              {t.label}
            </Link>
          );
        })}
        <Link to="/consultation" className="mt-auto rounded-[28px] bg-cocoa-soft p-4 text-[13px] text-sand">
          <span className="font-display text-[17px] italic text-oat">Canvas Consultation</span>
          <span className="mt-1 block">{state.consulted ? "Retake anytime as your canvas changes." : "Tell us about your bare canvas."}</span>
        </Link>
      </aside>
    </>
  );
}

export function SectionTitle({ meta, children, dark = true }: { meta: ReactNode; children: ReactNode; dark?: boolean }) {
  return (
    <div className="px-1">
      <span className={cn("inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em]", dark ? "text-sand/80" : "text-umber")}>
        <span className="h-1.5 w-1.5 rounded-full bg-peach" />{meta}
      </span>
      <h2 className={cn("mt-1 font-display text-[22px] leading-tight", dark ? "text-oat" : "text-cocoa")}>{children}</h2>
    </div>
  );
}

export function Chip({ active, children, onClick, className }: { active?: boolean; children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <Button variant="ghost" type="button" onClick={onClick} aria-pressed={active} className={cn("inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium transition-colors", active ? "bg-clay text-oat" : "bg-oat/95 text-cocoa", className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-oat" : "bg-peach")} />{children}
    </Button>
  );
}

export function SecondaryButton({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button type="button" onClick={onClick} className={cn("inline-flex h-11 shrink-0 items-center gap-1 rounded-full border border-clay/40 px-3.5 font-display text-[14px] italic text-clay", className)}>
      {children}<ChevronRight className="h-3 w-3" />
    </button>
  );
}

export function VerifiedBadge({ children }: { children: ReactNode }) {
  return <span className="inline-flex h-6 items-center gap-1 rounded-full bg-clay px-2.5 text-[11px] font-semibold text-oat"><Check className="h-3 w-3" strokeWidth={2.6} />{children}</span>;
}

export function ListRow({ image, title, meta, right, onClick, to, params }: { image?: string; title: ReactNode; meta: ReactNode; right?: ReactNode; onClick?: () => void; to?: string; params?: Record<string, string> }) {
  const inner = (
    <>
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[16px] bg-sand">{image && <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />}</div>
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate font-display text-[17px] leading-tight text-cocoa">{title}</p>
        <p className="mt-0.5 truncate text-[12px] text-umber">{meta}</p>
      </div>
      {right ?? <ChevronRight className="h-3.5 w-3.5 shrink-0 text-clay" />}
    </>
  );
  const cls = "flex min-h-[64px] w-full items-center gap-3 rounded-[28px] bg-oat/95 p-3";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (to) return <Link to={to as any} params={params as any} className={cls}>{inner}</Link>;
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-[28px] bg-cocoa-soft p-6 text-center">
      <p className="font-display text-[20px] text-oat">{title}</p>
      <p className="mx-auto mt-1.5 max-w-xs text-[14px] leading-relaxed text-sand/80">{body}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-5xl px-4 pb-[calc(var(--tabs-h)+24px)] md:px-6 md:pb-12", className)}>{children}</div>;
}
