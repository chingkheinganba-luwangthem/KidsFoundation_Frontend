import React, { Suspense } from "react";
import type { Metadata } from "next";
import { SearchPageClient } from "@/components/search/SearchPageClient";

export const metadata: Metadata = {
  title: "Search | Kids' Foundation",
  description:
    "Search programs, admissions, sports and arts, mandatory disclosure certificates, and campus information at Kids' Foundation, Imphal.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#17345F] flex items-center justify-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading Search...</span>
          </div>
        </div>
      }
    >
      <SearchPageClient />
    </Suspense>
  );
}
