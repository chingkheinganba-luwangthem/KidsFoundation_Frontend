"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { PageBanner } from "@/components/ui/PageBanner";
import { ImageLightbox } from "@/components/ui/ImageLightbox";

export interface GalleryClientProps {
  banner: {
    title: string;
    breadcrumb: string[];
    image?: string;
  };
  sectionHeader: {
    label: string;
    heading: string;
    description: string;
  };
  categories: string[];
  images: {
    id: string | number;
    src: string;
    alt: string;
    category: string;
    title: string;
  }[];
}

export function GalleryClient({
  banner,
  sectionHeader,
  categories,
  images,
}: GalleryClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Category cards to show when "All" is active
  const categoryCards = useMemo(() => {
    const rawCategories = categories.filter((c) => c.toLowerCase() !== "all");
    const uniqueCats = Array.from(
      new Set([
        ...rawCategories,
        ...images.map((img) => img.category).filter(Boolean),
      ])
    );

    return uniqueCats
      .map((cat) => {
        const catImages = images.filter(
          (img) => img.category.trim().toLowerCase() === cat.trim().toLowerCase()
        );
        const coverImage = catImages[0];
        if (!coverImage) return null;
        return {
          category: cat,
          title: coverImage.title || cat,
          coverSrc: coverImage.src,
          alt: coverImage.alt || `${cat} category`,
          count: catImages.length,
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);
  }, [categories, images]);

  const filteredImages = useMemo(() => {
    if (activeCategory === "All") return images;
    return images.filter(
      (img) => img.category.trim().toLowerCase() === activeCategory.trim().toLowerCase()
    );
  }, [activeCategory, images]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="relative flex-1 flex flex-col bg-white overflow-x-hidden selection:bg-[#F47C61] selection:text-white">
      <main className="flex-1 flex flex-col">
        <PageBanner
          title={banner.title}
          breadcrumb={banner.breadcrumb}
          image={banner.image || undefined}
        />

        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
            {/* Section Header */}
            <div className="text-center mb-10 sm:mb-12">
              <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal">
                {sectionHeader.label}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#17345F] leading-[1.25] tracking-tight">
                {sectionHeader.heading}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85] max-w-full mx-auto">
                {sectionHeader.description}
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[#17345F] text-white shadow-sm"
                      : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] hover:text-[#17345F]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Gallery Grid: Show Category Cards when "All" is active, otherwise individual photos */}
            {activeCategory === "All" ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {categoryCards.map((catCard) => (
                    <button
                      key={catCard.category}
                      type="button"
                      onClick={() => {
                        setActiveCategory(catCard.category);
                      }}
                      className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group cursor-pointer bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F47C61] focus:ring-offset-2 text-left"
                    >
                      <Image
                        src={catCard.coverSrc}
                        alt={catCard.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1F38]/85 via-[#0E1F38]/25 to-transparent opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5">
                        <span className="text-white text-base sm:text-lg font-bold line-clamp-1 leading-snug group-hover:text-[#FBBF24] transition-colors">
                          {catCard.title}
                        </span>
                        <span className="text-white/80 text-xs sm:text-[13px] font-medium mt-1">
                          {catCard.category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {categoryCards.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-base text-[#64748B]">No photo categories available.</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* Back to all categories button */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveCategory("All")}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#17345F] hover:text-[#F47C61] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>View All Categories</span>
                  </button>
                  <span className="text-xs text-[#64748B]">
                    Showing {filteredImages.length} {filteredImages.length === 1 ? "photo" : "photos"} in{" "}
                    <strong className="text-[#17345F]">{activeCategory}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {filteredImages.map((img, index) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => openLightbox(index)}
                      className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group cursor-pointer bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F47C61] focus:ring-offset-2"
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1F38]/85 via-[#0E1F38]/20 to-transparent opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-5 text-left">
                        <span className="text-white text-sm sm:text-base font-bold line-clamp-1 leading-snug group-hover:text-[#FBBF24] transition-colors">
                          {img.title}
                        </span>
                        <span className="text-white/80 text-xs sm:text-[13px] font-medium mt-1">
                          {img.category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {filteredImages.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-base text-[#64748B]">No photos found in this category.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={filteredImages.map((img) => ({
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
