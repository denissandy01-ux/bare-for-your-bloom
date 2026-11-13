import { createFileRoute } from "@tanstack/react-router";
import { BareHeader, ListRow, Page, SectionTitle, VerifiedBadge } from "@/components/bare/kit";
import { PROS, ROUTINES } from "@/lib/data";

export const Route = createFileRoute("/pros")({
  head: () => ({ meta: [{ title: "Pro Routines · Becoming Bare" }, { name: "description", content: "Routines from licensed estheticians, barbers, stylists and trichologists." }, { property: "og:title", content: "Pro Routines · Becoming Bare" }, { property: "og:description", content: "Routines from licensed estheticians, barbers, stylists and trichologists." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Pros,
});

function Pros() {
  return (
    <>
      <BareHeader title="Pro Routines" />
      <Page className="mt-6 space-y-6">
        <SectionTitle meta="Licensed & verified">Routines from people who've seen your canvas before</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          {PROS.map((pro) => (
            <div key={pro.id} className="rounded-[28px] bg-cocoa-soft p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sand font-display text-[15px] font-semibold text-cocoa">{pro.initials}</div>
                <div className="min-w-0">
                  <p className="font-display text-[19px] leading-tight text-oat">{pro.name}</p>
                  <div className="mt-1"><VerifiedBadge>{pro.license}</VerifiedBadge></div>
                  <p className="mt-1.5 font-display text-[14px] italic text-sand">{pro.specialty}</p>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-sand/80">{pro.bio}</p>
              <div className="mt-3 space-y-2">
                {ROUTINES.filter((r) => r.proId === pro.id).map((r) => (
                  <ListRow key={r.id} to="/routine/$id" params={{ id: r.id }} image={r.media} title={r.title} meta={`${r.steps.length} steps · ${r.duration} · code ${pro.code}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Page>
    </>
  );
}
