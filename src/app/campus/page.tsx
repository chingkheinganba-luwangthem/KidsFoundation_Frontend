import React from "react";
import type { Metadata } from "next";
import { getCampusPageData, getStrapiMediaUrl } from "@/lib/strapi";
import { CampusClient } from "@/components/campus/CampusClient";

export const instant = false;

export const metadata: Metadata = {
  title: "Campus Facilities & Tour | Kids' Foundation",
  description:
    "Explore the spacious 2-acre campus, modern facilities, sports grounds, science labs, and classrooms at Kids' Foundation School, Imphal.",
};

export default async function CampusPage() {
  const strapiData = await getCampusPageData();

  if (!strapiData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center py-20">
        <p className="text-slate-500 text-lg">Unable to load Campus information. Please try again later.</p>
      </div>
    );
  }

  const hero = strapiData.Campus_hero;
  const banner = {
    title: hero?.title || strapiData.pageTitle || "Campus",
    breadcrumb:
      hero?.Breadcrumbs && hero.Breadcrumbs.length > 0
        ? hero.Breadcrumbs.filter((b) => b.toLowerCase() !== "home")
        : strapiData.breadcrumb || ["Campus"],
    image: getStrapiMediaUrl(hero?.hero_background),
  };

  const campusSection = strapiData.CAMPUS;
  const intro = {
    heading: campusSection?.eyebrow || strapiData.introHeading || "CAMPUS",
    title: campusSection?.heading || strapiData.introTitle || "Our campus at a glance",
    description: campusSection?.designation || campusSection?.description || strapiData.introDescription || "",
    facilities: strapiData.facilities || [],
  };

  const gallerySection = strapiData.Campus_Gallery;
  const gallery = {
    eyebrow: gallerySection?.eyebrow || "CAMPUS GALLERY",
    heading: gallerySection?.heading || "Explore our spaces",
  };

  const galleryImages = (strapiData.galleryImages || []).map((img, idx) => ({
    src: img.imageUrl || getStrapiMediaUrl(img.image),
    alt: img.alt || `Kids' Foundation Campus space ${idx + 1}`,
  }));

  const tourSection = strapiData.Campus_Virtual_Tour;
  const video = {
    eyebrow: tourSection?.eyebrow || "VIRTUAL TOUR",
    title: tourSection?.heading || strapiData.videoTitle || "School Campus",
    youtubeId: strapiData.youtubeId || "",
    description: tourSection?.caption || strapiData.videoDescription || "",
  };

  return (
    <CampusClient
      banner={banner}
      intro={intro}
      gallery={gallery}
      galleryImages={galleryImages}
      video={video}
    />
  );
}
