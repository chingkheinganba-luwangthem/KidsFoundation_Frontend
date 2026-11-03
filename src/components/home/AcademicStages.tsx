"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ACADEMIC_STAGES, ACADEMIC_STAGES_HEADER } from "@/data/academicStages";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { SectionHeaderData, AcademicStageData, LearningPageData } from "@/types/strapi";
import { getStrapiMediaUrl } from "@/lib/strapi";

interface AcademicStagesProps {
  headerData?: SectionHeaderData | null;
  learningPageData?: LearningPageData | null;
  stagesData?: AcademicStageData[] | null;
}

export function AcademicStages({
  headerData,
  learningPageData,
  stagesData,
}: AcademicStagesProps) {
  const headerLabel = headerData?.label || ACADEMIC_STAGES_HEADER.label;
  const headerHeading = headerData?.heading || ACADEMIC_STAGES_HEADER.heading;
  const headerDescription = headerData?.description || ACADEMIC_STAGES_HEADER.description;

  const stages = useMemo(() => {
    // 1. Authoritative: from Learning Page Single Type
    if (learningPageData?.stages && learningPageData.stages.length > 0) {
      return learningPageData.stages.map((s, idx) => {
        const defaultData =
          ACADEMIC_STAGES.find((d) => d.id === s.stageId) ||
          ACADEMIC_STAGES[idx] ||
          ACADEMIC_STAGES[0];

        const stageKey = s.stageId || defaultData.id;

        const stageImage =
          getStrapiMediaUrl(s.image) || defaultData.image;

        const cleanLinkText = s.bottomText
          ? s.bottomText.replace(/[→\->]/g, "").trim()
          : (defaultData.linkText ? defaultData.linkText.replace(/[→\->]/g, "").trim() : "Explore Stage");

        return {
          id: stageKey,
          tabNumber: `0${idx + 1}.`,
          tabLabel: s.title || defaultData.tabLabel,
          subLabel: s.subLabel || defaultData.subLabel,
          heading: s.boldIntro || s.title || defaultData.heading,
          description:
            (Array.isArray(s.description) ? s.description[0] : s.description) ||
            defaultData.description,
          tags:
            s.activities && s.activities.length > 0
              ? s.activities
              : defaultData.tags,
          linkText: cleanLinkText,
          linkHref: `/learning#${s.stageId || stageKey}`,
          image: stageImage,
          imageAlt: s.imageAlt || s.title || defaultData.imageAlt,
        };
      });
    }

    // 2. Fallback: stagesData or ACADEMIC_STAGES
    if (stagesData && stagesData.length > 0) {
      return stagesData.map((s, idx) => {
        const defaultData = ACADEMIC_STAGES[idx] || ACADEMIC_STAGES[0];
        const cleanLinkText = s.cta?.label
          ? s.cta.label.replace(/[→\->]/g, "").trim()
          : (defaultData.linkText ? defaultData.linkText.replace(/[→\->]/g, "").trim() : "Explore Stage");
        return {
          id: s.stageId || defaultData.id,
          tabNumber: s.tabNumber || defaultData.tabNumber,
          tabLabel: s.tabLabel || defaultData.tabLabel,
          subLabel: s.subLabel || defaultData.subLabel,
          heading: s.heading || defaultData.heading,
          description: s.description || defaultData.description,
          tags: s.tags && s.tags.length > 0 ? s.tags : defaultData.tags,
          linkText: cleanLinkText,
          linkHref: s.cta?.href || defaultData.linkHref,
          image: getStrapiMediaUrl(s.image) || defaultData.image,
          imageAlt: s.image?.alternativeText || defaultData.imageAlt,
        };
      });
    }

    return ACADEMIC_STAGES.map((s) => ({
      ...s,
      linkText: s.linkText.replace(/[→\->]/g, "").trim(),
    }));
  }, [learningPageData, stagesData]);

  const [activeTabId, setActiveTabId] = useState<string>(stages[0]?.id || "foundational");

  const currentStage =
    stages.find((s) => s.id === activeTabId) || stages[0];

  return (
    <section id="academics" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
        {/* Section Heading */}
        <SectionHeading
          label={headerLabel}
          heading={headerHeading}
          description={headerDescription}
          align="center"
          className="mb-7 sm:mb-9"
        />

        {/* Interactive Tabs Header Container */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div
            role="tablist"
            aria-label="Academic stages tabs"
            className="inline-flex items-center gap-2 sm:gap-5 md:gap-8 bg-[#E8EFF8] px-4 sm:px-7 py-2.5 rounded-full border border-[#D5E2F3] overflow-x-auto max-w-full scrollbar-none"
          >
            {stages.map((stage) => {
              const isActive = activeTabId === stage.id;
              return (
                <button
                  key={stage.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTabId(stage.id)}
                  className={cn(
                    "relative py-1 px-2.5 text-xs sm:text-[13px] font-semibold transition-all cursor-pointer select-none flex items-center gap-1.5 whitespace-nowrap",
                    isActive
                      ? "text-[#17345F]"
                      : "text-[#64748B] hover:text-[#17345F]"
                  )}
                >
                  <span className="text-[#F47C61] font-bold">{stage.tabNumber}</span>
                  <span>{stage.tabLabel}</span>

                  {isActive && (
                    <span className="absolute -bottom-1 left-1 right-1 h-[2px] bg-[#F47C61] rounded-full animate-in fade-in" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Content Display */}
        {currentStage && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* Left Column: Stage Details (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left py-1">
              <div>
                <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.2em] uppercase mb-3 inline-block leading-normal">
                  {currentStage.subLabel}
                </span>

                <h3 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#17345F] leading-[1.25] tracking-tight mb-4">
                  {currentStage.heading}
                </h3>

                <p
                  className="text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85] mb-6 max-w-xl line-clamp-6"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 6,
                    overflow: "hidden",
                  }}
                >
                  {currentStage.description}
                </p>

                {/* Highlights / Activities Tag Pills */}
                {currentStage.tags && currentStage.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 mb-7 sm:mb-9">
                    {currentStage.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#E8EFF8] text-[#17345F] border border-[#D5E2F3]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Explore Stage Link */}
              <div className="pt-2">
                <Link
                  href={currentStage.linkHref}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F47C61] hover:text-[#d9664d] transition-colors group"
                >
                  <span>{currentStage.linkText}</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Stage Image (5 cols) - Normal, balanced aspect ratio */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[440px] aspect-[4/3] rounded-2xl sm:rounded-[28px] overflow-hidden shadow-[0_12px_36px_rgba(23,52,95,0.08)] bg-slate-100">
                <Image
                  src={currentStage.image}
                  alt={currentStage.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
                  className="object-cover object-center hover:scale-103 transition-transform duration-700 ease-out"
                  priority
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
