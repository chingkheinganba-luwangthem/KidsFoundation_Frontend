"use client";

import React from "react";
import { Eye, Download } from "lucide-react";
import { DisclosureDocument } from "@/data/disclosurePage";

interface DocumentTableProps {
  documents: DisclosureDocument[];
  onPreview: (doc: DisclosureDocument) => void;
  onDownload: (doc: DisclosureDocument) => void;
}

export function DocumentTable({
  documents,
  onPreview,
  onDownload,
}: DocumentTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white">
      {/* Table Header Bar - Hidden on mobile, visible on sm+ */}
      <div className="hidden sm:flex bg-[#17345F] text-white px-5 sm:px-8 py-3.5 sm:py-4 items-center font-semibold text-xs sm:text-[13px] tracking-wider uppercase select-none">
        <div className="w-14 sm:w-20 text-center shrink-0">SL NO.</div>
        <div className="flex-1 px-4 sm:px-6">DOCUMENT / INFORMATION</div>
        <div className="w-36 sm:w-52 text-right pr-2 sm:pr-4 shrink-0">
          ACTION
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-slate-100">
        {documents.map((doc, idx) => (
          <div
            key={doc.slNo}
            className={`flex flex-col sm:flex-row sm:items-center px-4 sm:px-8 py-4 sm:py-5 gap-3 sm:gap-0 transition-colors duration-150 group ${
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

            {/* 2. DOCUMENT / INFORMATION */}
            <div className="flex-1 sm:px-4 md:px-6 min-w-0">
              {/* Title & Badge */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => onPreview(doc)}
                  className="text-left font-bold text-[#17345F] hover:text-[#F47C61] text-sm sm:text-[15px] leading-snug transition-colors cursor-pointer"
                >
                  {doc.title}
                </button>

                {doc.badge && (
                  <span className="inline-flex items-center text-[10.5px] sm:text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/70 whitespace-nowrap">
                    {doc.badge}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-[13px] text-[#64748B] leading-relaxed mt-1">
                {doc.description}
              </p>
            </div>

            {/* 3. ACTION BUTTONS */}
            <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 sm:w-36 md:w-52 shrink-0 border-t border-slate-100 sm:border-t-0">
              {/* Preview Button */}
              <button
                type="button"
                onClick={() => onPreview(doc)}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#17345F] hover:bg-[#234b85] text-white text-xs sm:text-[12.5px] font-semibold transition-all duration-200 shadow-xs hover:shadow-md active:scale-95 cursor-pointer"
                title={`Preview ${doc.title}`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              {/* Download Icon Button */}
              <button
                type="button"
                onClick={() => onDownload(doc)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-[#17345F] hover:bg-slate-100 transition-colors cursor-pointer"
                title={`Download ${doc.title}`}
                aria-label={`Download ${doc.title}`}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
