import { createFileRoute } from '@tanstack/react-router';
import { BareHeader, Page } from '@/components/bare/kit';
import { MyReviews } from '@/components/bare/my-reviews';
import { workspaceHead } from '@/lib/workspace';
export const Route = createFileRoute('/empty-bottle')({ head: () => workspaceHead('My Reviews', 'Your private and published product and service reviews.'), component: () => <><BareHeader/><div className="me-surface"><Page className="mt-6 max-w-2xl"><MyReviews/></Page></div></> });