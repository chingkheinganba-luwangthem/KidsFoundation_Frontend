import React from "react";
import type { Metadata } from "next";
import { getGalleryPageData, getStrapiMediaUrl } from "@/lib/strapi";
import { GalleryClient } from "@/components/gallery/GalleryClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Photo Gallery | Kids' Foundation",
  description:
    "Explore photos and memories of campus life, academics, sports, culture, and events at Kids' Foundation School, Imphal.",
};

export default async function GalleryPage() {
  const strapiData = await getGalleryPageData();

  const hero = strapiData?.gallery_hero;
  const moments = strapiData?.MOMENTS_MEMORIES;

  const banner = {
    title: hero?.title || strapiData?.bannerTitle || "Photo Gallery",
    breadcrumb: hero?.Breadcrumbs || strapiData?.breadcrumb || ["Home", "Gallery"],
    image: getStrapiMediaUrl(hero?.hero_background) || strapiData?.bannerImage || undefined,
  };

  const sectionHeader = {
    label: moments?.eyebrow || strapiData?.sectionLabel || "",
    heading: moments?.heading || strapiData?.sectionHeading || "",
    description: moments?.description || strapiData?.sectionDescription || "",
  };

  const categories = strapiData?.categories || ["All"];

  const images = (strapiData?.images || []).map((img, idx) => ({
    id: img.id || `gal-${idx + 1}`,
    src: img.imageUrl || getStrapiMediaUrl(img.image) || "",
    alt: img.alt || img.title || "Gallery photo",
    category: img.category || "Campus",
    title: img.title || "",
  }));

  return (
    <GalleryClient
      banner={banner}
      sectionHeader={sectionHeader}
      categories={categories}
      images={images}
    />
  );
}
