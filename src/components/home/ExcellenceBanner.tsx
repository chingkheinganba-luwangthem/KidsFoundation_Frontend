import React from "react";
import { Sparkles } from "lucide-react";
import { ExcellenceBannerData } from "@/types/strapi";

interface ExcellenceBannerProps {
  data?: ExcellenceBannerData | null;
}

export function ExcellenceBanner({ data }: ExcellenceBannerProps) {
  const yearsEmblem = data?.yearsEmblem || "20+";
  const yearsLabel = data?.yearsLabel || "Years";
  const subtitle = data?.subtitle || "Excellence in Education";
  const heading = data?.heading || "20+ Years of Academic Excellence";
  const description =
    data?.description ||
    "Nurturing curious, confident, and capable learners in Manipur since 2005.";

  return (
    <section
      aria-label={heading}
      className="relative z-10 bg-gradient-to-r from-[#FAF7F2] via-[#FFF9ED] to-[#FAF7F2] border-y border-[#EFE5D5] py-7 sm:py-9 overflow-hidden"
    >
      {/* Subtle warm decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-24 bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px] relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-center sm:text-left">
          
          {/* Milestone Golden Emblem */}
          <div className="relative shrink-0 flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#FBBF24] via-[#F59E0B] to-[#D97706] text-[#17345F] shadow-md shadow-[#FBBF24]/25 border-2 border-white ring-4 ring-[#FBBF24]/20">
            <div className="text-center">
              <span className="block text-2xl sm:text-[26px] font-black leading-none tracking-tight text-[#17345F]">
                {yearsEmblem}
              </span>
              <span className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#17345F]/90 mt-0.5">
                {yearsLabel}
              </span>
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#D97706]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em]">
                {subtitle}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#17345F] tracking-tight leading-tight">
              {heading}
            </h2>

            <p className="text-xs sm:text-sm text-[#64748B] font-medium leading-relaxed max-w-xl">
              {description}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
