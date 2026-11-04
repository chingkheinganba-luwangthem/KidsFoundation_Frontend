"use client";

import React, { useMemo } from "react";
import { PageBanner } from "@/components/ui/PageBanner";
import { DocumentTable } from "./DocumentTable";
import { ExternalLink, Download } from "lucide-react";
import {
  MandatoryDisclosurePageData,
  DisclosureDocument,
} from "@/types/strapi";
import { getStrapiMediaUrl } from "@/lib/strapi";

interface MandatoryDisclosureClientProps {
  data?: MandatoryDisclosurePageData | null;
}

export function MandatoryDisclosureClient({ data }: MandatoryDisclosureClientProps) {
  // Extract Tables from Strapi
  const tables = data?.Table || [];

  const tableA = useMemo(
    () =>
      tables.find((t) => t.heading?.toLowerCase().includes("general")) ||
      tables[0],
    [tables]
  );

  const tableB = useMemo(
    () =>
      tables.find((t) => t.heading?.toLowerCase().includes("documents")) ||
      tables[1],
    [tables]
  );

  const tableC = useMemo(
    () =>
      tables.find(
        (t) =>
          t.heading?.toLowerCase().includes("academics") ||
          t.heading?.toLowerCase().includes("result and")
      ) || tables[2],
    [tables]
  );

  const tableD = useMemo(
    () =>
      tables.find((t) => t.heading?.toLowerCase().includes("staff")) ||
      tables[3],
    [tables]
  );

  const tableE = useMemo(
    () =>
      tables.find((t) => t.heading?.toLowerCase().includes("infrastructure")) ||
      tables[4],
    [tables]
  );

  // Convert Table B into statutory documents (no badges)
  const documentsB = useMemo<DisclosureDocument[]>(() => {
    if (!tableB?.Row_heading?.[0]?.row_data) return [];

    return tableB.Row_heading[0].row_data.map((row) => {
      const title = row.information?.replace(/\t/g, "").trim() || "";
      const pdfUrl = row.download?.url
        ? getStrapiMediaUrl(row.download.url)
        : undefined;
      const link = pdfUrl || row.url || "#";

      return {
        slNo: row.sl,
        title,
        description: "",
        officialName: title,
        category: "documents",
        hasDoc: Boolean(pdfUrl),
        pdfUrl,
        documentLink: link,
      };
    });
  }, [tableB]);

  // Convert Table C into academic documents (no badges)
  const documentsC = useMemo<DisclosureDocument[]>(() => {
    if (!tableC?.Row_heading?.[0]?.row_data) return [];

    return tableC.Row_heading[0].row_data.map((row) => {
      const title = row.information?.replace(/\t/g, "").trim() || "";
      const pdfUrl = row.download?.url
        ? getStrapiMediaUrl(row.download.url)
        : undefined;
      const link = pdfUrl || row.url || "#";

      return {
        slNo: row.sl,
        title,
        description: row.DETAILS?.replace(/\t/g, "").trim() || "",
        officialName: title,
        category: "academics",
        hasDoc: Boolean(pdfUrl),
        pdfUrl,
        documentLink: link,
      };
    });
  }, [tableC]);

  // Filter and format results from Strapi Result array
  const validResults = useMemo(() => {
    if (!data?.Result || data.Result.length === 0) return [];
    const seenHeadings = new Set<string>();
    const list: { heading: string; headers: string[]; rows: string[][] }[] = [];

    for (const res of data.Result) {
      const rawHeading = res.heading?.trim() || "RESULT";
      if (seenHeadings.has(rawHeading)) continue;
      seenHeadings.add(rawHeading);

      const group = res.Result?.[0];
      const rawRows = group?.ResultTableRowData || [];
      // Keep rows where even at least one field has data
      const filledRows = rawRows.filter((r) =>
        Boolean(
          (r.Sl_No && r.Sl_No.trim() !== "") ||
          (r.YEAR && r.YEAR.trim() !== "") ||
          (r.NoOfRegistration && r.NoOfRegistration.trim() !== "") ||
          (r.NoOfStudentPass && r.NoOfStudentPass.trim() !== "") ||
          (r.PassPercentage && r.PassPercentage.trim() !== "") ||
          (r.Remark && r.Remark.trim() !== "")
        )
      );

      const headers = [
        group?.Sl_No?.replace(/\t/g, "").trim() || "SL.NO",
        group?.YEAR?.replace(/\t/g, "").trim() || "YEAR",
        group?.NO_OF_REGISTERED_STUDENTS?.replace(/\t/g, "").trim() ||
          "NO. OF REGISTERED STUDENTS",
        group?.NoOfStudentPass?.replace(/\t/g, "").trim() ||
          "NO. OF STUDENTS PASSED",
        group?.Pass_Percentage?.replace(/\t/g, "").trim() ||
          "PASS PERCENTAGE",
        group?.REMARKS?.replace(/\t/g, "").trim() || "REMARKS",
      ];

      const formattedRows =
        filledRows.length > 0
          ? filledRows.map((r, i) => [
              r.Sl_No?.trim() || String(i + 1),
              r.YEAR?.trim() || "-",
              r.NoOfRegistration?.trim() || "-",
              r.NoOfStudentPass?.trim() || "-",
              r.PassPercentage
                ? r.PassPercentage.includes("%")
                  ? r.PassPercentage.trim()
                  : `${r.PassPercentage.trim()}%`
                : "-",
              r.Remark?.trim() || "-",
            ])
          : [["1", "-", "-", "-", "-", "-"]];

      list.push({ heading: rawHeading, headers, rows: formattedRows });
    }
    return list;
  }, [data?.Result]);

  const handleDownload = (doc: DisclosureDocument) => {
    if (doc.pdfUrl) {
      window.open(doc.pdfUrl, "_blank");
      return;
    }
    if (doc.documentLink && doc.documentLink !== "#") {
      window.open(doc.documentLink, "_blank");
      return;
    }
  };

  const bannerTitle = data?.Hero?.title || "Mandatory Public Disclosure";
  const bannerBreadcrumb = data?.Hero?.Breadcrumbs || [
    "Home",
    "Mandatory Public Disclosure",
  ];
  const bannerImage = getStrapiMediaUrl(data?.Hero?.hero_background) || undefined;

  const eyebrow = data?.eyebrow || "CBSE AFFILIATION COMPLIANCE";
  const heading = data?.heading || "Public Disclosure Information (SARAS)";
  const description =
    data?.description ||
    "Official institutional disclosure, certificates, academic outcomes, and infrastructure data published in strict compliance with Central Board of Secondary Education directives.";
  const note = data?.Note || "";

  return (
    <div className="relative flex-1 flex flex-col bg-white overflow-x-hidden selection:bg-[#F47C61] selection:text-white">
      <main className="flex-1 flex flex-col">
        {/* Page Banner */}
        <PageBanner
          title={bannerTitle}
          breadcrumb={bannerBreadcrumb}
          image={bannerImage}
        />

        {/* Main Content Area */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px] space-y-12 sm:space-y-14">
            {/* Section Header */}
            <div>
              {eyebrow && (
                <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal">
                  {eyebrow}
                </span>
              )}
              {heading && (
                <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#17345F] leading-[1.25] tracking-tight mb-3 sm:mb-4">
                  {heading}
                </h2>
              )}
              {description && (
                <p className="text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85] max-w-3xl">
                  {description}
                </p>
              )}
            </div>

            {/* ── 1. General Information Section (Table A) ── */}
            {tableA && (
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-[#17345F] tracking-tight">
                  {tableA.heading?.replace(/\t/g, "").trim() ||
                    "A : GENERAL INFORMATION :"}
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#17345F] text-white">
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase w-20 text-center">
                          {tableA.Row_heading?.[0]?.Sl_No?.replace(/\t/g, "").trim() || "SL.NO"}
                        </th>
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase">
                          {tableA.Row_heading?.[0]?.INFORMATION?.replace(/\t/g, "").trim() || "INFORMATION"}
                        </th>
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase">
                          {tableA.Row_heading?.[0]?.DETAILS?.replace(/\t/g, "").trim() || "DETAILS"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tableA.Row_heading?.[0]?.row_data?.map((row, i) => (
                        <tr
                          key={row.id || row.sl || i}
                          className={`hover:bg-[#F4F8FC] transition-colors ${
                            i % 2 === 0 ? "bg-white" : "bg-[#FBFDFE]"
                          }`}
                        >
                          <td className="px-5 py-4 text-xs sm:text-sm text-slate-500 font-semibold text-center">
                            {row.sl}
                          </td>
                          <td className="px-5 py-4 text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">
                            {row.information?.replace(/\t/g, "").trim()}
                          </td>
                          <td className="px-5 py-4 text-xs sm:text-sm text-[#17345F] font-semibold leading-relaxed">
                            {row.DETAILS?.replace(/\t/g, "").trim() || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── 2. Documents & Information Section (Table B) ── */}
            {tableB && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#17345F] tracking-tight">
                    {tableB.heading?.replace(/[\t:]/g, "").trim() ||
                      "B : DOCUMENTS AND INFORMATION"}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {documentsB.length} documents
                  </span>
                </div>

                <DocumentTable
                  documents={documentsB}
                  onDownload={handleDownload}
                />
              </div>
            )}

            {/* ── 3. Result & Academics Section (Table C) ── */}
            {tableC && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#17345F] tracking-tight">
                    {tableC.heading?.replace(/[\t:]/g, "").trim() ||
                      "C : RESULT AND ACADEMICS"}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {documentsC.length} records
                  </span>
                </div>

                <DocumentTable
                  documents={documentsC}
                  onDownload={handleDownload}
                />
              </div>
            )}

            {/* ── 4. Staff (Teaching) Section (Table D) ── */}
            {tableD && (
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-[#17345F] tracking-tight">
                  {tableD.heading?.replace(/\t/g, "").trim() ||
                    "D : STAFF (TEACHING)"}
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#17345F] text-white">
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase w-20 text-center">
                          {tableD.Row_heading?.[0]?.Sl_No?.replace(/\t/g, "").trim() || "SL.NO"}
                        </th>
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase">
                          {tableD.Row_heading?.[0]?.INFORMATION?.replace(/\t/g, "").trim() || "INFORMATION"}
                        </th>
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase">
                          {tableD.Row_heading?.[0]?.DETAILS?.replace(/\t/g, "").trim() || "DETAILS"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tableD.Row_heading?.[0]?.row_data?.map((row, i) => (
                        <tr
                          key={row.id || row.sl || i}
                          className={`hover:bg-[#F4F8FC] transition-colors ${
                            i % 2 === 0 ? "bg-white" : "bg-[#FBFDFE]"
                          }`}
                        >
                          <td className="px-5 py-4 text-xs sm:text-sm text-slate-500 font-semibold text-center">
                            {row.sl}
                          </td>
                          <td className="px-5 py-4 text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">
                            {row.information?.replace(/\t/g, "").trim()}
                          </td>
                          <td className="px-5 py-4 text-xs sm:text-sm text-[#17345F] font-semibold leading-relaxed">
                            {row.DETAILS?.replace(/\t/g, "").trim() || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── 5. Board Results Tables ── */}
            {validResults.map((resultSection, sIdx) => (
              <div key={resultSection.heading + sIdx} className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-[#17345F] tracking-tight">
                  {resultSection.heading}
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#17345F] text-white">
                        {resultSection.headers.map((header, hIdx) => (
                          <th
                            key={header + hIdx}
                            className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {resultSection.rows.map((r, i) => (
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
            ))}

            {/* ── 6. School Infrastructure Section (Table E) ── */}
            {tableE && (
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-[#17345F] tracking-tight">
                  {tableE.heading?.replace(/\t/g, "").trim() ||
                    "E : SCHOOL INFRASTRUCTURE:"}
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#17345F] text-white">
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase w-20 text-center">
                          {tableE.Row_heading?.[0]?.Sl_No?.replace(/\t/g, "").trim() || "SL.NO"}
                        </th>
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase">
                          {tableE.Row_heading?.[0]?.INFORMATION?.replace(/\t/g, "").trim() || "INFORMATION"}
                        </th>
                        <th className="px-5 py-3.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase">
                          {tableE.Row_heading?.[0]?.DETAILS?.replace(/\t/g, "").trim() || "DETAILS"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tableE.Row_heading?.[0]?.row_data?.map((row, i) => {
                        const downloadUrl = row.download?.url
                          ? getStrapiMediaUrl(row.download.url)
                          : undefined;

                        return (
                          <tr
                            key={row.id || row.sl || i}
                            className={`hover:bg-[#F4F8FC] transition-colors ${
                              i % 2 === 0 ? "bg-white" : "bg-[#FBFDFE]"
                            }`}
                          >
                            <td className="px-5 py-4 text-xs sm:text-sm text-slate-500 font-semibold text-center">
                              {row.sl}
                            </td>
                            <td className="px-5 py-4 text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">
                              {row.information?.replace(/\t/g, "").trim()}
                            </td>
                            <td className="px-5 py-4 text-xs sm:text-sm text-[#17345F] font-semibold leading-relaxed">
                              {row.url ? (
                                <a
                                  href={row.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs sm:text-sm text-[#F47C61] hover:text-[#E0684E] font-semibold transition-colors inline-flex items-center gap-1.5"
                                >
                                  <span>{row.DETAILS?.replace(/\t/g, "").trim() || "Click Here"}</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              ) : downloadUrl ? (
                                <a
                                  href={downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs sm:text-sm text-[#F47C61] hover:text-[#E0684E] font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                                >
                                  <span>{row.Download_text?.replace(/\t/g, "").trim() || "Download"}</span>
                                  <Download className="w-3.5 h-3.5" />
                                </a>
                              ) : (
                                row.DETAILS?.replace(/\t/g, "").trim() || "-"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Note Box */}
            {note && (
              <div className="bg-[#FEF9C3] border border-[#FDE047] rounded-2xl p-5 sm:p-6 shadow-xs">
                <p className="text-xs sm:text-sm text-[#92400E] leading-[1.8] font-medium">
                  <strong className="font-bold text-[#78350F]">NOTE:</strong>{" "}
                  {note.replace(/^NOTE:\s*/i, "")}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
