import { createFileRoute } from '@tanstack/react-router';
import { WorkspacePanel } from '@/components/bare/workspace-panel';
import { workspaceHead } from '@/lib/workspace';
export const Route=createFileRoute('/_authenticated/brand')({head:()=>workspaceHead('Brand Portal','Manage your brand products and request creator content licenses.'),component:()=> <WorkspacePanel kind="brand"/>});
