"use client";

import React from "react";
import { Download, ExternalLink } from "lucide-react";
import { DisclosureDocument } from "@/types/strapi";

interface DocumentTableProps {
  documents: DisclosureDocument[];
  onDownload: (doc: DisclosureDocument) => void;
}

export function DocumentTable({
  documents,
  onDownload,
}: DocumentTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white">
      {/* Table Header Bar - Hidden on mobile, visible on sm+ */}
      <div className="hidden sm:flex bg-[#17345F] text-white px-5 sm:px-8 py-3.5 sm:py-4 items-center font-semibold text-xs sm:text-[13px] tracking-wider uppercase select-none">
        <div className="w-14 sm:w-20 text-center shrink-0">SL NO.</div>
        <div className="flex-1 px-4 sm:px-6">DOCUMENT / INFORMATION</div>
        <div className="w-32 sm:w-44 text-right pr-2 sm:pr-4 shrink-0">
          ACTION
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-slate-100">
        {documents.map((doc, idx) => (
          <div
            key={String(doc.slNo) + idx}
            className={`flex flex-col sm:flex-row sm:items-center px-4 sm:px-8 py-4 sm:py-5 gap-3 sm:gap-0 transition-colors duration-150 ${
              idx % 2 === 0 ? "bg-white" : "bg-[#FBFDFE]"
            } hover:bg-[#F4F8FC]`}
          >
            {/* 1. SL NO. */}
            <div className="flex items-center justify-between sm:justify-center sm:w-14 md:w-20 shrink-0">
              <span className="sm:hidden text-xs font-bold text-slate-400 uppercase tracking-wider">
                SL No.
              </span>
              <span className="text-slate-500 font-semibold text-sm sm:text-base">
                {doc.slNo}
              </span>
            </div>

            {/* 2. DOCUMENT / INFORMATION (Read-only plain text, no links, no badges) */}
            <div className="flex-1 sm:px-4 md:px-6 min-w-0">
              <span className="font-semibold text-[#17345F] text-sm sm:text-[15px] leading-snug block">
                {doc.title}
              </span>

              {/* Description */}
              {doc.description && (
                <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed mt-1">
                  {doc.description}
                </p>
              )}
            </div>

            {/* 3. ACTION (Download button or link) */}
            <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 sm:w-32 md:w-44 shrink-0 border-t border-slate-100 sm:border-t-0">
              {doc.hasDoc ? (
                <button
                  type="button"
                  onClick={() => onDownload(doc)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#17345F] hover:bg-[#234b85] text-white text-xs sm:text-[12.5px] font-semibold transition-all duration-200 shadow-xs hover:shadow-md active:scale-95 cursor-pointer"
                  title={`Download ${doc.title}`}
                  aria-label={`Download ${doc.title}`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              ) : doc.documentLink && doc.documentLink !== "#" ? (
                <a
                  href={doc.documentLink}
                  target={doc.documentLink.startsWith("http") ? "_blank" : undefined}
                  rel={doc.documentLink.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E8EFF8] hover:bg-[#D5E2F3] text-[#17345F] text-xs sm:text-[12.5px] font-semibold transition-colors"
                >
                  <span>View</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
