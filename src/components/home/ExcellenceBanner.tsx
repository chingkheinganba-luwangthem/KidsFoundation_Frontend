import React from "react";
import Image from "next/image";
import { ExcellenceBannerData } from "@/types/strapi";
import { getStrapiMediaUrl } from "@/lib/strapi";

interface ExcellenceBannerProps {
  data?: ExcellenceBannerData | null;
}

const FALLBACK_EMBLEM =
  "https://admin.kidsfoundationimphal.com/uploads/Group_1_2_0b8940bbdb.png";

export function ExcellenceBanner({ data }: ExcellenceBannerProps) {
  if (!data?.heading && !data?.description && !data?.eyebrow && !data?.image1 && !data?.image2) {
    return null;
  }

  // 1. Text content strictly from Strapi API with matching fallback
  const eyebrow =
    data?.eyebrow || data?.subtitle || "A LEGACY OF LEARNING AND EXCELLENCE";

  // Format heading with natural line-break matching design
  let rawHeading = data?.heading || "Celebrating 20+\nYears of Excellence.";
  if (rawHeading.includes("Celebrating 20+ ") && !rawHeading.includes("\n")) {
    rawHeading = rawHeading.replace("Celebrating 20+ ", "Celebrating 20+\n");
  }
  const heading = rawHeading;

  const description =
    data?.description ||
    "Nurturing curiosity. Inspiring confidence. Shaping futures.";

  // 2. 20+ Hexagon Emblem image strictly from Strapi API (image2)
  const emblemImage =
    data?.emblemImageUrl ||
    data?.fillImageUrl ||
    (data?.image2 ? getStrapiMediaUrl(data.image2) : null) ||
    FALLBACK_EMBLEM;

  return (
    <section
      aria-label={heading}
      className="relative z-10 text-white py-12 sm:py-14 md:py-16 lg:py-20 overflow-hidden bg-[#5C6488] border-y border-[#4F5779]/50"
    >
      {/* Exact Curve Lines matching the design (viewBox 0 0 1024 334 from original design coordinates) */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1024 334"
        fill="none"
      >
        {/* 1. Bottom-Left Arc: entering from left edge at y=191, curving down through (120, 221) under the description */}
        <path
          d="M 0 191 C 60 191, 100 208, 140 220 C 180 225, 260 225, 380 224"
          stroke="rgba(255, 255, 255, 0.16)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* 2. Top-Right Arc: entering from top edge at x=820, curving down and right to (1024, 160) */}
        <path
          d="M 820 0 C 840 80, 910 150, 1024 160"
          stroke="rgba(255, 255, 255, 0.16)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Container aligned with the rest of the site (Header, About, Academics, News, Footer) */}
      <div className="relative z-10 max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column: Eyebrow + Heading + Description */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {eyebrow && (
              <span className="text-[#D4A259] font-bold text-xs sm:text-[13px] tracking-[0.25em] uppercase block mb-2.5 sm:mb-3.5 drop-shadow-xs">
                {eyebrow}
              </span>
            )}

            {heading && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-bold text-white tracking-tight leading-[1.2] mb-3 sm:mb-4 drop-shadow-sm whitespace-pre-line">
                {heading}
              </h2>
            )}

            {description && (
              <p className="text-[#D8DEFE] text-sm sm:text-base leading-relaxed font-normal max-w-xl drop-shadow-xs">
                {description}
              </p>
            )}
          </div>

          {/* Right Column: 4 Hexagons Emblem Cluster */}
          {emblemImage && (
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <div className="relative w-[280px] sm:w-[340px] md:w-[400px] lg:w-[440px] xl:w-[480px] aspect-[4/3] drop-shadow-2xl hover:scale-102 transition-transform duration-500 ease-out">
                <Image
                  src={emblemImage}
                  alt={heading || "20+ Years of Academic Excellence"}
                  fill
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 400px, 480px"
                  className="object-contain drop-shadow-xl"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
