"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsCard } from "@/components/ui/NewsCard";
import { cn } from "@/lib/utils";
import { SectionHeaderData, NewsArticleData, NewsPageData, EventsPageData } from "@/types/strapi";
import { getStrapiMediaUrl } from "@/lib/strapi";
import { formatAndSortNewsArticles, formatDisplayDate } from "@/lib/newsHelper";
import { NewsItem } from "@/types";

const HOME_NEWS_TABS = [
  { id: "news", number: "01.", label: "News & Updates" },
  { id: "events", number: "02.", label: "Events" },
] as const;

function CustomScrollbar({ scrollContainerRef }: { scrollContainerRef: React.RefObject<HTMLDivElement | null> }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumbHeight, setThumbHeight] = useState(50);
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);

  const updateThumb = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight <= clientHeight) {
      setThumbHeight(0);
      return;
    }
    const trackHeight = (trackRef.current?.clientHeight || clientHeight) - 0;
    const ratio = clientHeight / scrollHeight;
    const newThumbHeight = Math.max(40, ratio * trackHeight);
    const maxThumbTop = trackHeight - newThumbHeight;
    const scrollRatio = scrollTop / (scrollHeight - clientHeight);
    setThumbHeight(newThumbHeight);
    setThumbTop(scrollRatio * maxThumbTop);
  }, [scrollContainerRef]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    updateThumb();
    el.addEventListener("scroll", updateThumb, { passive: true });
    const observer = new ResizeObserver(updateThumb);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateThumb);
      observer.disconnect();
    };
  }, [scrollContainerRef, updateThumb]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartScrollTop.current = scrollContainerRef.current?.scrollTop || 0;
  }, [scrollContainerRef]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      const el = scrollContainerRef.current;
      const track = trackRef.current;
      if (!el || !track) return;
      const deltaY = e.clientY - dragStartY.current;
      const trackHeight = track.clientHeight;
      const scrollableHeight = el.scrollHeight - el.clientHeight;
      const maxThumbTop = trackHeight - thumbHeight;
      const scrollDelta = (deltaY / maxThumbTop) * scrollableHeight;
      el.scrollTop = dragStartScrollTop.current + scrollDelta;
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, scrollContainerRef, thumbHeight]);

  const scrollStep = useCallback((direction: "up" | "down") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ top: direction === "up" ? -80 : 80, behavior: "smooth" });
  }, [scrollContainerRef]);

  if (thumbHeight === 0) return null;

  return (
    <div className="absolute right-2 sm:right-3 top-4 bottom-4 flex flex-col items-center w-[18px] z-10 select-none">
      {/* Up arrow button */}
      <button
        onClick={() => scrollStep("up")}
        aria-label="Scroll up"
        className="w-[18px] h-[18px] rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.1)] flex items-center justify-center flex-shrink-0 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
          <path d="M4 0.5L7 4.5H1L4 0.5Z" fill="#3B4F6B" />
        </svg>
      </button>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex-1 w-[10px] my-1.5 rounded-full relative"
        style={{ backgroundColor: "#CDD8EA" }}
        onClick={(e) => {
          const track = trackRef.current;
          const el = scrollContainerRef.current;
          if (!track || !el) return;
          const rect = track.getBoundingClientRect();
          const clickY = e.clientY - rect.top;
          const trackHeight = rect.height;
          const scrollableHeight = el.scrollHeight - el.clientHeight;
          const ratio = clickY / trackHeight;
          el.scrollTo({ top: ratio * scrollableHeight, behavior: "smooth" });
        }}
      >
        {/* Thumb */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute left-1/2 -translate-x-1/2 rounded-full cursor-grab active:cursor-grabbing transition-shadow"
          style={{
            width: 8,
            height: thumbHeight,
            top: thumbTop,
            backgroundColor: "#FFFFFF",
            boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
          }}
        />
      </div>

      {/* Down arrow button */}
      <button
        onClick={() => scrollStep("down")}
        aria-label="Scroll down"
        className="w-[18px] h-[18px] rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.1)] flex items-center justify-center flex-shrink-0 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
          <path d="M4 4.5L1 0.5H7L4 4.5Z" fill="#3B4F6B" />
        </svg>
      </button>
    </div>
  );
}

interface NewsSectionProps {
  headerData?: SectionHeaderData | null;
  newsPageData?: NewsPageData | null;
  eventsPageData?: EventsPageData | null;
  articlesData?: NewsArticleData[] | null;
}

export function NewsSection({
  headerData,
  newsPageData,
  eventsPageData,
  articlesData,
}: NewsSectionProps) {
  const [activeTab, setActiveTab] = useState<"news" | "events">("news");
  const newsScrollRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  const headerLabel = headerData?.label || "LATEST ANNOUNCEMENTS";
  const headerHeading = headerData?.heading || "What's new at Kids' Foundation";
  const headerDescription = headerData?.description || "";

  // 1. Dynamic Events: Latest 4 uploads from eventsPageData
  const eventItems = useMemo<NewsItem[]>(() => {
    if (eventsPageData?.events && eventsPageData.events.length > 0) {
      // Upcoming events first, latest upload (newest id first) on top of all
      const sorted = [...eventsPageData.events].sort((a, b) => {
        const aIsUpcoming = a.tag === "upcoming" ? 1 : 0;
        const bIsUpcoming = b.tag === "upcoming" ? 1 : 0;
        if (bIsUpcoming !== aIsUpcoming) {
          return bIsUpcoming - aIsUpcoming;
        }
        const idDiff = (Number(b.rawId ?? b.id) || 0) - (Number(a.rawId ?? a.id) || 0);
        if (idDiff !== 0) return idDiff;
        const aTime = new Date(a.date).getTime() || 0;
        const bTime = new Date(b.date).getTime() || 0;
        return bTime - aTime;
      });
      return sorted.slice(0, 4).map((ev, idx) => ({
        id: ev.eventId || String(ev.id || idx),
        date: formatDisplayDate(ev.date) || ev.date,
        title: ev.title,
        description: ev.description || "",
        category: "events",
        image:
          ev.imageUrl ||
          (typeof ev.image === "string"
            ? ev.image
            : getStrapiMediaUrl(ev.image)) ||
          "/images/banner_images/banner.jpg",
        imageAlt: ev.title,
        linkHref: "/events",
      }));
    }
    return [];
  }, [eventsPageData]);

  const [mounted, setMounted] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState<number | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
    setCurrentTimestamp(Date.now());
  }, []);

  // 2. Dynamic News: Exact same data as /news page, sorted latest-on-top, max 10
  const latest10News = useMemo(() => {
    if (newsPageData?.articles && newsPageData.articles.length > 0) {
      const thresholdDays = newsPageData.latestDaysThreshold || 14;
      const sorted = formatAndSortNewsArticles(newsPageData.articles, thresholdDays, currentTimestamp);

      return sorted.slice(0, 10).map((a) => ({
        id: a.id,
        date: a.date,
        title: a.title,
        isLatest: a.isLatest,
        category: a.category,
        linkHref: "/news",
      }));
    }

    // Fallback to articlesData
    if (articlesData && articlesData.length > 0) {
      return articlesData.slice(0, 10).map((a) => ({
        id: a.slug || `article-${a.id}`,
        date: formatDisplayDate(a.publishedDate ? a.publishedDate.split("T")[0] : ""),
        title: a.title,
        isLatest: false,
        category: a.category || "News",
        linkHref: "/news",
      }));
    }

    return [];
  }, [newsPageData, articlesData, currentTimestamp]);

  // Auto-scroll vertically for news list with smooth progression and pause on hover
  useEffect(() => {
    if (activeTab !== "news") return;
    const el = newsScrollRef.current;
    if (!el) return;

    let animationFrameId: number;
    let accumulated = 0;

    const step = () => {
      if (!isHoveredRef.current && el) {
        accumulated += 0.5; // gentle, readable auto-scroll speed
        if (accumulated >= 1) {
          const pixels = Math.floor(accumulated);
          accumulated -= pixels;

          // When reached the end, smoothly loop back to top
          if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
            el.scrollTop = 0;
          } else {
            el.scrollTop += pixels;
          }
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab, latest10News]);

  return (
    <section id="news" className="py-12 sm:py-16 lg:py-20 bg-[#FAF7F2] relative overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
        {/* Header */}
        <SectionHeading
          label={headerLabel}
          heading={headerHeading}
          description={headerDescription}
          align="center"
          className="mb-6 sm:mb-8"
        />

        {/* Tabs: 01. News & Updates | 02. Events */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div
            role="tablist"
            aria-label="News and Events Tabs"
            className="inline-flex items-center gap-2 sm:gap-5 bg-[#E8EFF8] px-3.5 sm:px-6 py-2 rounded-full border border-[#D5E2F3]"
          >
            {HOME_NEWS_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id as "news" | "events")}
                  className={cn(
                    "relative py-1 px-2.5 text-xs sm:text-[13px] font-semibold transition-all cursor-pointer select-none flex items-center gap-1.5",
                    isActive
                      ? "text-[#17345F]"
                      : "text-[#64748B] hover:text-[#17345F]"
                  )}
                >
                  <span className="text-[#F47C61] font-bold">{tab.number}</span>
                  <span>{tab.label}</span>

                  {isActive && (
                    <span className="absolute -bottom-1 left-1 right-1 h-[2px] bg-[#F47C61] rounded-full animate-in fade-in" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content: List for News & Updates, Cards for Events */}
        {activeTab === "news" ? (
          <div className="relative max-w-[950px] mx-auto">
            {/* Outer container with flat blue background and clipping */}
            <div
              className="bg-[#E8EEF6] rounded-3xl p-3 sm:p-5 overflow-hidden relative"
              onMouseEnter={() => {
                isHoveredRef.current = true;
              }}
              onMouseLeave={() => {
                isHoveredRef.current = false;
              }}
              onTouchStart={() => {
                isHoveredRef.current = true;
              }}
              onTouchEnd={() => {
                isHoveredRef.current = false;
              }}
            >
              {/* Custom scrollbar */}
              <CustomScrollbar scrollContainerRef={newsScrollRef} />

              {/* Scrollable news list — native scrollbar hidden */}
              <div
                ref={newsScrollRef}
                className="news-scroll-container flex flex-col gap-2.5 sm:gap-3.5 max-h-[380px] overflow-y-auto pr-6 sm:pr-9"
              >
                {latest10News.map((item) => (
                  <Link
                    key={item.id}
                    href={item.linkHref}
                    className="group flex flex-col sm:flex-row sm:items-center rounded-2xl px-4 sm:px-7 py-3.5 sm:py-4.5 shadow-[0_2px_12px_rgba(23,52,95,0.04)] hover:shadow-[0_6px_20px_rgba(23,52,95,0.08)] transition-all duration-300 hover:-translate-y-0.5 flex-shrink-0 bg-white gap-2 sm:gap-0 min-w-0"
                  >
                    {/* Date + Optional Latest badge */}
                    <div className="flex items-center gap-2.5 flex-wrap sm:min-w-[170px] shrink-0" suppressHydrationWarning>
                      <span className="text-[11px] sm:text-xs font-semibold text-[#D97706] tracking-wide whitespace-nowrap">
                        {item.date}
                      </span>
                      {mounted && item.isLatest && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200/80 px-1.5 py-0.5 rounded-md">
                          • Latest
                        </span>
                      )}
                    </div>

                    {/* Title - strictly one line only (no two lines) */}
                    <h3
                      title={item.title}
                      className="flex-1 min-w-0 text-sm sm:text-base font-bold text-[#17345F] leading-normal group-hover:text-[#F47C61] transition-colors pl-0 sm:pl-4 truncate"
                    >
                      {item.title}
                    </h3>

                    {/* Arrow */}
                    <span className="hidden sm:inline-block ml-4 sm:ml-6 text-[#F47C61] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {eventItems.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Bottom Link */}
        <div className="mt-8 sm:mt-10 text-center">
          <Link
            href={activeTab === "news" ? "/news" : "/events"}
            className="inline-flex items-center text-[#F47C61] hover:text-[#E0684E] font-semibold text-sm transition-colors group"
          >
            <span>
              {activeTab === "news"
                ? "View all news & notices →"
                : "View all events →"}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
