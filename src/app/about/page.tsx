import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { PageBanner } from "@/components/ui/PageBanner";
import { GraduationCap } from "lucide-react";
import { getAboutPageData, getStrapiMediaUrl } from "@/lib/strapi";

export const instant = false;

export const metadata: Metadata = {
  title: "About Us | Kids' Foundation",
  description:
    "Learn about Kids' Foundation — a CBSE-affiliated co-educational school in Imphal providing holistic education from Pre-Nursery to tenth standard.",
};

export default async function AboutPage() {
  const strapiData = await getAboutPageData();

  if (!strapiData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center py-20">
        <p className="text-slate-500 text-lg">Unable to load About Us information. Please try again later.</p>
      </div>
    );
  }

  const hero = strapiData.hero;
  const banner = {
    title: hero?.title || strapiData.pageTitle || "About Us",
    breadcrumb:
      hero?.Breadcrumbs && hero.Breadcrumbs.length > 0
        ? hero.Breadcrumbs.filter((b) => b.toLowerCase() !== "home")
        : strapiData.breadcrumb || ["About"],
    image: getStrapiMediaUrl(hero?.hero_background),
  };

  const secondSection = strapiData.second_sectioin || strapiData.second_section;
  const storyImage = getStrapiMediaUrl(secondSection?.image || strapiData.storyImage);
  const storyImageAlt =
    secondSection?.image?.alternativeText ||
    strapiData.storyImageAlt ||
    secondSection?.heading ||
    "Kids' Foundation Campus";

  const story = {
    label: secondSection?.eyebrow || strapiData.storyLabel || "",
    heading: secondSection?.heading || strapiData.storyHeading || "",
    topParagraphs: strapiData.storyTopParagraphs || [],
    image: storyImage,
    imageAlt: storyImageAlt,
    bottomParagraphs: strapiData.storyBottomParagraphs || [],
  };

  const pillars =
    strapiData.mission_vison && strapiData.mission_vison.length > 0
      ? strapiData.mission_vison.map((item, idx) => ({
          id: item.id || `pillar-${idx}`,
          title: item.heading || "",
          description: item.description || "",
        }))
      : strapiData.pillars || [];

  const founderSec = strapiData.founder_section;
  const founderDetails = founderSec?.founder_details;
  const founderImage = getStrapiMediaUrl(founderDetails?.image || strapiData.founderImage);
  const founderImageAlt =
    founderDetails?.image?.alternativeText ||
    `${founderSec?.name || strapiData.founderName || "Wahengbam Brajabidhu Singh"} - ${
      founderSec?.designation || strapiData.founderRole || "Founder, Kids' Foundation"
    }`;

  const founderMessage = {
    tag: founderDetails?.eyebrow || strapiData.founderTag || "",
    heading: founderDetails?.heading || strapiData.founderHeading || "Message From The Founder",
    welcome: strapiData.founderWelcome || "",
    paragraphs: strapiData.founderParagraphs || [],
    quote: strapiData.founderQuote || "",
    commitmentsHeading: strapiData.founderCommitmentsHeading || "As we look to the future, we remain committed to:",
    commitments: strapiData.founderCommitments || [],
    closing: strapiData.founderClosing || "",
    founderName: founderSec?.name || strapiData.founderName || "Wahengbam Brajabidhu Singh",
    founderRole: founderSec?.designation || strapiData.founderRole || "Founder, Kids' Foundation",
    institution: founderSec?.description || strapiData.founderInstitution || "",
    image: founderImage,
    imageAlt: founderImageAlt,
  };

  return (
    <div className="relative flex-1 flex flex-col overflow-x-hidden selection:bg-[#F47C61] selection:text-white">
      <main className="flex-1 flex flex-col">
        {/* Page Banner */}
        <PageBanner
          title={banner.title}
          breadcrumb={banner.breadcrumb}
          image={banner.image || undefined}
        />

        {/* ── Section 1: Our Story ── */}
        <section id="our-story" className="py-12 sm:py-16 lg:py-20 scroll-mt-20 sm:scroll-mt-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
            {/* Top Row: Heading + First 2 Paragraphs + Campus Image */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start mb-6 sm:mb-8">
              {/* Text Left Column */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  {story.label && (
                    <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal">
                      {story.label}
                    </span>
                  )}
                  {story.heading && (
                    <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#17345F] leading-[1.25] tracking-tight mb-5 sm:mb-6">
                      {story.heading}
                    </h2>
                  )}

                  <div className="space-y-4 sm:space-y-5 text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85]">
                    {story.topParagraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Campus Image Right Column */}
              {story.image && (
                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                  <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[300px] xl:h-[320px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_40px_rgba(23,52,95,0.08)] bg-slate-100">
                    <Image
                      src={story.image}
                      alt={story.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 520px"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      className="hover:scale-103 transition-transform duration-700"
                      priority
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Row: Remaining Paragraphs */}
            {story.bottomParagraphs.length > 0 && (
              <div className="space-y-5 sm:space-y-6 text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85]">
                {story.bottomParagraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Section: Mission, Philosophy & Vision ── */}
        {pillars.length > 0 && (
          <section className="pb-16 sm:pb-20">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {pillars.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#F47C61] rounded-2xl sm:rounded-3xl p-8 sm:p-10 text-white shadow-lg shadow-[#F47C61]/15 flex flex-col justify-center items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#F47C61]/25"
                  >
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-white/95 text-sm sm:text-base leading-relaxed font-normal max-w-sm">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Section 2: Founder's Message (Linked from Home Page) ── */}
        <section
          id="founder-message"
          className="py-14 sm:py-18 lg:py-24 bg-[#F8FAFC] border-t border-slate-200/80 scroll-mt-20 sm:scroll-mt-24"
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="bg-white rounded-3xl sm:rounded-[36px] shadow-[0_20px_60px_rgba(23,52,95,0.08)] border border-slate-200/70 p-6 sm:p-10 lg:p-14 xl:p-16">
              
              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#E05D52] tracking-tight leading-[1.2] mb-6 sm:mb-8 font-serif">
                {founderMessage.heading || "Message From The Founder"}
              </h2>

              {/* Main Body with Floated / Responsive Founder Card */}
              <div className="clearfix">
                
                {/* Founder Photo Card on Right */}
                {founderMessage.image && (
                  <div className="md:float-right md:ml-8 lg:ml-12 mb-6 md:mb-6 w-full max-w-[280px] sm:max-w-[300px] lg:max-w-[320px] mx-auto md:mx-0 shrink-0">
                    <div className="relative rounded-tl-[52px] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl overflow-hidden shadow-[0_16px_40px_rgba(23,52,95,0.14)] border border-slate-300/80 bg-gradient-to-b from-[#182638] via-[#101B2B] to-[#0A101A] group">
                      <div className="relative w-full aspect-[4/5]">
                        <Image
                          src={founderMessage.image}
                          alt={founderMessage.imageAlt}
                          fill
                          sizes="(max-width: 640px) 280px, 320px"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-103"
                          priority
                        />
                      </div>
                      
                      {/* Name & Title Caption Banner */}
                      <div className="bg-[#E2E8F0]/95 backdrop-blur-md px-4 py-3.5 text-center border-t border-slate-300/80">
                        <h4 className="font-bold text-[#1E293B] text-sm sm:text-[15.5px] tracking-wide leading-tight">
                          {founderMessage.founderName}
                        </h4>
                        <p className="text-xs sm:text-[12.5px] text-[#64748B] font-medium mt-1 leading-tight">
                          {founderMessage.founderRole}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Paragraph 1: Welcome */}
                {founderMessage.welcome && (
                  <p className="text-[#334155] text-sm sm:text-base lg:text-[16.5px] leading-[1.8] sm:leading-[1.85] mb-5 sm:mb-6">
                    {founderMessage.welcome}
                  </p>
                )}

                {/* Paragraph 2 */}
                {founderMessage.paragraphs[0] && (
                  <p className="text-[#334155] text-sm sm:text-base lg:text-[16.5px] leading-[1.8] sm:leading-[1.85] mb-5 sm:mb-6">
                    {founderMessage.paragraphs[0]}
                  </p>
                )}

                {/* Paragraph 3 */}
                {founderMessage.paragraphs[1] && (
                  <p className="text-[#334155] text-sm sm:text-base lg:text-[16.5px] leading-[1.8] sm:leading-[1.85] mb-5 sm:mb-6">
                    {founderMessage.paragraphs[1]}
                  </p>
                )}

                {/* Paragraph 4 */}
                {founderMessage.paragraphs[2] && (
                  <p className="text-[#334155] text-sm sm:text-base lg:text-[16.5px] leading-[1.8] sm:leading-[1.85] mb-5 sm:mb-6">
                    {founderMessage.paragraphs[2]}
                  </p>
                )}

                {/* Any remaining paragraphs if any */}
                {founderMessage.paragraphs.slice(3).map((p, idx) => (
                  <p key={idx} className="text-[#334155] text-sm sm:text-base lg:text-[16.5px] leading-[1.8] sm:leading-[1.85] mb-5 sm:mb-6">
                    {p}
                  </p>
                ))}

                {/* Commitments Lead-in & Bullet Points */}
                {founderMessage.commitments.length > 0 && (
                  <div className="mt-8 sm:mt-10 mb-6">
                    <p className="font-bold text-[#17345F] text-base sm:text-[17.5px] mb-4 sm:mb-5 leading-normal">
                      {founderMessage.commitmentsHeading || "As we look to the future, we remain committed to:"}
                    </p>

                    <ul className="space-y-3.5 sm:space-y-4">
                      {founderMessage.commitments.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-3 sm:gap-3.5">
                          <span className="w-3.5 h-3.5 rounded-full bg-[#E05D52] shrink-0 mt-1.5 shadow-xs shadow-[#E05D52]/40" />
                          <span className="text-[#334155] text-sm sm:text-base lg:text-[16.5px] leading-relaxed font-normal">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Closing Paragraph */}
                {founderMessage.closing && (
                  <div className="mt-8 sm:mt-10 pt-4">
                    <p className="text-[#334155] text-sm sm:text-base lg:text-[16.5px] leading-[1.8] sm:leading-[1.85]">
                      {founderMessage.closing}
                    </p>
                  </div>
                )}

              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
