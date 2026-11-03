import React from "react";
import Image from "next/image";
import Link from "next/link";

interface PageBannerProps {
  title: string;
  breadcrumb?: string[];
  image?: string;
}

export function PageBanner({ title, breadcrumb, image }: PageBannerProps) {
  return (
    <section className="relative pt-32 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 bg-[#17345F] overflow-hidden">
      {/* Background Image / Overlay */}
      {image ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt={`${title} Banner`}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17345F]/95 via-[#17345F]/85 to-[#17345F]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17345F]/60 via-transparent to-[#17345F]/30" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#17345F] via-[#1d4074] to-[#17345F]" />
      )}

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Link href="/" className="text-white/60 hover:text-white text-xs font-medium transition-colors">
              Home
            </Link>
            {breadcrumb.map((crumb, i) => (
              <React.Fragment key={i}>
                <span className="text-white/40 text-xs">›</span>
                <span className="text-[#FBBF24] text-xs font-medium">{crumb}</span>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-[1.18] sm:leading-[1.15]">
          {title}
        </h1>

        {/* Gold accent line */}
        <div className="mt-4 w-16 h-1 bg-[#FBBF24] rounded-full" />
      </div>
    </section>
  );
}
