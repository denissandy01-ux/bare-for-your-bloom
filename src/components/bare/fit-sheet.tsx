import { Check, Minus } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MATCH_LABEL, fitReasons, matchKind, type Creator, type Product } from "@/lib/data";
import { useBare } from "@/lib/store";

export function FitSheet({ product, creator, score, open, onOpenChange }: { product: Product; creator: Creator; score: number; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { browseProfile } = useBare();
  const kind = matchKind(product);
  const reasons = fitReasons(product, creator, browseProfile);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-oat">
        <SheetHeader className="text-left">
          <SheetTitle className="font-display text-2xl">{score}% {MATCH_LABEL[kind]}</SheetTitle>
          <SheetDescription>Why {product.name} may fit {kind === "hair" ? "your hair" : "your skin"}. Sample data until live reviews connect.</SheetDescription>
        </SheetHeader>
        <ul className="mt-4 space-y-2 px-4 pb-6">
          {reasons.map((r) => (
            <li key={r.text} className="flex items-start gap-3 rounded-[18px] bg-sand/40 p-3 text-sm text-cocoa">
              <span className={r.ok ? "mt-0.5 text-clay" : "mt-0.5 text-umber"}>{r.ok ? <Check className="h-4 w-4" /> : <Minus className="h-4 w-4" />}</span>{r.text}
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
