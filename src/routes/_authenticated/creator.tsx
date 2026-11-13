import { createFileRoute } from '@tanstack/react-router';
import { WorkspacePanel } from '@/components/bare/workspace-panel';
import { workspaceHead } from '@/lib/workspace';
export const Route=createFileRoute('/_authenticated/creator')({head:()=>workspaceHead('Creator Studio','Manage your content briefs, product line, partnerships and licensing requests.'),component:()=> <WorkspacePanel kind="creator"/>});
