import React from "react";
import type { Metadata } from "next";
import { getEventsPageData } from "@/lib/strapi";
import { EventItem } from "@/types/strapi";
import { EventsClient } from "@/components/events/EventsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "School Events & Activities | Kids' Foundation",
  description:
    "Stay informed about upcoming and past school events, sports meets, cultural celebrations, academic exhibitions, and parent forums at Kids' Foundation, Imphal.",
};

export default async function EventsPage() {
  const strapiData = await getEventsPageData();

  const events: EventItem[] =
    strapiData?.events && strapiData.events.length > 0
      ? strapiData.events
      : [];

  return (
    <EventsClient
      bannerTitle={strapiData?.bannerTitle || "Events"}
      breadcrumb={strapiData?.breadcrumb || ["Home", "Events"]}
      bannerImage={strapiData?.bannerImage || undefined}
      sectionLabel={strapiData?.sectionLabel || "ALL EVENTS"}
      sectionHeading={
        strapiData?.sectionHeading || "What's happening at Kids' Foundation"
      }
      filterOptions={
        strapiData?.filterOptions && strapiData.filterOptions.length > 0
          ? strapiData.filterOptions
          : undefined
      }
      events={events}
    />
  );
}
