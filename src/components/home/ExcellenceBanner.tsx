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

  // 3. 20+ Hexagon Emblem image strictly from Strapi API (image2)
  const emblemImage =
    data?.emblemImageUrl ||
    data?.fillImageUrl ||
    (data?.image2 ? getStrapiMediaUrl(data.image2) : null) ||
    FALLBACK_EMBLEM;

  return (
    <section
      aria-label={heading}
      className="relative z-10 text-white py-10 sm:py-14 lg:py-16 px-4 sm:px-6 md:px-8 lg:px-[100px] overflow-hidden bg-cover bg-center bg-[#5C5F7C] bg-gradient-to-r from-[#4E516B] via-[#5C5F7C] to-[#484B63] border-y border-[#3d4058]"
      style={{
        backgroundImage: `url('${bgImage}')`,
      }}
    >
      {/* Subtle overlay for optimal contrast and readability */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#202231]/30 via-transparent to-[#202231]/20 pointer-events-none"
      />

      {/* 2-Column Responsive Layout Matching Image 2 */}
      <div className="max-w-[1400px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
        {/* Left Column: Eyebrow + Heading + Description */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          {eyebrow && (
            <span className="text-[#E5A83B] font-bold text-xs sm:text-[13px] tracking-[0.25em] uppercase block mb-2.5 sm:mb-3.5 drop-shadow-xs">
              {eyebrow}
            </span>
          )}

          {heading && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-bold text-white tracking-tight leading-[1.2] mb-3 sm:mb-4 drop-shadow-sm whitespace-pre-line">
              {heading}
            </h2>
          )}

          {description && (
            <p className="text-white/85 text-sm sm:text-base leading-relaxed font-normal max-w-xl drop-shadow-xs">
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
    </section>
  );
}
