"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { GALLERY_ITEMS, GALLERY_HEADER } from "@/data/gallery";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { SectionHeaderData, GalleryItemData, GalleryPageData } from "@/types/strapi";
import { getStrapiMediaUrl } from "@/lib/strapi";

interface GallerySectionProps {
  headerData?: SectionHeaderData | null;
  galleryPageData?: GalleryPageData | null;
  galleryData?: GalleryItemData[] | null;
}

export function GallerySection({
  headerData,
  galleryPageData,
  galleryData,
}: GallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const headerLabel =
    galleryPageData?.sectionLabel ||
    headerData?.label ||
    GALLERY_HEADER.label;

  const headerHeading =
    galleryPageData?.sectionHeading ||
    headerData?.heading ||
    GALLERY_HEADER.heading;

  const headerDescription =
    galleryPageData?.sectionDescription ||
    headerData?.description ||
    GALLERY_HEADER.description;

  const bottomLinkText =
    headerData?.bottomLinkText ||
    GALLERY_HEADER.bottomLinkText;

  const bottomLinkHref =
    headerData?.bottomLinkHref ||
    "/gallery";

  // Dynamic items: latest 6 uploads (sorted newest id first)
  const items = useMemo(() => {
    // 1. Authoritative: from Gallery Page Single Type
    if (galleryPageData?.images && galleryPageData.images.length > 0) {
      const sorted = [...galleryPageData.images].sort(
        (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)
      );

      return sorted.slice(0, 6).map((item, idx) => ({
        id: `gallery-${item.id || idx}`,
        title: item.title,
        category: item.category,
        image:
          item.imageUrl ||
          getStrapiMediaUrl(item.image) ||
          "/images/banner_images/banner.jpg",
        imageAlt: item.alt || item.title,
      }));
    }

    // 2. Fallback: galleryData or GALLERY_ITEMS
    if (galleryData && galleryData.length > 0) {
      return galleryData.slice(0, 6).map((item) => ({
        id: `gallery-${item.id}`,
        title: item.title,
        category: item.category,
        image: getStrapiMediaUrl(item.image) || "/images/banner_images/banner.jpg",
        imageAlt: item.image?.alternativeText || item.title,
      }));
    }

    return GALLERY_ITEMS.slice(0, 6);
  }, [galleryPageData, galleryData]);

  return (
    <section id="gallery" className="py-12 sm:py-16 lg:py-20 relative bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
        {/* Header */}
        <SectionHeading
          label={headerLabel}
          heading={headerHeading}
          description={headerDescription}
          align="center"
          className="mb-8 sm:mb-10"
        />

        {/* Uniform Gallery Grid – All Containers Identical in Size & aspect-[16/10] */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 bg-slate-900 cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Gradient Overlay for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <span className="text-[11px] font-semibold text-[#FBBF24] uppercase tracking-wider mb-1">
                  {item.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold leading-snug drop-shadow-sm">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* View All Gallery CTA */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href={bottomLinkHref}
            className="inline-flex items-center text-[#F47C61] hover:text-[#E0684E] font-semibold text-sm transition-colors group"
          >
            <span>{bottomLinkText}</span>
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={items.map((it) => ({
            src: it.image,
            alt: it.imageAlt,
            title: it.title,
            category: it.category,
          }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}