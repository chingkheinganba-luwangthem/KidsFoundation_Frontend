"use client";

import React, { useState, useMemo } from "react";
import { PageBanner } from "@/components/ui/PageBanner";
import {
  DISCLOSURE_PAGE_DATA,
  DisclosureDocument,
} from "@/data/disclosurePage";
import { DocumentTable } from "./DocumentTable";
import { DocumentPreviewModal } from "./DocumentPreviewModal";
import {
  FileText,
  ShieldCheck,
  GraduationCap,
  Info,
  Users,
  Building2,
  ExternalLink,
} from "lucide-react";

export function MandatoryDisclosureClient() {
  const { banner, documents, sections, note } = DISCLOSURE_PAGE_DATA;

  // State for active filter tab: 'all' | 'documents' | 'academics' | 'general' | 'staff' | 'infrastructure'
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedDoc, setSelectedDoc] = useState<DisclosureDocument | null>(
    null
  );

  // Filtered documents for the document table
  const filteredDocs = useMemo(() => {
    if (activeTab === "all") return documents;
    if (activeTab === "documents")
      return documents.filter((d) => d.category === "documents");
    if (activeTab === "academics")
      return documents.filter((d) => d.category === "academics");
    return documents;
  }, [documents, activeTab]);

  const handleDownload = (doc: DisclosureDocument) => {
    if (doc.documentLink && doc.documentLink !== "#") {
      window.open(doc.documentLink, "_blank");
      return;
    }

    const content = `=====================================================
KIDS' FOUNDATION SCHOOL, IMPHAL - CBSE SARAS DISCLOSURE
Affiliation No. 1230049 | School Code: 13579
Airport Road, Ghari, Imphal West, Manipur - 795001
=====================================================

DOCUMENT TITLE: ${doc.title}
OFFICIAL RECORD: ${doc.officialName}
STATUS / BADGE: ${doc.badge}
REFERENCE NO: ${doc.refNo}
ISSUED ON: ${doc.issueDate}
ISSUING AUTHORITY: ${doc.authority}
VALIDITY: ${doc.validity}

DESCRIPTION:
${doc.description}

COMPLIANCE DECLARATION:
This official certificate has been verified and uploaded in strict compliance with Central Board of Secondary Education (CBSE) Mandatory Public Disclosure guidelines (SARAS). All provisions of the RTE Act and State Government regulations are duly adhered to.

Principal / Authorized Signatory
Kids' Foundation, Imphal
=====================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Kids_Foundation_${doc.title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative flex-1 flex flex-col bg-white overflow-x-hidden selection:bg-[#F47C61] selection:text-white">
      <main className="flex-1 flex flex-col">
        {/* Page Banner */}
        <PageBanner title={banner.title} breadcrumb={banner.breadcrumb} />

        {/* Main Content Area */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px] space-y-10 sm:space-y-12">
            {/* Section Header */}
            <div>
              <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal">
                CBSE AFFILIATION COMPLIANCE
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#17345F] leading-[1.25] tracking-tight mb-3 sm:mb-4">
                Public Disclosure Information (SARAS)
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85] max-w-3xl">
                Official institutional disclosure, certificates, academic outcomes, and infrastructure data published in strict compliance with Central Board of Secondary Education directives.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "bg-[#17345F] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                All Documents ({documents.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("documents")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "documents"
                    ? "bg-[#17345F] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Certificates & Affiliation (9)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("academics")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "academics"
                    ? "bg-[#17345F] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Result & Academics (5)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "general"
                    ? "bg-[#17345F] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                General Info
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("staff")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "staff"
                    ? "bg-[#17345F] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Staff (Teaching)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("infrastructure")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "infrastructure"
                    ? "bg-[#17345F] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Infrastructure
              </button>
            </div>

            {/* ── 1. Document Table View (Exact Design from Reference Image) ── */}
            {(activeTab === "all" ||
              activeTab === "documents" ||
              activeTab === "academics") && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#17345F] tracking-tight">
                    {activeTab === "documents"
                      ? "B. Statutory Documents & Information"
                      : activeTab === "academics"
                      ? "C. Result & Academic Documents"
                      : "Official Documents & Mandatory Certifications"}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Showing {filteredDocs.length} documents
                  </span>
                </div>

                {/* The Exact Table matching user's requested layout */}
                <DocumentTable
                  documents={filteredDocs}
                  onPreview={(doc) => setSelectedDoc(doc)}
                  onDownload={handleDownload}
                />
              </div>
            )}

            {/* ── 2. General Information Section ── */}
            {(activeTab === "general" || activeTab === "all") && (
              <div className="space-y-4 pt-4">
                <h3 className="text-xl sm:text-2xl font-bold text-[#17345F] tracking-tight">
                  {sections.generalInformation.title}
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#17345F] text-white">
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase w-20 text-center">
                          SL.NO
                        </th>
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase">
                          INFORMATION
                        </th>
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase">
                          DETAILS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sections.generalInformation.rows.map((row, i) => (
                        <tr
                          key={row.slNo}
                          className={`hover:bg-[#F4F8FC] transition-colors ${
                            i % 2 === 0 ? "bg-white" : "bg-[#FBFDFE]"
                          }`}
                        >
                          <td className="px-5 py-4 text-xs sm:text-sm text-slate-500 font-semibold text-center">
                            {row.slNo}
                          </td>
                          <td className="px-5 py-4 text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">
                            {row.information}
                          </td>
                          <td className="px-5 py-4 text-xs sm:text-sm text-[#17345F] font-semibold leading-relaxed">
                            {row.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── 3. Staff (Teaching) Section ── */}
            {(activeTab === "staff" || activeTab === "all") && (
              <div className="space-y-4 pt-4">
                <h3 className="text-xl sm:text-2xl font-bold text-[#17345F] tracking-tight">
                  {sections.staffTeaching.title}
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#17345F] text-white">
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase w-20 text-center">
                          SL.NO
                        </th>
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase">
                          INFORMATION
                        </th>
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase">
                          DETAILS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sections.staffTeaching.rows.map((row, i) => (
                        <tr
                          key={row.slNo}
                          className={`hover:bg-[#F4F8FC] transition-colors ${
                            i % 2 === 0 ? "bg-white" : "bg-[#FBFDFE]"
                          }`}
                        >
                          <td className="px-5 py-4 text-xs sm:text-sm text-slate-500 font-semibold text-center">
                            {row.slNo}
                          </td>
                          <td className="px-5 py-4 text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">
                            {row.information}
                          </td>
                          <td className="px-5 py-4 text-xs sm:text-sm text-[#17345F] font-semibold leading-relaxed">
                            {row.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── 4. Board Results Table ── */}
            {(activeTab === "academics" || activeTab === "all") && (
              <div className="space-y-4 pt-4">
                <h3 className="text-xl sm:text-2xl font-bold text-[#17345F] tracking-tight">
                  {sections.resultClassX.title}
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#17345F] text-white">
                        {sections.resultClassX.headers.map((header) => (
                          <th
                            key={header}
                            className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sections.resultClassX.rows.map((r, i) => (
                        <tr
                          key={i}
                          className={`hover:bg-[#F4F8FC] transition-colors ${
                            i % 2 === 0 ? "bg-white" : "bg-[#FBFDFE]"
                          }`}
                        >
                          {r.map((c, j) => (
                            <td
                              key={j}
                              className={`px-5 py-4 text-xs sm:text-sm leading-relaxed ${
                                j === 4
                                  ? "font-bold text-emerald-600"
                                  : j === 0
                                  ? "text-slate-500 font-semibold"
                                  : "text-[#17345F]"
                              }`}
                            >
                              {c}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── 5. School Infrastructure Section ── */}
            {(activeTab === "infrastructure" || activeTab === "all") && (
              <div className="space-y-4 pt-4">
                <h3 className="text-xl sm:text-2xl font-bold text-[#17345F] tracking-tight">
                  {sections.schoolInfrastructure.title}
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#17345F] text-white">
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase w-20 text-center">
                          SL.NO
                        </th>
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase">
                          INFORMATION
                        </th>
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase">
                          DETAILS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sections.schoolInfrastructure.rows.map((row, i) => (
                        <tr
                          key={row.slNo}
                          className={`hover:bg-[#F4F8FC] transition-colors ${
                            i % 2 === 0 ? "bg-white" : "bg-[#FBFDFE]"
                          }`}
                        >
                          <td className="px-5 py-4 text-xs sm:text-sm text-slate-500 font-semibold text-center">
                            {row.slNo}
                          </td>
                          <td className="px-5 py-4 text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">
                            {row.information}
                          </td>
                          <td className="px-5 py-4 text-xs sm:text-sm text-[#17345F] font-semibold leading-relaxed">
                            {row.details === "Click Here" ? (
                              <a
                                href={
                                  row.slNo === 7
                                    ? "https://youtu.be/2W6amTtl77s"
                                    : "#"
                                }
                                target={row.slNo === 7 ? "_blank" : undefined}
                                rel={
                                  row.slNo === 7
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                                className="text-xs sm:text-sm text-[#F47C61] hover:text-[#E0684E] font-semibold transition-colors inline-flex items-center gap-1"
                              >
                                View Media <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : row.details === "Download" ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDownload({
                                    slNo: row.slNo,
                                    title: row.information,
                                    badge: "Official",
                                    description: row.information,
                                    officialName: row.information,
                                    refNo: `KF/INFRA/${row.slNo}`,
                                    issueDate: "Current",
                                    authority: "Kids' Foundation",
                                    validity: "Permanent",
                                    category: "documents",
                                    hasDoc: true,
                                    documentLink: "#",
                                  })
                                }
                                className="text-xs sm:text-sm text-[#F47C61] hover:text-[#E0684E] font-semibold transition-colors cursor-pointer"
                              >
                                Download Doc
                              </button>
                            ) : (
                              row.details
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Note Box */}
            <div className="bg-[#FEF9C3] border border-[#FDE047] rounded-2xl p-5 sm:p-6 shadow-xs">
              <p className="text-xs sm:text-sm text-[#92400E] leading-[1.8] font-medium">
                <strong className="font-bold text-[#78350F]">NOTE:</strong>{" "}
                {note}
              </p>
            </div>
          </div>
        </section>

        {/* Document Preview Modal */}
        <DocumentPreviewModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onDownload={handleDownload}
        />
      </main>
    </div>
  );
}
