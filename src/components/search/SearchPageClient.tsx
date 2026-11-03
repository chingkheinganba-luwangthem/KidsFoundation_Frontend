"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PageBanner } from "@/components/ui/PageBanner";
import { searchSite, SEARCH_INDEX } from "@/data/searchData";
import {
  Search,
  X,
  ArrowRight,
  BookOpen,
  Trophy,
  FileCheck2,
  Phone,
  Sparkles,
  Building2,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Admission",
  "About Us",
  "Sports & Arts",
  "Mandatory Disclosure",
  "Learning & Academics",
  "Campus & Facilities",
  "Contact",
];

const POPULAR_SEARCHES = [
  "Admission",
  "Fee Structure",
  "Sports & Arts",
  "Mandatory Disclosure",
  "CBSE Affiliation",
  "Martial Arts",
  "Academic Calendar",
  "Contact",
];

export function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const [activeCategory, setActiveCategory] = useState("All");

  // Keep query in sync if URL changes
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  // Compute search results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchSite(query, activeCategory);
  }, [query, activeCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleChipClick = (term: string) => {
    setQuery(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Admission":
        return <BookOpen className="w-3.5 h-3.5" />;
      case "Sports & Arts":
        return <Trophy className="w-3.5 h-3.5" />;
      case "Mandatory Disclosure":
        return <FileCheck2 className="w-3.5 h-3.5" />;
      case "Contact":
        return <Phone className="w-3.5 h-3.5" />;
      default:
        return <Building2 className="w-3.5 h-3.5" />;
    }
  };

  // Helper to highlight matching text
  const highlightMatches = (text: string, term: string) => {
    if (!term || !term.trim()) return text;
    const words = term.trim().split(/\s+/).filter(Boolean);
    const regex = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-100 text-[#17345F] font-bold px-0.5 rounded-xs">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative flex-1 flex flex-col bg-white overflow-x-hidden selection:bg-[#F47C61] selection:text-white">
      <main className="flex-1 flex flex-col">
        {/* Banner */}
        <PageBanner
          title="Search"
          breadcrumb={["Search Results"]}
        />

        {/* Search Control & Results Section */}
        <section className="py-12 sm:py-16 bg-[#FAFAF8]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
            {/* Search Input Box */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/90 p-4 sm:p-8 mb-8 sm:mb-10">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-4 sm:left-5 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search admissions, fees, sports, certificates, contact..."
                  className="w-full h-12 sm:h-14 pl-12 sm:pl-14 pr-24 sm:pr-28 rounded-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#17345F]/20 text-[#17345F] text-sm sm:text-base font-medium placeholder:text-slate-400 transition-all"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      router.push("/search");
                    }}
                    className="absolute right-20 sm:right-24 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 sm:right-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#17345F] hover:bg-[#234b85] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
                >
                  Search
                </button>
              </form>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-medium mr-1">Filter by:</span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-[#17345F] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Header */}
            {query.trim() && (
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
                <h2 className="text-base sm:text-lg font-bold text-[#17345F]">
                  Found {results.length} result{results.length === 1 ? "" : "s"}{" "}
                  {activeCategory !== "All" && `in ${activeCategory}`} for{" "}
                  <span className="text-[#D97706]">&ldquo;{query}&rdquo;</span>
                </h2>
                <span className="text-xs text-slate-400">
                  Total indexed: {SEARCH_INDEX.length} topics
                </span>
              </div>
            )}

            {/* Results List */}
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="block bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-[#17345F]/30 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        {/* Category Badge */}
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#D97706] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                            {getCategoryIcon(item.category)}
                            {item.category}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono truncate">
                            {item.href}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-bold text-[#17345F] group-hover:text-[#F47C61] transition-colors leading-snug">
                          {highlightMatches(item.title, query)}
                        </h3>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-2">
                          {highlightMatches(item.description, query)}
                        </p>
                      </div>

                      {/* Right Arrow */}
                      <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#17345F] group-hover:text-white text-slate-400 flex items-center justify-center transition-colors shrink-0 mt-1">
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.trim() ? (
              /* No Results Found */
              <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-[#D97706] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#17345F] mb-2">
                  No matches found for &ldquo;{query}&rdquo;
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                  We couldn&apos;t find anything matching your search. Please check for spelling errors or try one of the popular topics below.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleChipClick(term)}
                      className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-[#17345F] hover:text-white text-xs text-slate-700 font-medium transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Initial State (No Query Entered Yet) */
              <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-[#17345F] flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-[#17345F]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#17345F] mb-2">
                  What are you looking for?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                  Search across our academic programs, admissions process, fee structure, sports activities, campus facilities, and mandatory disclosure certificates.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleChipClick(term)}
                      className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-[#17345F] hover:text-white text-xs text-slate-700 font-medium transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
