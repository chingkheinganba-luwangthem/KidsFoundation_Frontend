"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PageBanner } from "@/components/ui/PageBanner";
import { ImageLightbox } from "@/components/ui/ImageLightbox";

export interface CampusClientProps {
  banner: {
    title: string;
    breadcrumb: string[];
    image?: string;
  };
  intro: {
    heading: string;
    title?: string;
    description: string;
    facilities: string[];
  };
  gallery?: {
    eyebrow?: string;
    heading?: string;
  };
  galleryImages: {
    src: string;
    alt: string;
  }[];
  video?: {
    eyebrow?: string;
    title: string;
    youtubeId: string;
    description: string;
  };
}

export function CampusClient({
  banner,
  intro,
  gallery,
  galleryImages,
  video,
}: CampusClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="relative flex-1 flex flex-col bg-white overflow-x-hidden selection:bg-[#F47C61] selection:text-white">
      <main className="flex-1 flex flex-col">
        {/* Banner with dynamic Strapi image */}
        <PageBanner
          title={banner.title}
          breadcrumb={banner.breadcrumb}
          image={banner.image || undefined}
        />

        {/* Campus Intro */}
        {(intro.heading || intro.title || intro.description || intro.facilities.length > 0) && (
          <section className="py-12 sm:py-16 lg:py-20 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
              {intro.heading && (
                <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal">
                  {intro.heading}
                </span>
              )}
              {intro.title && (
                <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#17345F] leading-[1.25] tracking-tight mb-5">
                  {intro.title}
                </h2>
              )}
              {intro.description && (
                <p className="text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85] max-w-3xl mb-7">
                  {intro.description}
                </p>
              )}

              {/* Facilities List */}
              {intro.facilities.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-w-4xl">
                  {intro.facilities.map((facility, i) => {
                    const isUnderConstruction = facility.includes("(under construction)");
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 py-2.5 px-4 rounded-xl bg-[#F8FAFC] border border-slate-100 hover:border-slate-200 transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#D97706] shrink-0" />
                        <span
                          className={`text-sm ${
                            isUnderConstruction
                              ? "text-[#D97706] font-semibold"
                              : "text-[#475569] font-medium"
                          }`}
                        >
                          {facility}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Campus Image Gallery */}
        {galleryImages.length > 0 && (
          <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF7F2]">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
              <div className="text-center mb-10 sm:mb-12">
                <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal">
                  {gallery?.eyebrow || "CAMPUS GALLERY"}
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#17345F] leading-[1.25] tracking-tight">
                  {gallery?.heading || "Explore our spaces"}
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => openLightbox(index)}
                    className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(23,52,95,0.06)] group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F47C61] focus:ring-offset-2"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-[#17345F]/0 group-hover:bg-[#17345F]/30 transition-colors duration-300 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                        View
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Campus Video */}
        {video && video.youtubeId && (
          <section className="py-12 sm:py-16 lg:py-20 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
              <div className="text-center mb-10 sm:mb-12">
                {video.eyebrow && (
                  <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal">
                    {video.eyebrow}
                  </span>
                )}
                <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#17345F] leading-[1.25] tracking-tight">
                  {video.title}
                </h2>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(23,52,95,0.12)] bg-[#17345F]">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                {video.description && (
                  <p className="text-center text-sm text-[#64748B] mt-4 leading-relaxed">
                    {video.description}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Lightbox */}
      {lightboxOpen && galleryImages.length > 0 && (
        <ImageLightbox
          images={galleryImages.map((img) => ({
            src: img.src,
            alt: img.alt,
          }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
