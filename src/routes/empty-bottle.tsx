import { createFileRoute } from '@tanstack/react-router';
import { BareHeader, Page } from '@/components/bare/kit';
import { EmptyBottleClub } from '@/components/bare/collections';
import { workspaceHead } from '@/lib/workspace';
export const Route = createFileRoute('/empty-bottle')({ head: () => workspaceHead('Empty Bottle Club', 'Log finished beauty products, lifespan and repurchase decisions.'), component: () => <><BareHeader/><Page className="mt-6 max-w-2xl"><EmptyBottleClub/></Page></> });