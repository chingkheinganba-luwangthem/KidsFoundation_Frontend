"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Send,
  GraduationCap,
  Sparkles,
  Phone,
  User,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from "lucide-react";

const DEFAULT_STAGES = [
  "Foundational",
  "Preparatory",
  "Middle School",
  "Secondary",
];

interface FloatingEnquireTabProps {
  stages?: string[];
}

export function FloatingEnquireTab({ stages }: FloatingEnquireTabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [strapiStages, setStrapiStages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    studentName: "",
    parentPhone: "",
    grade: "",
    message: "",
  });

  // Client-side fallback to fetch live stages from Strapi if not provided via props
  useEffect(() => {
    if (!stages || stages.length === 0) {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
      fetch(`${strapiUrl}/api/learning-page?populate[stages]=true`)
        .then((res) => res.json())
        .then((json) => {
          if (json?.data?.stages && Array.isArray(json.data.stages)) {
            const list = json.data.stages
              .map((s: { title?: string }) => s.title?.trim())
              .filter((t?: string): t is string => Boolean(t));
            if (list.length > 0) {
              setStrapiStages(list);
            }
          }
        })
        .catch(() => {});
    }
  }, [stages]);

  const stageOptions =
    stages && stages.length > 0
      ? stages
      : strapiStages.length > 0
      ? strapiStages
      : DEFAULT_STAGES;

  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        setFormData({
          studentName: "",
          parentPhone: "",
          grade: "",
          message: "",
        });
      } else {
        setErrorMessage(
          data.message || "Unable to send your enquiry. Please check your details and try again."
        );
      }
    } catch {
      setErrorMessage(
        "Network connection error. Please check your internet connection or call the school office directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ── 1. Floating Right-Side Tab ── */}
      <aside
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center"
        aria-label="Admissions quick enquiry"
      >
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setSubmitted(false);
            setErrorMessage("");
          }}
          className="group relative flex flex-col items-center justify-center bg-gradient-to-b from-[#F47C61] via-[#eb684a] to-[#d95538] text-white py-4 sm:py-5 px-2.5 sm:px-3 rounded-l-2xl shadow-[-6px_4px_24px_rgba(244,124,97,0.45)] hover:shadow-[-8px_6px_28px_rgba(244,124,97,0.6)] border-y border-l border-white/30 transition-all duration-300 hover:-translate-x-1.5 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:ring-offset-2"
          aria-label="Open admission enquiry form"
          title="Admission Enquiry"
        >
          {/* Subtle pulsating beacon dot */}
          <span className="relative flex h-2.5 w-2.5 mb-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FBBF24] opacity-80" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FBBF24]" />
          </span>

          {/* Graduation Cap Icon */}
          <GraduationCap className="w-4 h-4 text-white mb-2 transition-transform duration-300 group-hover:scale-110" />

          {/* Vertical Text */}
          <span className="[writing-mode:vertical-rl] text-[12px] sm:text-[13px] font-extrabold uppercase tracking-widest text-white drop-shadow-sm select-none py-1">
            ENQUIRE NOW
          </span>

          {/* Golden accent bar on the outer left edge */}
          <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#FBBF24] rounded-r-full opacity-70 group-hover:opacity-100 transition-opacity" />
        </button>
      </aside>

      {/* ── 2. Interactive Quick Enquiry Drawer / Modal ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0B1B33]/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-full sm:max-w-md h-full sm:h-auto sm:max-h-[92vh] bg-white sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header: Clean & minimal without 'Admissions 2026-27' and without subtitle */}
            <div className="bg-gradient-to-r from-[#17345F] to-[#22487c] text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-[#FBBF24]/15 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FBBF24]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                    Quick Admission Enquiry
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Close enquiry form"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 flex-1 overflow-y-auto">
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-[#17345F]">
                    Enquiry Received!
                  </h4>
                  <p className="text-slate-600 text-sm max-w-xs mx-auto leading-relaxed">
                    Thank you, <strong>{formData.studentName || "Parent"}</strong>. Our admissions
                    team will get in touch with you shortly.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-2.5 rounded-xl bg-[#17345F] text-white text-xs font-semibold hover:bg-[#122847] transition-all cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
                      {errorMessage}
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Student&apos;s Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.studentName}
                        onChange={(e) =>
                          setFormData({ ...formData, studentName: e.target.value })
                        }
                        placeholder="e.g. Priyo Singh"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#17345F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Parent / Guardian Mobile *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={formData.parentPhone}
                        onChange={(e) =>
                          setFormData({ ...formData, parentPhone: e.target.value })
                        }
                        placeholder="e.g. +91 98765 43210"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#17345F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Class / Grade Seeking Admission *
                    </label>
                    <select
                      required
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#17345F] bg-white cursor-pointer"
                    >
                      <option value="">Select Grade / Stage</option>
                      {stageOptions.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Any specific question? (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="School timing, bus routes, fee structure, etc."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#17345F]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F47C61] hover:bg-[#e0583b] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-[#F47C61]/30 hover:shadow-xl transition-all active:scale-95 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer with link to Prospectus on publications page */}
            <div className="bg-slate-50 border-t border-slate-100 p-4 text-center shrink-0">
              <Link
                href="/news/publications"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#17345F] hover:text-[#F47C61] transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Prospectus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
