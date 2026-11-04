import React from "react";
import type { Metadata } from "next";
import { MandatoryDisclosureClient } from "@/components/disclosure/MandatoryDisclosureClient";
import { getMandatoryDisclosurePageData } from "@/lib/strapi";

export const instant = false;

export const metadata: Metadata = {
  title: "Mandatory Public Disclosure | Kids' Foundation",
  description:
    "Official institutional disclosure, certificates, academic outcomes, and infrastructure data published in compliance with Central Board of Secondary Education (CBSE SARAS) directives for Kids' Foundation, Imphal.",
};

export default async function MandatoryPublicDisclosurePage() {
  const data = await getMandatoryDisclosurePageData();
  return <MandatoryDisclosureClient data={data} />;
}
