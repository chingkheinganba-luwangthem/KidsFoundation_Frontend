import React from "react";
import { Metadata } from "next";
import { getContactPageData, getStrapiMediaUrl } from "@/lib/strapi";
import { ContactClient } from "@/components/contact/ContactClient";

export const instant = false;

export const metadata: Metadata = {
  title: "Contact Us | Kids' Foundation School",
  description:
    "Get in touch with Kids' Foundation School, Imphal. Locate our campus on Airport Road, Ghari, or reach out to our admissions and administration desk.",
};

export default async function ContactPage() {
  const strapiData = await getContactPageData();

  const contactItems =
    strapiData?.contactItems && strapiData.contactItems.length > 0
      ? strapiData.contactItems.map((item) => ({
          icon: item.icon,
          label: item.label,
          value:
            Array.isArray(item.values) && item.values.length > 0
              ? item.values.join(" / ")
              : item.value || "",
        }))
      : [];

  return (
    <ContactClient
      bannerTitle={strapiData?.bannerTitle || "Contact Us"}
      breadcrumb={strapiData?.breadcrumb || ["Home", "Contact"]}
      bannerImage={
        strapiData?.bannerImageUrl ||
        getStrapiMediaUrl(strapiData?.bannerImage) ||
        undefined
      }
      getInTouchLabel={strapiData?.getInTouchLabel}
      getInTouchHeading={strapiData?.getInTouchHeading}
      getInTouchDescription={strapiData?.getInTouchDescription}
      contactItems={contactItems}
      formEyebrow={strapiData?.formEyebrow}
      formHeading={strapiData?.formHeading}
      formDescription={strapiData?.formDescription}
      formSubmitLabel={strapiData?.formSubmitLabel}
      mapLabel={strapiData?.mapLabel}
      mapHeading={strapiData?.mapHeading}
      mapAddress={strapiData?.mapAddress}
      mapEmbedUrl={strapiData?.mapEmbedUrl}
      mapDirectUrl={strapiData?.mapDirectUrl}
      mapTitle={strapiData?.mapTitle}
    />
  );
}
