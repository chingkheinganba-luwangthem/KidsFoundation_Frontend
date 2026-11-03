"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, Calendar, Tag, Share2, Printer, CheckCircle2, ArrowLeft } from "lucide-react";

export interface NewsArticleModalItem {
  id: string;
  date: string;
  title: string;
  description: string;
  category: string;
  image: string;
  imageAlt: string;
  paragraphs?: string[];
  highlights?: string[];
  author?: string;
}

interface NewsReaderModalProps {
  article: NewsArticleModalItem | null;
  onClose: () => void;
}

export function NewsReaderModal({ article, onClose }: NewsReaderModalProps) {
  // Close on Escape key press and prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (article) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [article, onClose]);

  if (!article) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Article link copied to clipboard!");
    }
  };

  // Generate sensible extended paragraphs if not provided
  const fullParagraphs = article.paragraphs && article.paragraphs.length > 0
    ? article.paragraphs
    : [
        article.description,
        "Kids' Foundation remains committed to holistic excellence and fostering a culture of active learning, creative expression, and strong values. The school community works together to support students across academic, co-curricular, and personal growth milestones.",
        "Parents, guardians, and stakeholders are encouraged to stay connected with the school administration for any further updates, inquiries, or participation details. We thank our faculty, staff, and student body for their relentless dedication.",
      ];

  const highlights = article.highlights && article.highlights.length > 0
    ? article.highlights
    : [
        "Official announcement published by Kids' Foundation School Administration",
        "Applicable to students, parents, and faculty members",
        "For additional clarification, contact the administrative office on working days",
      ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 sm:py-4 bg-[#17345F] text-white shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#FBBF24] bg-white/10 px-2.5 py-1 rounded-full whitespace-nowrap">
              {article.category}
            </span>
            <span className="text-xs text-white/70 hidden sm:inline truncate">
              {article.date}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Share Article"
              aria-label="Share article"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer hidden sm:flex"
              title="Print Article"
              aria-label="Print article"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title="Close Article"
              aria-label="Close article"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* Article Image */}
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-md bg-slate-100">
            <Image
              src={article.image}
              alt={article.imageAlt || article.title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Title and Meta */}
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 mb-2.5">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#D97706]">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                <Tag className="w-3.5 h-3.5" />
                {article.category}
              </span>
              {article.author && (
                <>
                  <span>•</span>
                  <span>By {article.author}</span>
                </>
              )}
            </div>

            <h2
              id="news-modal-title"
              className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#17345F] leading-[1.25] tracking-tight"
            >
              {article.title}
            </h2>
            <div className="mt-3.5 w-12 h-1 bg-[#FBBF24] rounded-full" />
          </div>

          {/* Lead Paragraph */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border-l-4 border-[#F47C61] text-sm sm:text-base text-[#17345F] font-semibold leading-relaxed">
            {article.description}
          </div>

          {/* Detailed Paragraphs */}
          <div className="space-y-4 text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85]">
            {fullParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Key Highlights Card */}
          <div className="bg-[#E8EFF8]/70 border border-[#D5E2F3] rounded-2xl p-5 sm:p-6">
            <h4 className="text-xs sm:text-[13px] font-bold text-[#17345F] uppercase tracking-wider mb-3">
              Key Highlights &amp; Information
            </h4>
            <ul className="space-y-2.5">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#475569]">
                  <CheckCircle2 className="w-4 h-4 text-[#F47C61] shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Attribution Footnote */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
            <span>Kids&apos; Foundation School • Official Communications</span>
            <span>Ghari, Imphal-West, Manipur</span>
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
            Back to Articles
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
