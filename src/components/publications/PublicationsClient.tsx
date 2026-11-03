"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { PageBanner } from "@/components/ui/PageBanner";
import { Publication } from "@/types/strapi";
import { downloadPublicationFile } from "@/lib/publicationDownload";
import {
  Search,
  BookOpen,
  Download,
  Calendar,
  Eye,
} from "lucide-react";

const DEFAULT_CATEGORIES = [
  "All",
  "Magazine & Newsletter",
  "Academic Handbook",
  "Annual Report",
  "Parent & Student Guide",
];

interface PublicationsClientProps {
  bannerTitle?: string;
  breadcrumb?: string[];
  bannerImage?: string;
  sectionHeading?: string;
  sectionDescription?: string;
  categories?: string[];
  publications: Publication[];
}

export function PublicationsClient({
  bannerTitle = "Publications",
  breadcrumb = ["News & Events", "Publications"],
  bannerImage,
  categories = DEFAULT_CATEGORIES,
  publications,
}: PublicationsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered publications
  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const matchesCategory =
        selectedCategory === "All" || pub.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pub.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pub.highlights && pub.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [publications, selectedCategory, searchQuery]);

  return (
    <div className="relative flex-1 flex flex-col bg-slate-50 font-sans">
      <main className="flex-1 flex flex-col">
        {/* Page Banner */}
        <PageBanner
          title={bannerTitle}
          breadcrumb={breadcrumb}
          image={bannerImage || undefined}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 w-full">

          {/* Search & Category Filter Controls */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-[#17345F] text-white shadow-md shadow-[#17345F]/20"
                        : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[260px] sm:min-w-[320px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search publications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#17345F] focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Results count indicator */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1">
              <span>
                Showing <strong>{filteredPublications.length}</strong> publication
                {filteredPublications.length === 1 ? "" : "s"}
                {selectedCategory !== "All" && ` in "${selectedCategory}"`}
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[#F47C61] hover:underline font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>

          {/* Publications Grid */}
          {filteredPublications.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Publications Found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                No publications match your current filters or search query. Try choosing another
                category or resetting the search.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#17345F] text-white text-sm font-semibold hover:bg-[#122847] transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPublications.map((pub) => {
                const pdfUrl =
                  pub.pdfUrl || (pub.downloadFileName ? `/documents/publications/${pub.downloadFileName}` : "");

                return (
                  <div
                    key={pub.id}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col group"
                  >
                    {/* Book / Magazine Cover Visual */}
                    <a
                      href={pdfUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden block cursor-pointer"
                      title={`Read ${pub.title} in new tab`}
                    >
                      <Image
                        src={pub.coverImage || "/images/banner_images/banner.jpg"}
                        alt={pub.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </a>

                    {/* Card Content */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        {/* Category & PDF Size */}
                        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                          <span className="text-[#17345F] font-semibold text-xs tracking-wide">
                            {pub.category}
                          </span>
                          <span className="text-slate-400 text-xs">
                            {pub.format} • {pub.fileSize}
                          </span>
                        </div>

                        {/* Heading - click opens PDF in new tab */}
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group/link"
                        >
                          <h3 className="text-base sm:text-lg font-bold text-[#17345F] group-hover/link:text-[#F47C61] transition-colors leading-snug line-clamp-2">
                            {pub.title}
                          </h3>
                        </a>

                        {/* Published Date */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#F47C61]" />
                          <span>{pub.publishedDate}</span>
                        </div>
                      </div>

                      {/* Action Buttons: Read (opens in new tab) and Download */}
                      <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100">
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 hover:border-slate-300 hover:text-[#17345F] transition-all active:scale-95 text-center"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#17345F]" />
                          Read
                        </a>

                        <button
                          onClick={() => downloadPublicationFile(pub)}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#F47C61] text-white font-semibold text-xs hover:bg-[#e0684f] shadow-sm hover:shadow transition-all active:scale-95"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
