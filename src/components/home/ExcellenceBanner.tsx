import React from "react";
import Image from "next/image";
import { ExcellenceBannerData } from "@/types/strapi";
import { getStrapiMediaUrl } from "@/lib/strapi";

interface ExcellenceBannerProps {
  data?: ExcellenceBannerData | null;
}

const FALLBACK_BG =
  "https://admin.kidsfoundationimphal.com/uploads/16d7f95a7d622e2c98b3982021409f378a31f288_1137fae850.png";

const FALLBACK_EMBLEM =
  "https://admin.kidsfoundationimphal.com/uploads/be61bea4d54e9e528b6610d5081fceb0720e75b1_c6cca95edd.png";

export function ExcellenceBanner({ data }: ExcellenceBannerProps) {
  if (!data?.heading && !data?.description && !data?.eyebrow && !data?.image1 && !data?.image2) {
    return null;
  }

  // 1. Text content strictly from Strapi API
  const eyebrow =
    data?.eyebrow || data?.subtitle || "A LEGACY OF LEARNING AND EXCELLENCE";
  const heading = data?.heading || "Years of Academic Excellence.";
  const description =
    data?.description ||
    "For over two decades, we've nurtured curiosity, inspired confidence, and helped young minds discover their potential.";

  // 2. Background image strictly from Strapi API (image1)
  const bgImage =
    data?.bgImageUrl ||
    (data?.image1 ? getStrapiMediaUrl(data.image1) : null) ||
    FALLBACK_BG;

  // 3. 20+ Emblem image strictly from Strapi API (image2)
  const emblemImage =
    data?.emblemImageUrl ||
    data?.fillImageUrl ||
    (data?.image2 ? getStrapiMediaUrl(data.image2) : null) ||
    FALLBACK_EMBLEM;

  return (
    <section
      aria-label={heading}
      className="relative z-10 text-white py-6 sm:py-7 md:py-8 px-4 sm:px-6 lg:px-8 overflow-hidden bg-cover bg-center border-y border-[#18263e]"
      style={{
        backgroundImage: `url('${bgImage}')`,
      }}
    >
      {/* Subtle overlay for text clarity and rich contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#061226]/35 via-transparent to-[#061226]/35 pointer-events-none"
      />

      {/* Compact Centered Content */}
      <div className="max-w-[1000px] mx-auto relative z-10 flex flex-col items-center justify-center text-center">
        {/* 1. Top Eyebrow from API */}
        {eyebrow && (
          <span className="text-[#E5A83B] font-bold text-[10px] sm:text-[11px] md:text-xs tracking-[0.24em] uppercase block mb-1 sm:mb-1.5 drop-shadow-xs">
            {eyebrow}
          </span>
        )}

        {/* 2. 3D Golden Ribbon 20+ Emblem from API (image2) - compact height */}
        {emblemImage && (
          <div className="relative w-[130px] sm:w-[155px] md:w-[180px] aspect-[3/2] my-0.5 sm:my-1">
            <Image
              src={emblemImage}
              alt={heading || "20+ Years"}
              fill
              sizes="(max-width: 640px) 130px, 180px"
              className="object-contain drop-shadow-md"
              priority
            />
          </div>
        )}

        {/* 3. Heading from API */}
        {heading && (
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-[26px] font-bold text-white tracking-tight leading-snug mt-1 sm:mt-1.5 mb-1 sm:mb-1.5 drop-shadow-sm">
            {heading}
          </h2>
        )}

        {/* 4. Description from API */}
        {description && (
          <p className="text-white/85 text-xs sm:text-[13px] md:text-sm leading-relaxed font-normal max-w-lg mx-auto drop-shadow-xs">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
