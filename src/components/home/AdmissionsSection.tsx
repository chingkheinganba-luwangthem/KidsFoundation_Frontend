import React from "react";
import Link from "next/link";
import { AdmissionsCtaData, FooterButton } from "@/types/strapi";

interface AdmissionsSectionProps {
  data?: AdmissionsCtaData | null;
  eyebrow?: string;
  heading?: string;
  description?: string;
  buttons?: FooterButton[];
}

export function AdmissionsSection({
  data,
  eyebrow,
  heading,
  description,
  buttons,
}: AdmissionsSectionProps) {
  const displayLabel = eyebrow || data?.label || "";
  const displayHeading = heading || data?.heading || "";
  const displayDescription = description || data?.description || "";

  const hasButtons = (buttons && buttons.length > 0) || data?.primaryCta || data?.secondaryCta;

  if (!displayHeading && !displayDescription && !hasButtons && !displayLabel) {
    return null;
  }

  return (
    <section
      id="admissions"
      className="pt-16 sm:pt-20 lg:pt-24 pb-6 sm:pb-8 text-center"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
        {displayLabel && (
          <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal">
            {displayLabel}
          </span>
        )}

        {displayHeading && (
          <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#17345F] leading-[1.25] tracking-tight mb-3 sm:mb-4 whitespace-pre-line">
            {displayHeading}
          </h2>
        )}

        {displayDescription && (
          <p className="text-sm sm:text-base text-[#475569] max-w-xl mx-auto leading-[1.8] sm:leading-[1.85] mb-6 sm:mb-8">
            {displayDescription}
          </p>
        )}

        {/* Buttons */}
        {hasButtons && (
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            {buttons && buttons.length > 0 ? (
              buttons.map((btn, index) => {
                const isPrimary = index === 0;
                const isExt = btn.isExternal || btn.url.startsWith("http");
                return (
                  <Link
                    key={btn.id || btn.url + index}
                    href={btn.url}
                    target={isExt ? "_blank" : undefined}
                    rel={isExt ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center justify-center text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 active:scale-98 capitalize ${
                      isPrimary
                        ? "bg-[#F47C61] hover:bg-[#E0684E] text-white shadow-xs hover:shadow-md"
                        : "bg-white/80 hover:bg-white text-[#17345F] border border-slate-300/80 shadow-xs"
                    }`}
                  >
                    {btn.text}
                  </Link>
                );
              })
            ) : (
              <>
                {data?.primaryCta && (
                  <Link
                    href={data.primaryCta.href}
                    className="inline-flex items-center justify-center bg-[#F47C61] hover:bg-[#E0684E] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all duration-200 active:scale-98"
                  >
                    {data.primaryCta.label}
                  </Link>
                )}

                {data?.secondaryCta && (
                  <Link
                    href={data.secondaryCta.href}
                    className="inline-flex items-center justify-center bg-white/80 hover:bg-white text-[#17345F] text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full border border-slate-300/80 transition-all duration-200 active:scale-98 shadow-xs"
                  >
                    {data.secondaryCta.label}
                  </Link>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
