import React from "react";
import Image from "next/image";
import { ExcellenceBannerData } from "@/types/strapi";
import { getStrapiMediaUrl } from "@/lib/strapi";

interface ExcellenceBannerProps {
  data?: ExcellenceBannerData | null;
}

const FALLBACK_BG =
  "https://admin.kidsfoundationimphal.com/uploads/a54a2b1e278f7b434d3a1ddf28ee36c49d114969_1_7f6a22b66d.png";

const FALLBACK_EMBLEM =
  "https://admin.kidsfoundationimphal.com/uploads/Group_1_2_0b8940bbdb.png";

export function ExcellenceBanner({ data }: ExcellenceBannerProps) {
  if (!data?.heading && !data?.description && !data?.eyebrow && !data?.image1 && !data?.image2) {
    return null;
  }

  // 1. Text content strictly from Strapi API with Image 2 matching defaults
  const eyebrow =
    data?.eyebrow || data?.subtitle || "A LEGACY OF LEARNING AND EXCELLENCE";

  // Format heading with natural line-break matching Image 2
  let rawHeading = data?.heading || "Celebrating 20+\nYears of Excellence.";
  if (rawHeading.includes("Celebrating 20+ ") && !rawHeading.includes("\n")) {
    rawHeading = rawHeading.replace("Celebrating 20+ ", "Celebrating 20+\n");
  }
  const heading = rawHeading;

  const description =
    data?.description ||
    "Nurturing curiosity. Inspiring confidence. Shaping futures.";

  // 2. Background image strictly from Strapi API (image1)
  const bgImage =
    data?.bgImageUrl ||
    (data?.image1 ? getStrapiMediaUrl(data.image1) : null) ||
    FALLBACK_BG;

  // 3. 20+ Hexagon Emblem image strictly from Strapi API (image2)
  const emblemImage =
    data?.emblemImageUrl ||
    data?.fillImageUrl ||
    (data?.image2 ? getStrapiMediaUrl(data.image2) : null) ||
    FALLBACK_EMBLEM;

  return (
    <section
      aria-label={heading}
      className="relative z-10 text-white py-12 sm:py-14 md:py-16 lg:py-20 px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 overflow-hidden bg-[#5C6488] bg-gradient-to-r from-[#50577B] via-[#5C6488] to-[#4C5374] border-y border-[#3E435E]"
    >
      {/* Decorative delicate curved lines matching Image 2 wave lines */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1440 400"
        fill="none"
      >
        <path
          d="M-100 450 C 200 400, 350 250, 420 150 C 450 110, 470 50, 480 -50"
          stroke="rgba(190, 205, 245, 0.16)"
          strokeWidth="1.5"
        />
        <path
          d="M-50 480 C 250 430, 400 280, 460 170"
          stroke="rgba(190, 205, 245, 0.08)"
          strokeWidth="1.2"
        />
        <path
          d="M 950 -50 C 1050 100, 1200 280, 1550 350"
          stroke="rgba(190, 205, 245, 0.15)"
          strokeWidth="1.5"
        />
        <path
          d="M 1000 -50 C 1100 80, 1240 240, 1580 300"
          stroke="rgba(190, 205, 245, 0.08)"
          strokeWidth="1.2"
        />
      </svg>

      {/* Strapi background image overlay (image1) if available */}
      {bgImage && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url('${bgImage}')`,
          }}
        />
      )}

      {/* Subtle depth lighting overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#1c2035]/25 via-transparent to-[#1c2035]/20 pointer-events-none"
      />

      {/* 2-Column Responsive Layout Matching Image 2 */}
      <div className="max-w-[1360px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
        {/* Left Column: Eyebrow + Heading + Description */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          {eyebrow && (
            <span className="text-[#D4A259] font-bold text-xs sm:text-[13px] tracking-[0.25em] uppercase block mb-3 sm:mb-4 drop-shadow-xs">
              {eyebrow}
            </span>
          )}

          {heading && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-bold text-white tracking-tight leading-[1.18] mb-3.5 sm:mb-4.5 drop-shadow-sm whitespace-pre-line">
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
            <div className="relative w-[300px] sm:w-[360px] md:w-[420px] lg:w-[460px] xl:w-[500px] aspect-[4/3] drop-shadow-2xl hover:scale-102 transition-transform duration-500 ease-out">
              <Image
                src={emblemImage}
                alt={heading || "20+ Years of Academic Excellence"}
                fill
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 420px, 500px"
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
