import React from "react";
import { Metadata } from "next";
import { getClubsPageData } from "@/lib/strapi";
import { Club } from "@/types/strapi";
import { ClubsClient } from "@/components/clubs/ClubsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Clubs & Activities | Kids' Foundation School",
  description:
    "Explore student clubs and societies at Kids' Foundation School, cultivating curiosity, leadership, debate, arts, athletics, and STEM skills.",
};

export default async function ClubsAndActivitiesPage() {
  const strapiData = await getClubsPageData();

  const clubs: Club[] =
    strapiData?.clubs && strapiData.clubs.length > 0
      ? strapiData.clubs
      : [];

  return (
    <ClubsClient
      bannerTitle={strapiData?.bannerTitle || "Clubs & Activities"}
      breadcrumb={
        strapiData?.breadcrumb || ["Home", "Clubs & Activities"]
      }
      bannerImage={strapiData?.bannerImage || undefined}
      description={strapiData?.clubs_description || strapiData?.description}
      clubs={clubs}
    />
  );
}
