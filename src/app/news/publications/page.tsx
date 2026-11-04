import React from "react";
import { Metadata } from "next";
import { getPublicationsPageData } from "@/lib/strapi";
import { Publication } from "@/types/strapi";
import { PublicationsClient } from "@/components/publications/PublicationsClient";

export const instant = false;

export const metadata: Metadata = {
  title: "Publications | Kids' Foundation School",
  description:
    "Official publications, annual magazines, student anthologies, curriculum blueprints, and academic handbooks from Kids' Foundation School, Imphal.",
};

export default async function PublicationsPage() {
  const strapiData = await getPublicationsPageData();

  const publications: Publication[] =
    strapiData?.publications && strapiData.publications.length > 0
      ? strapiData.publications
      : [];

  return (
    <PublicationsClient
      bannerTitle={strapiData?.bannerTitle || "Publications"}
      breadcrumb={
        strapiData?.breadcrumb || ["Home", "News and Events", "Publications"]
      }
      bannerImage={strapiData?.bannerImage || undefined}
      sectionHeading={strapiData?.sectionHeading}
      sectionDescription={strapiData?.sectionDescription}
      categories={
        strapiData?.categories && strapiData.categories.length > 0
          ? strapiData.categories
          : undefined
      }
      publications={publications}
    />
  );
}
