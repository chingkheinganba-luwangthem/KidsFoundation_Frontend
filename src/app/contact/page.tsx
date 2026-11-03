import React from "react";
import { Metadata } from "next";
import { getContactPageData, getStrapiMediaUrl } from "@/lib/strapi";
import { CONTACT_PAGE_DATA } from "@/data/contactPage";
import { ContactClient } from "@/components/contact/ContactClient";

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
      : [
          { ...CONTACT_PAGE_DATA.info.address },
          { ...CONTACT_PAGE_DATA.info.phone },
          { ...CONTACT_PAGE_DATA.info.mobile, value: CONTACT_PAGE_DATA.info.mobile.values.join(" / ") },
          { ...CONTACT_PAGE_DATA.info.email },
          { ...CONTACT_PAGE_DATA.info.hours },
        ];

  return (
    <ContactClient
      bannerTitle={strapiData?.bannerTitle || CONTACT_PAGE_DATA.banner.title}
      breadcrumb={strapiData?.breadcrumb || CONTACT_PAGE_DATA.banner.breadcrumb}
      bannerImage={
        strapiData?.bannerImageUrl ||
        getStrapiMediaUrl(strapiData?.bannerImage) ||
        "/images/pages_hero_background_image/contact_hero.jpg"
      }
      getInTouchLabel={strapiData?.getInTouchLabel}
      getInTouchHeading={strapiData?.getInTouchHeading}
      getInTouchDescription={strapiData?.getInTouchDescription}
      contactItems={contactItems}
      formHeading={strapiData?.formHeading}
      formDescription={strapiData?.formDescription}
      formSubmitLabel={strapiData?.formSubmitLabel}
      mapLabel={strapiData?.mapLabel}
      mapHeading={strapiData?.mapHeading}
      mapAddress={strapiData?.mapAddress}
      mapEmbedUrl={strapiData?.mapEmbedUrl || CONTACT_PAGE_DATA.map.embedUrl}
      mapDirectUrl={strapiData?.mapDirectUrl || CONTACT_PAGE_DATA.map.directUrl}
      mapTitle={strapiData?.mapTitle || CONTACT_PAGE_DATA.map.title}
    />
  );
}
