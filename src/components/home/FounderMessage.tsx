import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/data/siteConfig";
import { IMAGES } from "@/data/images";
import { FounderMessageData, AboutPageData } from "@/types/strapi";
import { getStrapiMediaUrl } from "@/lib/strapi";

interface FounderMessageProps {
  data?: FounderMessageData | null;
  aboutPageData?: AboutPageData | null;
}

export function FounderMessage({ data, aboutPageData }: FounderMessageProps) {
  const heading =
    aboutPageData?.founderHeading ||
    data?.heading ||
    SITE_CONFIG.founder.heading;

  const paragraph1 =
    (aboutPageData?.founderParagraphs && aboutPageData.founderParagraphs[0]) ||
    data?.paragraph1 ||
    SITE_CONFIG.founder.paragraph1;

  const paragraph2 =
    (aboutPageData?.founderParagraphs && aboutPageData.founderParagraphs[1]) ||
    aboutPageData?.founderQuote ||
    data?.paragraph2 ||
    SITE_CONFIG.founder.paragraph2;

  const linkText =
    data?.cta?.label ||
    SITE_CONFIG.founder.linkText ||
    "Learn more";

  const linkHref = data?.cta?.href || "/about#founder";

  const photo =
    getStrapiMediaUrl(aboutPageData?.founderImage) ||
    getStrapiMediaUrl(data?.photo) ||
    IMAGES.founder;

  const photoAlt =
    aboutPageData?.founderImage?.alternativeText ||
    data?.photo?.alternativeText ||
    "Founder of Kids' Foundation, Imphal";

  return (
    <section
      id="founder"
      className="pt-20 sm:pt-28 lg:pt-36 pb-12 sm:pb-16 lg:pb-20 bg-[#E8EFF8] overflow-visible"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
        {/* White Card with pop-out founder head and shoulders */}
        <div className="relative bg-white rounded-2xl sm:rounded-[32px] shadow-[0_20px_50px_rgba(23,52,95,0.08)]">
          <div className="flex flex-col lg:flex-row items-end">

            {/* Left – Founder Photo */}
            <div className="w-full lg:w-[34%] xl:w-[32%] flex justify-center lg:justify-start lg:pl-6 xl:pl-8 relative z-20 shrink-0">
              <div className="relative w-[200px] sm:w-[250px] lg:w-[300px] xl:w-[330px] h-[320px] sm:h-[400px] lg:h-[480px] xl:h-[520px] -mt-16 sm:-mt-24 lg:-mt-36 xl:-mt-40">
                <Image
                  src={photo}
                  alt={photoAlt}
                  fill
                  sizes="(max-width: 640px) 200px, (max-width: 1024px) 250px, 330px"
                  className="object-contain object-bottom drop-shadow-md"
                  priority
                />
              </div>
            </div>

            {/* Right – Content */}
            <div className="w-full lg:w-[66%] xl:w-[68%] px-6 sm:px-10 lg:pr-14 lg:pl-4 py-8 sm:py-10 lg:py-12">
              <h2 className="text-2xl sm:text-[32px] lg:text-[36px] font-bold text-[#17345F] tracking-tight leading-[1.2] mb-4 sm:mb-5">
                {heading}
              </h2>

              <div className="space-y-4 text-[15px] sm:text-[16px] text-[#64748B] leading-[1.75] max-w-3xl">
                <p>{paragraph1}</p>
                <p>{paragraph2}</p>
              </div>

              <div className="mt-6 sm:mt-8">
                <Link
                  href={linkHref}
                  className="inline-flex items-center gap-2 text-[#F47C61] hover:text-[#e0684f] font-semibold text-[15px] transition-colors group"
                >
                  <span>{linkText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
