import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { PageBanner } from "@/components/ui/PageBanner";
import { getLearningPageData, getStrapiMediaUrl } from "@/lib/strapi";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Learning | Kids' Foundation",
  description:
    "Explore the learning approach at Kids' Foundation — from Pre-Primary discovery to Secondary academic excellence with holistic development.",
};

export default async function LearningPage() {
  const strapiData = await getLearningPageData();

  if (!strapiData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center py-20">
        <p className="text-slate-500 text-lg">Unable to load Learning information. Please try again later.</p>
      </div>
    );
  }

  const hero = strapiData.learning_hero;
  const banner = {
    title: hero?.title || strapiData.pageTitle || "Learning",
    breadcrumb:
      hero?.Breadcrumbs && hero.Breadcrumbs.length > 0
        ? hero.Breadcrumbs.filter((b) => b.toLowerCase() !== "home")
        : strapiData.breadcrumb || ["Learning"],
    image: getStrapiMediaUrl(hero?.hero_background),
  };

  const introLabel = strapiData.introLabel || "";
  const introHeading = strapiData.introHeading || "";
  const intro = strapiData.introText || "";

  const stages = (strapiData.stages || []).map((st, idx) => ({
    id: st.stageId || `stage-${idx + 1}`,
    title: st.title || "",
    boldIntro: st.boldIntro,
    description: st.description || [],
    activities: st.activities,
    bottomText: st.bottomText,
    image: getStrapiMediaUrl(st.image),
    imageAlt: st.imageAlt || st.title || "Kids' Foundation Learning",
  }));

  return (
    <div className="relative flex-1 flex flex-col bg-white overflow-x-hidden selection:bg-[#F47C61] selection:text-white">
      <main className="flex-1 flex flex-col">
        {/* Page Banner */}
        <PageBanner
          title={banner.title}
          breadcrumb={banner.breadcrumb}
          image={banner.image || undefined}
        />

        {/* Intro Section */}
        {(introHeading || intro) && (
          <section className="py-12 sm:py-16 lg:py-20 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
              <div className="w-full">
                {introLabel && (
                  <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal">
                    {introLabel}
                  </span>
                )}
                {introHeading && (
                  <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#17345F] leading-[1.25] tracking-tight mb-5">
                    {introHeading}
                  </h2>
                )}
                {intro && (
                  <p className="text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85]">
                    {intro}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Learning Stages - Alternating Layout */}
        {stages.map((stage, index) => {
          const isEven = index % 2 === 1;
          return (
            <section
              key={stage.id}
              id={stage.id}
              className={`py-12 sm:py-16 lg:py-20 ${
                isEven ? "bg-[#FAF7F2]" : "bg-white"
              }`}
            >
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Text Content */}
                  <div
                    className={`lg:col-span-7 flex flex-col justify-center py-1 ${
                      isEven ? "lg:order-2" : ""
                    }`}
                  >
                    <div>
                      {stage.title && (
                        <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#17345F] mb-3 tracking-tight leading-[1.25]">
                          {stage.title}
                        </h3>
                      )}

                      {/* Gold accent line */}
                      <div className="w-14 h-1 bg-[#D97706] rounded-full mb-6" />

                      {stage.boldIntro && (
                        <p className="text-base sm:text-lg font-semibold text-[#17345F] leading-[1.6] mb-4 italic">
                          {stage.boldIntro}
                        </p>
                      )}

                      {stage.description.map((para, i) => (
                        <p
                          key={i}
                          className="text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85] mb-4"
                        >
                          {para}
                        </p>
                      ))}

                      {stage.activities && stage.activities.length > 0 && (
                        <div className="mt-4 mb-4">
                          <ul className="space-y-2">
                            {stage.activities.map((activity) => (
                              <li
                                key={activity}
                                className="flex items-center gap-2.5 text-sm sm:text-[15px] text-[#475569] leading-[1.75]"
                              >
                                <span className="w-2 h-2 rounded-full bg-[#D97706] shrink-0" />
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {stage.bottomText && (
                        <p className="mt-4 text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85]">
                          {stage.bottomText}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stage Image */}
                  {stage.image && (
                    <div
                      className={`lg:col-span-5 flex justify-center ${
                        isEven ? "lg:order-1 lg:justify-start" : "lg:justify-end"
                      }`}
                    >
                      <div className="relative w-full max-w-[440px] aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(23,52,95,0.08)] bg-slate-100">
                        <Image
                          src={stage.image}
                          alt={stage.imageAlt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 440px"
                          className="object-cover object-center hover:scale-103 transition-transform duration-700"
                          priority
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}

      </main>
    </div>
  );
}
