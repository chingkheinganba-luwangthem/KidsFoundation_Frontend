"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { PageBanner } from "@/components/ui/PageBanner";
import { NewsUpdateItem } from "@/types/strapi";
import { downloadNoticeDocument } from "@/lib/noticeDownload";
import {
  Calendar,
  Download,
  ChevronDown,
  Search,
  FileText,
  Bell,
} from "lucide-react";

const DEFAULT_CATEGORIES = [
  "All",
  "Circulars & Notices",
  "Academic & Exams",
  "Admissions",
  "Achievements",
  "Events & Culture",
];

interface NewsClientProps {
  bannerTitle?: string;
  breadcrumb?: string[];
  bannerImage?: string;
  sectionLabel?: string;
  sectionHeading?: string;
  categories?: string[];
  articles: NewsUpdateItem[];
}

export function NewsClient({
  bannerTitle = "News & Updates",
  breadcrumb = ["News & Events", "News & Updates"],
  bannerImage,
  sectionLabel = "Official Announcements & Institutional Circulars",
  sectionHeading = "School Notices, Academic Bulletins & News",
  categories = DEFAULT_CATEGORIES,
  articles,
}: NewsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  // Set of expanded article IDs for in-place accordion expansion
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Sort latest on top (descending timestamp)
  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => b.timestamp - a.timestamp);
  }, [articles]);

  // Filtered by category and search
  const filteredArticles = useMemo(() => {
    return sortedArticles.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const cleanSearch = searchQuery.toLowerCase().trim();
      const matchesSearch =
        cleanSearch === "" ||
        item.title.toLowerCase().includes(cleanSearch) ||
        (item.subtitle ? item.subtitle.toLowerCase().includes(cleanSearch) : false) ||
        (item.documentName ? item.documentName.toLowerCase().includes(cleanSearch) : false) ||
        (item.fullContent ? item.fullContent.some((p) => p.toLowerCase().includes(cleanSearch)) : false);

      return matchesCategory && matchesSearch;
    });
  }, [sortedArticles, selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDownload = (e: React.MouseEvent, item: NewsUpdateItem) => {
    e.stopPropagation();
    downloadNoticeDocument(item);
  };

  const expandAll = () => {
    setExpandedIds(new Set(filteredArticles.map((a) => a.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  return (
    <div className="relative flex-1 flex flex-col bg-slate-50 font-sans selection:bg-[#F47C61] selection:text-white">
      <main className="flex-1 flex flex-col">
        {/* Page Banner */}
        <PageBanner
          title={bannerTitle}
          breadcrumb={breadcrumb}
          image={bannerImage || undefined}
        />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px] py-10 sm:py-16 space-y-8">
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
                  placeholder="Search notices, circulars, files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#17345F] focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Results count indicator */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1">
              <span>
                Showing <strong>{filteredArticles.length}</strong> update
                {filteredArticles.length === 1 ? "" : "s"}
                {selectedCategory !== "All" && ` in "${selectedCategory}"`} (Latest on top)
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

          {/* Full Rectangular News & Updates List */}
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Circulars Found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                No announcements match your search or filter. Try switching categories or clearing search keywords.
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
            <div className="space-y-3.5">
              {filteredArticles.map((item) => {
                const isExpanded = expandedIds.has(item.id);

                return (
                  <div
                    key={item.id}
                    className={`w-full bg-white rounded-2xl transition-all duration-300 overflow-hidden border ${
                      isExpanded
                        ? "border-[#F47C61]/50 shadow-md ring-1 ring-[#F47C61]/20"
                        : "border-slate-200 hover:border-slate-300 shadow-sm hover:shadow"
                    }`}
                  >
                    {/* ── Main Rectangular Strip: 2-Line Structured Layout ── */}
                    <div
                      onClick={() => toggleExpand(item.id)}
                      className="p-4 sm:p-5 lg:p-6 cursor-pointer space-y-3 select-none group"
                    >
                      {/* Line 1: Meta Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        {/* Left: Date + Category + Latest */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs sm:text-[13px] font-semibold text-[#D97706] flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            {item.date}
                          </span>

                          <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                            {item.category}
                          </span>

                          {item.isLatest && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                              • Latest
                            </span>
                          )}
                        </div>

                        {/* Right: Download link + Read Full Article link */}
                        <div className="flex items-center gap-4 shrink-0 ml-auto sm:ml-0">
                          {item.hasDocument && (item.documentName || item.documentUrl) && (
                            <button
                              type="button"
                              onClick={(e) => handleDownload(e, item)}
                              title={`Download ${item.documentName || "PDF Document"}`}
                              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors max-w-[200px] sm:max-w-[260px] truncate"
                            >
                              <Download className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{item.documentName || "Download Attachment"}</span>
                            </button>
                          )}

                          {/* Only show Read Full Article button if it's not an image notice */}
                          {!item.noticeImage && (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 text-xs font-medium text-[#17345F] hover:text-[#F47C61] transition-colors"
                              aria-expanded={isExpanded}
                            >
                              <span>{isExpanded ? "Show Less" : "Read Full Article"}</span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Line 2: Heading (acts as link to show/hide uploaded notice image or full details) */}
                      <div className="pt-0.5">
                        <h3 className={`text-base sm:text-lg lg:text-[18px] font-bold leading-snug transition-colors ${
                          item.noticeImage
                            ? "text-[#17345F] group-hover:text-blue-600 underline-offset-4 group-hover:underline"
                            : "text-[#17345F] group-hover:text-blue-600"
                        }`}>
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    {/* ── Expanded Detail Area ── */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/70 px-5 sm:px-7 pt-5 pb-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        {item.noticeImage ? (
                          /* Image notice displayed directly in the section itself */
                          <div className="space-y-4">
                            <div className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2 sm:p-4">
                              <Image
                                src={item.noticeImage}
                                alt={item.title}
                                width={1000}
                                height={1400}
                                className="w-full h-auto object-contain rounded-lg"
                                priority
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Paragraphs: subtitle flows into body as regular text */}
                            <div className="space-y-3 text-sm text-slate-600 leading-[1.8]">
                              {item.subtitle && <p>{item.subtitle}</p>}

                              {item.fullContent?.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                              ))}
                            </div>

                            {item.documentUrl && (
                              <div className="p-3.5 bg-blue-50/80 border border-blue-200/90 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                                      {item.documentName || "Attached Notice Document"}
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                      Official Notice Attachment {item.documentSize && `· ${item.documentSize}`}
                                    </p>
                                  </div>
                                </div>
                                <a
                                  href={item.documentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shrink-0 transition-colors shadow-sm"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Download / View PDF</span>
                                </a>
                              </div>
                            )}

                            {/* Bottom Show Less */}
                            <div className="pt-3 flex items-center justify-end border-t border-slate-200/50">
                              <button
                                type="button"
                                onClick={() => toggleExpand(item.id)}
                                className="inline-flex items-center gap-1 text-xs font-medium text-[#17345F] hover:text-[#F47C61] transition-colors"
                              >
                                <span>Show Less</span>
                                <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
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
