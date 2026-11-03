import React from "react";
import type { Metadata } from "next";
import { MandatoryDisclosureClient } from "@/components/disclosure/MandatoryDisclosureClient";

export const metadata: Metadata = {
  title: "Mandatory Public Disclosure | Kids' Foundation",
  description:
    "Official institutional disclosure, certificates, academic outcomes, and infrastructure data published in compliance with Central Board of Secondary Education (CBSE SARAS) directives for Kids' Foundation, Imphal.",
};

export default function MandatoryPublicDisclosurePage() {
  return <MandatoryDisclosureClient />;
}
