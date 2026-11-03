"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Share2,
  ArrowLeft,
} from "lucide-react";

export interface EventModalItem {
  id: string | number;
  date: string;
  month: string;
  day: string;
  year: string;
  title: string;
  description: string;
  category: string;
  image: string;
  imageAlt: string;
  time?: string;
  venue?: string;
  tag: "upcoming" | "past";
  paragraphs?: string[];
  highlights?: string[];
}

interface EventReaderModalProps {
  event: EventModalItem | null;
  onClose: () => void;
}

export function EventReaderModal({ event, onClose }: EventReaderModalProps) {
  // Close on Escape key press and prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (event) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [event, onClose]);

  if (!event) return null;


  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Event link copied to clipboard!");
    }
  };

  const fullParagraphs =
    event.paragraphs && event.paragraphs.length > 0
      ? event.paragraphs
      : [
          event.description,
          "Kids' Foundation regularly organizes diverse co-curricular, athletic, and cultural events to provide students with authentic opportunities to develop leadership, teamwork, self-confidence, and public speaking abilities.",
          "Students, teachers, and parent representatives work collaboratively to ensure every programme is planned with utmost care, fostering safety, discipline, and spirited participation throughout.",
        ];

  const highlights =
    event.highlights && event.highlights.length > 0
      ? event.highlights
      : [
          `Scheduled for ${event.date}${event.time ? ` • ${event.time}` : ""}`,
          `Venue: ${event.venue || "Kids' Foundation Campus, Imphal"}`,
          "Students are required to adhere to the designated event guidelines and dress code",
          "For further participation or registration details, reach out to the event coordinator",
        ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 sm:py-4 bg-[#17345F] text-white shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <span
              className={`text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                event.tag === "upcoming"
                  ? "bg-[#F47C61] text-white"
                  : "bg-white/15 text-white/90"
              }`}
            >
              {event.tag === "upcoming" ? "Upcoming Event" : "Past Event"}
            </span>
            <span className="text-xs text-[#FBBF24] font-medium hidden sm:inline truncate">
              {event.category}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Share Event"
              aria-label="Share event"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title="Close Event Details"
              aria-label="Close event details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* Event Image */}
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-md bg-slate-100">
            <Image
              src={event.image}
              alt={event.imageAlt || event.title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover object-center"
              priority
            />
            {/* Calendar Stamp */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-3.5 py-2 text-center shadow-md min-w-[56px]">
              <div className="text-[#F47C61] text-[11px] font-bold uppercase tracking-wider leading-none mb-0.5">
                {event.month}
              </div>
              <div className="text-[#17345F] text-2xl font-extrabold leading-none">
                {event.day}
              </div>
            </div>
          </div>

          {/* Title and Key Details Meta Grid */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D97706] bg-[#FEF3C7] px-2.5 py-1 rounded-full">
                <Tag className="w-3 h-3" />
                {event.category}
              </span>
            </div>

            <h2
              id="event-modal-title"
              className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#17345F] leading-[1.25] tracking-tight"
            >
              {event.title}
            </h2>
            <div className="mt-3.5 w-12 h-1 bg-[#FBBF24] rounded-full" />
          </div>

          {/* Quick Schedule / Venue Badge Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E8EFF8] text-[#17345F] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Date
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#17345F] block">
                  {event.date}
                </span>
              </div>
            </div>

            {event.time && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E8EFF8] text-[#17345F] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Time
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#17345F] block">
                    {event.time}
                  </span>
                </div>
              </div>
            )}

            {event.venue && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E8EFF8] text-[#17345F] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Venue
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#17345F] block truncate">
                    {event.venue}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Lead Summary */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border-l-4 border-[#F47C61] text-sm sm:text-base text-[#17345F] font-semibold leading-relaxed">
            {event.description}
          </div>

          {/* Extended Details */}
          <div className="space-y-4 text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85]">
            {fullParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Highlights as plain paragraphs */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#17345F] uppercase tracking-wider">Event Highlights &amp; Instructions</p>
            {highlights.map((h, i) => (
              <p key={i} className="text-sm text-[#475569] leading-[1.8]">{h}</p>
            ))}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-5 sm:px-7 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#17345F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#17345F] hover:bg-[#234b85] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
