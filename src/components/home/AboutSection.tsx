import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/data/siteConfig";
import { IMAGES } from "@/data/images";
import { AboutSectionData, AboutPageData } from "@/types/strapi";
import { getStrapiMediaUrl } from "@/lib/strapi";

interface AboutSectionProps {
  data?: AboutSectionData | null;
  aboutPageData?: AboutPageData | null;
}

export function AboutSection({ data, aboutPageData }: AboutSectionProps) {
  const label =
    aboutPageData?.storyLabel ||
    data?.label ||
    SITE_CONFIG.about.label;

  const heading =
    aboutPageData?.storyHeading ||
    data?.heading ||
    SITE_CONFIG.about.heading;

  const paragraph1 =
    (aboutPageData?.storyTopParagraphs && aboutPageData.storyTopParagraphs[0]) ||
    data?.paragraph1 ||
    SITE_CONFIG.about.paragraph1;

  const paragraph2 =
    (aboutPageData?.storyTopParagraphs && aboutPageData.storyTopParagraphs[1]) ||
    data?.paragraph2 ||
    SITE_CONFIG.about.paragraph2;

  const cleanLinkText = (
    data?.cta?.label && !data.cta.label.toLowerCase().includes("approach")
      ? data.cta.label
      : "Discover Our Story"
  ).replace(/[→\->]/g, "").trim();

  const linkHref = "/about#our-story";

  const campusImage =
    getStrapiMediaUrl(aboutPageData?.storyImage) ||
    getStrapiMediaUrl(data?.image) ||
    IMAGES.aboutCampus;

  const imageAlt =
    aboutPageData?.storyImageAlt ||
    data?.image?.alternativeText ||
    "Aerial view of Kids' Foundation circular modern school campus";

  return (
    <section
      id="about"
      className="relative py-12 sm:py-16 lg:py-20 bg-[#FAF7F2] overflow-hidden"
    >
      {/* Subtle organic wavy texture in background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 -z-0">
        <Image
          src={IMAGES.subtleWaveBg}
          alt="Decorative subtle wave texture"
          fill
          className="object-cover object-left-top"
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-stretch">
          {/* Left Column: Text Content (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-between text-left py-1 sm:py-2">
            <div>
              <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal">
                {label}
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-[36px] xl:text-[40px] font-bold text-[#17345F] leading-[1.22] tracking-tight mb-4 sm:mb-5">
                {heading}
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85] max-w-2xl">
                <p>{paragraph1}</p>
                <p>{paragraph2}</p>
              </div>
            </div>

            <div className="pt-4 sm:pt-6">
              <Link
                href={linkHref}
                className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-[#F47C61] hover:text-[#d9664d] transition-colors group"
              >
                <span>{cleanLinkText}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Campus Aerial Photo (5 cols on lg) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(23,52,95,0.12)] border border-[#E2E8F0]">
              <Image
                src={campusImage}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
