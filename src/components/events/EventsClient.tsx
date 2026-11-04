"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PageBanner } from "@/components/ui/PageBanner";
import { Clock, MapPin, Tag, ArrowRight } from "lucide-react";
import { EventReaderModal } from "@/components/events/EventReaderModal";
import { EventImageCarousel } from "@/components/events/EventImageCarousel";
import type { EventItem } from "@/types/strapi";

export type { EventItem };

export interface EventsClientProps {
  bannerTitle?: string;
  breadcrumb?: string[];
  bannerImage?: string;
  sectionLabel?: string;
  sectionHeading?: string;
  filterOptions?: string[];
  events: EventItem[];
}

function EventCard({
  event,
  onReadEvent,
}: {
  event: EventItem;
  onReadEvent: (event: EventItem) => void;
}) {
  const images =
    event.images && event.images.length > 0
      ? event.images
      : event.image
      ? [event.image]
      : [];

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(23,52,95,0.06)] border border-slate-100 hover:shadow-[0_12px_32px_rgba(23,52,95,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div
        onClick={() => onReadEvent(event)}
        className="relative h-[220px] overflow-hidden flex-shrink-0 cursor-pointer bg-slate-100"
      >
        <EventImageCarousel
          images={images}
          alt={event.imageAlt || event.title}
          interval={3800}
        >
          {/* Calendar Stamp */}
          {event.month && event.day && (
            <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 text-center shadow-sm min-w-[52px]">
              <div className="text-[#F47C61] text-[10px] font-bold uppercase tracking-wider leading-none mb-0.5">
                {event.month}
              </div>
              <div className="text-[#17345F] text-xl font-extrabold leading-none">
                {event.day}
              </div>
            </div>
          )}
          {/* Tag */}
          <div className="absolute top-4 right-4 z-10">
            <span
              className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                event.tag === "upcoming"
                  ? "bg-[#F47C61] text-white"
                  : "bg-slate-700/80 text-white"
              }`}
            >
              {event.tag === "upcoming" ? "Upcoming" : "Past"}
            </span>
          </div>
        </EventImageCarousel>
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-3">
          <Tag className="w-3 h-3 text-[#D97706]" />
          <span className="text-[#D97706] text-xs font-semibold uppercase tracking-wide">
            {event.category}
          </span>
        </div>

        <h3
          onClick={() => onReadEvent(event)}
          className="text-base sm:text-lg font-bold text-[#17345F] leading-[1.4] mb-3 group-hover:text-[#F47C61] transition-colors duration-200 cursor-pointer"
        >
          {event.title}
        </h3>

        <p className="text-sm text-[#475569] leading-[1.75] mb-4 flex-1 line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-1.5 mb-5">
          {event.time && (
            <div className="flex items-center gap-2 text-xs text-[#64748b]">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{event.time}</span>
            </div>
          )}
          {event.venue && (
            <div className="flex items-center gap-2 text-xs text-[#64748b]">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{event.venue}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onReadEvent(event)}
          className="inline-flex items-center gap-1.5 text-[#17345F] font-semibold text-sm group-hover:text-[#F47C61] transition-colors duration-200 cursor-pointer self-start"
          aria-label={`Read more about: ${event.title}`}
        >
          <span>Read Full Details</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}

export function EventsClient({
  bannerTitle = "Events",
  breadcrumb = ["Events"],
  bannerImage,
  sectionLabel = "ALL EVENTS",
  sectionHeading = "What's happening at Kids' Foundation",
  filterOptions = [
    "All",
    "Upcoming",
    "Past",
    "School Events",
    "Academic",
    "Sports",
    "Cultural",
    "Community",
    "Ceremony",
  ],
  events,
}: EventsClientProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const filtered = events.filter((e) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Upcoming") return e.tag === "upcoming";
    if (activeFilter === "Past") return e.tag === "past";
    return e.category === activeFilter;
  });

  return (
    <div className="relative flex-1 flex flex-col overflow-x-hidden selection:bg-[#F47C61] selection:text-white">
      <main className="flex-1 flex flex-col">
        <PageBanner
          title={bannerTitle}
          breadcrumb={breadcrumb}
          image={bannerImage}
        />

        {/* All Events Grid */}
        <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF7F2]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase inline-block leading-normal mb-2.5">
                  {sectionLabel}
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#17345F] leading-[1.25] tracking-tight">
                  {sectionHeading}
                </h2>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-10">
              {filterOptions.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                    activeFilter === cat
                      ? "bg-[#17345F] text-white border-[#17345F]"
                      : "bg-white text-[#475569] border-slate-200 hover:border-[#17345F] hover:text-[#17345F]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-[#475569] text-sm">
                No events found for this filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filtered.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onReadEvent={(ev) => setSelectedEvent(ev)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* In-page Full Event Reader Modal */}
      <EventReaderModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
