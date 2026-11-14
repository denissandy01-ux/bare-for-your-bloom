import { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';
export function useDoubleTapLike(liked: boolean, toggle: () => void) {
  const [burst, setBurst] = useState(0);
  const last = useRef(0);
  useEffect(() => { if (!burst) return; const timer = setTimeout(() => setBurst(0), 750); return () => clearTimeout(timer); }, [burst]);
  const like = () => { if (!liked) toggle(); setBurst(n => n + 1); };
  return { burst, onDoubleClick: like, onTouchEnd: () => { const now = Date.now(); if (now - last.current < 300) { like(); last.current = 0; } else last.current = now; } };
}
export function LikeBurst({ burst }: { burst: number }) {
  return burst ? <span key={burst} aria-hidden="true" className="like-burst pointer-events-none absolute inset-0 z-10 grid place-items-center"><Heart className="h-24 w-24 fill-clay text-peach" strokeWidth={1}/></span> : null;
}