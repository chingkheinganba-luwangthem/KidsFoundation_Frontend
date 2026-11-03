"use client";

import React, { useEffect } from "react";
import { X, Calendar, BookOpen, Download, FileText, CheckCircle2, Award, Share2 } from "lucide-react";
import { Publication } from "@/types/strapi";
import { downloadPublicationFile } from "@/lib/publicationDownload";

interface PublicationPreviewModalProps {
  publication: Publication | null;
  onClose: () => void;
}

export function PublicationPreviewModal({ publication, onClose }: PublicationPreviewModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (publication) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [publication, onClose]);

  if (!publication) return null;

  const handleDownload = () => {
    downloadPublicationFile(publication);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: publication.title,
          text: publication.description,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Publication link copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B1B33]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#17345F] to-[#244b82] text-white px-5 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FBBF24]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FBBF24] block">
                {publication.category}
              </span>
              <span className="text-xs text-white/70">
                {publication.edition} • {publication.academicYear}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Share Publication"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Title & Metadata Strip */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17345F] tracking-tight leading-snug">
              {publication.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs sm:text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-[#F47C61]" />
                {publication.publishedDate}
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                <FileText className="w-3.5 h-3.5 text-[#17345F]" />
                {publication.pages} Pages
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                {publication.fileSize} ({publication.format})
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                <Award className="w-3.5 h-3.5" />
                CBSE Affiliated Official
              </span>
            </div>
          </div>

          {/* Editorial Note & Overview */}
          <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 sm:p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#17345F] mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#F47C61]" />
              Executive Summary & Scope
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {publication.description}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-500">
              <strong className="text-slate-700">Editor / Published by:</strong> {publication.editorOrAuthor}
            </div>
          </div>

          {/* Chapters & Contents */}
          {publication.highlights && publication.highlights.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-[#17345F] mb-3 uppercase tracking-wider text-xs">
                Key Sections & Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {publication.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/40 border border-amber-100/60 text-xs sm:text-sm text-slate-700 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#F47C61] shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Box */}
          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900">
            <div>
              <p className="font-semibold text-[#17345F]">
                Kids&apos; Foundation School Official Document
              </p>
              <p className="text-slate-500 mt-0.5">
                Affiliation No: 1230049 • Airport Road, Ghari, Imphal-West, Manipur
              </p>
            </div>
            <div className="font-mono bg-white px-3 py-1.5 rounded-md border border-blue-200 text-blue-700 shrink-0 font-medium text-[11px]">
              ID: {publication.id.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="bg-slate-50 border-t border-slate-100 px-5 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-100 transition-colors order-2 sm:order-1"
          >
            Close
          </button>

          <button
            onClick={handleDownload}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#F47C61] hover:bg-[#e0684f] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all order-1 sm:order-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            Download Publication ({publication.fileSize})
          </button>
        </div>
      </div>
    </div>
  );
}
