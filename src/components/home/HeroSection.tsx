"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SITE_CONFIG } from "@/data/siteConfig";
import { cn } from "@/lib/utils";

import { HeroSectionData } from "@/types/strapi";
import { getStrapiMediaUrl } from "@/lib/strapi";

const DEFAULT_SLIDES = [
  { src: "/images/banner_images/banner.jpg", alt: "Kids' Foundation School" },
];

interface HeroSectionProps {
  data?: HeroSectionData | null;
}

export function HeroSection({ data }: HeroSectionProps) {
  const heroBadge = data?.badge ?? SITE_CONFIG.hero.badge;
  const heroHeadingLine1 = data?.headingLine1 ?? SITE_CONFIG.hero.headingLine1;
  const heroHeadingLine2 = data?.headingLine2 !== undefined ? data.headingLine2 : SITE_CONFIG.hero.headingLine2;
  const heroDescription = data?.description ?? SITE_CONFIG.hero.description;
  const heroPrimaryBtn = {
    label: data?.primaryCta?.label ?? SITE_CONFIG.hero.primaryBtn.label,
    href: data?.primaryCta?.href ?? SITE_CONFIG.hero.primaryBtn.href,
  };
  const heroSecondaryBtn = {
    label: data?.secondaryCta?.label ?? SITE_CONFIG.hero.secondaryBtn.label,
    href: data?.secondaryCta?.href ?? SITE_CONFIG.hero.secondaryBtn.href,
  };
  const heroScrollIndicator = data?.scrollIndicator ?? SITE_CONFIG.hero.scrollIndicator;

  // Strapi slides or local fallback
  const validSlides =
    data?.slides && data.slides.length > 0
      ? data.slides
          .map((s) => ({
            src: getStrapiMediaUrl(s.media),
            alt: s.alt || "Kids' Foundation School",
          }))
          .filter((s) => Boolean(s.src))
      : [];

  const slides = validSlides.length > 0 ? validSlides : DEFAULT_SLIDES;

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Keep index within bounds if slide count changes
  useEffect(() => {
    if (current >= slides.length) {
      setCurrent(0);
    }
  }, [slides.length, current]);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  // Auto-play
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(nextSlide, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <section
      id="hero"
      className="relative min-h-[580px] sm:min-h-[680px] lg:min-h-[780px] flex flex-col justify-between pt-28 sm:pt-36 lg:pt-44 pb-10 sm:pb-12 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={`${slide.src}-${index}`}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === current ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center"
              unoptimized={slide.src.endsWith(".gif") || slide.src.includes(".gif")} // Important for animated GIF
            />
          </div>
        ))}

        {/* Navy gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#17345F] via-[#17345F]/85 to-transparent w-full lg:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17345F]/75 via-transparent to-[#17345F]/35" />
      </div>

      {/* Spacer for vertical balance */}
      <div className="h-2 sm:h-4" />

      {/* Hero Content - Left Aligned */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px] w-full">
        <div className="max-w-2xl text-left">
          {/* Badge */}
          <div className="inline-block mb-3 sm:mb-4">
            <span className="text-[#FBBF24] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase">
              {heroBadge}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-xs">
            {heroHeadingLine1}
            {heroHeadingLine2 ? (
              <>
                <br />
                {heroHeadingLine2}
              </>
            ) : null}
          </h1>

          {/* Description */}
          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-white/85 max-w-xl font-normal leading-relaxed">
            {heroDescription}
          </p>

          {/* Action Buttons */}
          <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              href={heroPrimaryBtn.href}
              className="inline-flex items-center justify-center bg-[#F47C61] hover:bg-[#E0684E] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-98"
            >
              {heroPrimaryBtn.label}
            </Link>

            <Link
              href={heroSecondaryBtn.href}
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium px-6 py-3 rounded-full border border-white/35 backdrop-blur-xs transition-all duration-200 active:scale-98"
            >
              {heroSecondaryBtn.label}
            </Link>
          </div>
        </div>
      </div>

      {/* Slider Navigation (Right Bottom) parallel to Scroll to Discover Indicator (Centered) */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px] pt-4 pb-2">
        <div className="flex items-end justify-between sm:grid sm:grid-cols-3 sm:items-end">
          {/* Left spacer to keep center indicator perfectly centered on tablet/desktop */}
          <div className="hidden sm:block" />

          {/* Center: Scroll to Discover Indicator */}
          <div className="flex justify-center">
            <Link
              href="#about"
              className="flex flex-col items-center text-white/70 hover:text-white transition-colors group cursor-pointer"
            >
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-1.5 whitespace-nowrap">
                {heroScrollIndicator}
              </span>
              <div className="w-5 h-8 rounded-full border-2 border-white/40 group-hover:border-white/80 flex items-start justify-center p-1.5 transition-colors">
                <div className="w-1.5 h-2 bg-white/80 rounded-full animate-scroll-bounce" />
              </div>
            </Link>
          </div>

          {/* Right: Modern Dots + Arrows (Parallel to Scroll to Discover) */}
          <div className="flex justify-end items-center pb-1">
            <div className="flex items-center gap-3.5 sm:gap-5">
              {/* Previous Arrow */}
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/25 border border-white/30 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm cursor-pointer active:scale-95 shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2.5">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={cn(
                      "h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                      index === current
                        ? "w-7 sm:w-8 bg-[#FBBF24]"
                        : "w-2 sm:w-2.5 bg-white/50 hover:bg-white/80"
                    )}
                  />
                ))}
              </div>

              {/* Next Arrow */}
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/25 border border-white/30 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm cursor-pointer active:scale-95 shadow-sm"
              >
                <ChevronRight className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
