import { createFileRoute } from '@tanstack/react-router';
import { BareHeader, Page } from '@/components/bare/kit';
import { AtlasHub } from '@/components/bare/atlas';
import { atlasHead } from '@/lib/atlas';
export const Route=createFileRoute('/atlas/')({head:()=>atlasHead('Global Beauty Atlas','Explore beauty brands, products and founder stories from around the world.'),component:()=> <><BareHeader/><Page className="mt-5"><AtlasHub/></Page></>});
