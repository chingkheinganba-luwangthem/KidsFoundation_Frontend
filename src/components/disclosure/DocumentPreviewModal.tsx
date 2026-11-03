"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  X,
  Download,
  Printer,
  FileCheck2,
  Calendar,
  Building,
  ShieldCheck,
  Award,
} from "lucide-react";
import { DisclosureDocument } from "@/data/disclosurePage";
import { IMAGES } from "@/data/images";

interface DocumentPreviewModalProps {
  document: DisclosureDocument | null;
  onClose: () => void;
  onDownload: (doc: DisclosureDocument) => void;
}

export function DocumentPreviewModal({
  document,
  onClose,
  onDownload,
}: DocumentPreviewModalProps) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (document) {
      window.addEventListener("keydown", handleKeyDown);
      if (typeof window !== "undefined") {
        window.document.body.style.overflow = "hidden";
      }
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (typeof window !== "undefined") {
        window.document.body.style.overflow = "unset";
      }
    };
  }, [document, onClose]);

  if (!document) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 bg-[#17345F] text-white">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-4 h-4 text-[#FBBF24]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs text-white/70 uppercase tracking-wider block font-medium">
                Document Preview
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {document.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onDownload(document)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#17345F] text-xs font-semibold transition-colors"
              title="Download Document"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#17345F] transition-colors"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Document Sheet */}
        <div className="overflow-y-auto p-5 sm:p-8 bg-[#F8FAFC]">
          <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-10 mx-auto max-w-2xl overflow-hidden">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <Image
                src={IMAGES.logo}
                alt=""
                width={380}
                height={380}
                className="object-contain"
              />
            </div>

            {/* Official Header */}
            <div className="text-center pb-5 border-b border-slate-200">
              <div className="flex justify-center items-center gap-3 mb-2">
                <div className="relative w-12 h-12">
                  <Image
                    src={IMAGES.logo}
                    alt="Kids' Foundation"
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
                <div className="text-left">
                  <h4 className="text-[#17345F] font-bold text-base sm:text-lg tracking-wider uppercase leading-tight">
                    KIDS&apos; FOUNDATION
                  </h4>
                  <p className="text-[#D97706] tracking-[0.2em] text-[10px] sm:text-[11px] font-semibold uppercase leading-tight">
                    IMPHAL, MANIPUR • ESTD. 2005
                  </p>
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Affiliated to CBSE, New Delhi • Affiliation No. 1230049 • School Code: 13579
              </p>
              <p className="text-[11px] text-slate-400">
                Airport Road, Ghari, Imphal West, Manipur – 795001
              </p>
            </div>

            {/* Document Title Banner */}
            <div className="my-6 text-center">
              <span className="inline-block px-3 py-1 bg-amber-50 text-[#D97706] border border-amber-200/80 rounded-full text-[11px] font-semibold tracking-wider uppercase mb-2">
                {document.badge}
              </span>
              <h2 className="text-base sm:text-xl font-bold text-[#17345F] uppercase tracking-tight">
                {document.officialName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg mx-auto">
                {document.description}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs mb-6">
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong className="text-slate-800">Ref No:</strong>{" "}
                  {document.refNo}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong className="text-slate-800">Date Issued:</strong>{" "}
                  {document.issueDate}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Building className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong className="text-slate-800">Authority:</strong>{" "}
                  {document.authority}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong className="text-slate-800">Validity:</strong>{" "}
                  {document.validity}
                </span>
              </div>
            </div>

            {/* Document Verification Body */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-5">
              <p>
                This certifies that the official record titled <strong>{document.title}</strong> has been duly issued, verified, and uploaded as part of the Central Board of Secondary Education (CBSE) Mandatory Public Disclosure (SARAS compliance).
              </p>
              <p>
                The document is verified to be accurate and fully compliant with the provisions of CBSE Affiliation Bye-Laws and all statutory regulatory requirements of the Government of Manipur.
              </p>

              {/* Status Box */}
              <div className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200/80 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block">Status: Verified & Active</span>
                  <span className="text-[11px] text-emerald-700">
                    Officially endorsed by Kids&apos; Foundation Management & Liaison Office.
                  </span>
                </div>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-end justify-between text-center">
              <div>
                <div className="w-20 h-8 mx-auto flex items-center justify-center text-slate-400 font-serif italic text-xs">
                  [Signed]
                </div>
                <div className="w-28 h-px bg-slate-300 mx-auto my-1" />
                <span className="text-[11px] font-bold text-[#17345F] block">
                  Ch. Sunitibala Devi
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Principal, Kids&apos; Foundation
                </span>
              </div>

              {/* Official Seal badge */}
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#17345F]/30 flex flex-col items-center justify-center p-1 text-[9px] text-[#17345F] font-bold uppercase leading-tight">
                <span>OFFICIAL</span>
                <span>SEAL</span>
              </div>

              <div>
                <div className="w-20 h-8 mx-auto flex items-center justify-center text-slate-400 font-serif italic text-xs">
                  [Attested]
                </div>
                <div className="w-28 h-px bg-slate-300 mx-auto my-1" />
                <span className="text-[11px] font-bold text-[#17345F] block">
                  Managing Trustee
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Kids&apos; Foundation Trust
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 sm:px-7 py-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            File Size: {document.fileSize || "1.2 MB"} • PDF Format
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onDownload(document)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#17345F] hover:bg-[#234b85] text-white font-semibold transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download Verified PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
