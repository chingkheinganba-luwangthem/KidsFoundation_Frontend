import React, { Suspense } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { ExcellenceBanner } from "@/components/home/ExcellenceBanner";
import { AboutSection } from "@/components/home/AboutSection";
import { AcademicStages } from "@/components/home/AcademicStages";
import { FounderMessage } from "@/components/home/FounderMessage";
import { NewsSection } from "@/components/home/NewsSection";
import { GallerySection } from "@/components/home/GallerySection";
import { FloatingEnquireTab } from "@/components/home/FloatingEnquireTab";
import {
  getHomePageData,
  getAboutPageData,
  getLearningPageData,
  getEventsPageData,
  getNewsPageData,
  getGalleryPageData,
} from "@/lib/strapi";

export const instant = false;

export default async function Home() {
  const [
    homeData,
    aboutPageData,
    learningPageData,
    eventsPageData,
    newsPageData,
    galleryPageData,
  ] = await Promise.all([
    getHomePageData(),
    getAboutPageData(),
    getLearningPageData(),
    getEventsPageData(),
    getNewsPageData(),
    getGalleryPageData(),
  ]);

  return (
    <div className="relative flex-1 flex flex-col bg-white overflow-x-hidden selection:bg-[#F47C61] selection:text-white">
      {/* 2. Hero Section */}
      <HeroSection data={homeData?.hero} />

      {/* 3. About Kids' Foundation - dynamic from about-page */}
      <AboutSection
        data={homeData?.about}
        aboutPageData={aboutPageData}
      />

      {/* 3.5 20+ Years of Academic Excellence Ribbon */}
      <ExcellenceBanner data={homeData?.excellenceBanner} />

      {/* 4. Academic Stages - dynamic from learning-page */}
      <AcademicStages
        headerData={homeData?.academicStagesHeader}
        learningPageData={learningPageData}
      />

      {/* 5. Message from the Founder - dynamic from about-page */}
      <FounderMessage
        data={homeData?.founderMessage}
        aboutPageData={aboutPageData}
      />

      {/* 6. News and Updates - dynamic latest 4 events & latest 10 news */}
      <Suspense fallback={null}>
        <NewsSection
          headerData={homeData?.newsSectionHeader}
          newsPageData={newsPageData}
          eventsPageData={eventsPageData}
        />
      </Suspense>

      {/* 7. Photo Gallery - dynamic latest 6 uploads */}
      <GallerySection
        headerData={homeData?.gallerySectionHeader}
        galleryPageData={galleryPageData}
      />

      {/* 9. Floating Enquire Now Right-Side Tab */}
      <FloatingEnquireTab
        stages={learningPageData?.stages?.map((s) => s.title)}
      />
    </div>
  );
}
