import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { PageBanner } from "@/components/ui/PageBanner";
import { getSportsArtsPageData, getStrapiMediaUrl } from "@/lib/strapi";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sports & Arts | Kids' Foundation",
  description:
    "Explore sports, athletics, martial arts, yoga, fine arts, and performing arts programs at Kids' Foundation School, Imphal.",
};

export default async function SportsAndArtsPage() {
  const strapiData = await getSportsArtsPageData();

  if (!strapiData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center py-20">
        <p className="text-slate-500 text-lg">Unable to load Sports & Arts information. Please try again later.</p>
      </div>
    );
  }

  const hero = strapiData.Sports_hero;
  const banner = {
    title: hero?.title || strapiData.pageTitle || "Sports & Arts",
    breadcrumb:
      hero?.Breadcrumbs && hero.Breadcrumbs.length > 0
        ? hero.Breadcrumbs.filter((b) => b.toLowerCase() !== "home")
        : strapiData.breadcrumb || ["About", "Sports & Arts"],
    image: getStrapiMediaUrl(hero?.hero_background),
  };

  const intro = {
    label: strapiData.SPORTS_ARTS?.eyebrow || strapiData.introLabel || "",
    title: strapiData.SPORTS_ARTS?.heading || strapiData.introTitle || "",
    lead: strapiData.introLead || "",
  };

  const activities = strapiData.activities || [];
  const facilitiesCallout = strapiData.facilitiesCallout || [];
  const gallery = (strapiData.gallery || []).map((g, idx) => ({
    title: g.title || `Activity ${idx + 1}`,
    category: g.category || "Sports",
    image: g.imageUrl || getStrapiMediaUrl(g.image),
  }));

  return (
    <div className="relative flex-1 flex flex-col bg-white overflow-x-hidden selection:bg-[#F47C61] selection:text-white">
      <main className="flex-1 flex flex-col">
        {/* Page Banner with dynamic Strapi image */}
        <PageBanner
          title={banner.title}
          breadcrumb={banner.breadcrumb}
          image={banner.image || undefined}
        />

        {/* Main Content Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
            {/* Header / Eyebrow */}
            {(intro.label || intro.title) && (
              <div className="mb-6 sm:mb-8">
                {intro.label && (
                  <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal">
                    {intro.label}
                  </span>
                )}
                {intro.title && (
                  <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#17345F] leading-[1.22] tracking-tight">
                    {intro.title}
                  </h1>
                )}
              </div>
            )}

            {/* Introductory Lead */}
            {intro.lead && (
              <p className="text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85] mb-5">
                {intro.lead}
              </p>
            )}

            {/* Activities Paragraphs */}
            {activities.length > 0 && (
              <div className="space-y-4 text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85]">
                {activities.map((act) => (
                  <p key={act.name}>
                    <strong className="text-[#17345F] font-bold tracking-wide">
                      {act.name}:
                    </strong>{" "}
                    {act.description}
                  </p>
                ))}
              </div>
            )}

            {/* Facilities Highlight Callout (Gold Left Border & Italic Style) */}
            {facilitiesCallout.length > 0 && (
              <div className="border-l-4 border-[#FBBF24] pl-5 sm:pl-7 my-8 sm:my-10 space-y-3.5 text-sm sm:text-base text-[#475569] italic leading-[1.8] sm:leading-[1.85] bg-slate-50/60 py-3 sm:py-4 pr-4 sm:pr-6 rounded-r-2xl">
                {facilitiesCallout.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}

            {/* Card Image Grid */}
            {gallery.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 pt-4 sm:pt-6">
                {gallery.map((card, i) => (
                  <div
                    key={card.title + i}
                    className="group relative rounded-2xl overflow-hidden aspect-[16/10] shadow-sm hover:shadow-xl transition-all duration-300 bg-slate-900"
                  >
                    {card.image && (
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                      />
                    )}
                    {/* Dark gradient overlay for readable caption */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E1F38]/90 via-[#0E1F38]/30 to-transparent transition-opacity group-hover:from-[#0E1F38]/95" />

                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-left">
                      <h3 className="text-white font-bold text-sm sm:text-base leading-tight drop-shadow-xs group-hover:text-[#FBBF24] transition-colors">
                        {card.title}
                      </h3>
                      <span className="text-white/80 text-xs sm:text-[13px] font-medium leading-tight block mt-1">
                        {card.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
