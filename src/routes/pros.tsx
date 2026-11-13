import { createFileRoute } from "@tanstack/react-router";
import { BareHeader, Page, SectionTitle } from "@/components/bare/kit";
import { SPECIALISTS } from '@/lib/specialists';
import { SpecialistCard } from '@/components/bare/specialist-card';

export const Route = createFileRoute("/pros")({
  head: () => ({ meta: [{ title: "Pros & Their Studios · Becoming Bare" }, { name: "description", content: "Explore specialist stories, services, portfolios, routines and studio shelves." }, { property: "og:title", content: "Pros & Their Studios · Becoming Bare" }, { property: "og:description", content: "Meet the specialists behind the care, from texture-first hair to tone-matched makeup." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Pros,
});

function Pros() {
  return (
    <>
      <BareHeader title="Pros & their studios" />
      <Page className="mt-6 space-y-6">
        <SectionTitle meta="People behind the care">A specialist for every canvas</SectionTitle>
        <p className="text-[13px] text-sand/80">Sample profiles · credentials and prices are illustrative, not verified.</p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{SPECIALISTS.map(s => <SpecialistCard key={s.id} specialist={s} />)}</div>
      </Page>
    </>
  );
}
