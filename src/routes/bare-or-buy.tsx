import { createFileRoute } from '@tanstack/react-router';
import { BareHeader, Page } from '@/components/bare/kit';
import { Comparison } from '@/components/bare/collections';
import { workspaceHead } from '@/lib/workspace';
import { z } from 'zod';
export const Route = createFileRoute('/bare-or-buy')({ validateSearch: z.object({ product: z.string().optional() }), head: () => workspaceHead('Bare or Buy?', 'Compare a new beauty discovery with essentials on your Bare Shelf.'), component: ComparePage });
function ComparePage() { const { product } = Route.useSearch(); return <><BareHeader/><Page className="mt-6 max-w-2xl"><Comparison initial={product}/></Page></>; }