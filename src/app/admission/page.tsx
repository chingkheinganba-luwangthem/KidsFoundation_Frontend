import React from "react";
import type { Metadata } from "next";
import { PageBanner } from "@/components/ui/PageBanner";
import { Download } from "lucide-react";
import { getAdmissionPageData } from "@/lib/strapi";

export const instant = false;

export const metadata: Metadata = {
  title: "Admission | Kids' Foundation",
  description:
    "Admission information, enquiry, procedures and fee structure for Kids' Foundation, Imphal — Pre-Nursery to Class XII.",
};

export default async function AdmissionPage() {
  const strapiData = await getAdmissionPageData();

  const banner = {
    title: strapiData?.bannerTitle || "Admission",
    breadcrumb: strapiData?.breadcrumb || ["Home", "Admission"],
    image: strapiData?.bannerImage || undefined,
  };

  const enquiry = strapiData?.enquiry;
  const procedures = strapiData?.procedures;
  const feeStructure = strapiData?.feeStructure;

  return (
    <div className="relative flex-1 flex flex-col bg-white overflow-x-hidden selection:bg-[#F47C61] selection:text-white">
      <main className="flex-1 flex flex-col">
        <PageBanner
          title={banner.title}
          breadcrumb={banner.breadcrumb}
          image={banner.image}
        />

        {/* Enquiry & Procedures - equal height cards */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
              {/* Admission Enquiry */}
              {enquiry && (
                <div className="bg-[#F8FAFC] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-9 border border-slate-100 flex flex-col justify-between shadow-xs">
                  <div>
                    {enquiry.label && (
                      <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal">
                        {enquiry.label}
                      </span>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#17345F] mb-4 tracking-tight leading-[1.25]">
                      {enquiry.heading || "Admission Enquiry"}
                    </h2>
                    <div className="w-12 h-1 bg-[#D97706] rounded-full mb-6" />
                    {enquiry.description && (
                      <p className="text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85] mb-6">
                        {enquiry.description}
                      </p>
                    )}

                    <div className="space-y-3 mb-8">
                      {enquiry.email && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <span className="text-sm font-bold text-[#17345F] shrink-0 sm:w-32">
                            Email:
                          </span>
                          <a
                            href={`mailto:${enquiry.email}`}
                            className="text-sm text-[#F47C61] hover:text-[#E0684E] font-medium transition-colors break-all"
                          >
                            {enquiry.email}
                          </a>
                        </div>
                      )}
                      {enquiry.phone && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <span className="text-sm font-bold text-[#17345F] shrink-0 sm:w-32">
                            Contact number:
                          </span>
                          <span className="text-sm text-[#475569]">
                            {enquiry.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {enquiry.downloadHref && enquiry.downloadHref !== "#" && (
                    <div className="pt-2">
                      <a
                        href={enquiry.downloadHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#F47C61] hover:bg-[#E0684E] text-white text-sm font-semibold px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200 active:scale-98"
                      >
                        <Download className="w-4 h-4" />
                        {enquiry.downloadLabel || "Download Admission Form"}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Admission Procedures */}
              {procedures && (
                <div className="bg-[#F8FAFC] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-9 border border-slate-100 flex flex-col justify-between shadow-xs">
                  <div>
                    {procedures.label && (
                      <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal">
                        {procedures.label}
                      </span>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#17345F] mb-4 tracking-tight leading-[1.25]">
                      {procedures.heading || "Admission Procedures"}
                    </h2>
                    <div className="w-12 h-1 bg-[#D97706] rounded-full mb-6" />

                    <div className="space-y-6">
                      {procedures.registrationTitle && (
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-[#17345F] mb-2 leading-snug">
                            {procedures.registrationTitle}
                          </h3>
                          {procedures.registrationDescription && (
                            <p className="text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85]">
                              {procedures.registrationDescription}
                            </p>
                          )}
                        </div>
                      )}

                      {procedures.testsTitle && (
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-[#17345F] mb-2 leading-snug">
                            {procedures.testsTitle}
                          </h3>
                          {procedures.testsDescription && (
                            <p className="text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85]">
                              {procedures.testsDescription}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Fee Structure */}
        {feeStructure && feeStructure.tables && feeStructure.tables.length > 0 && (
          <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF7F2]">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
              <div className="text-center mb-10 sm:mb-12">
                {feeStructure.label && (
                  <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal">
                    {feeStructure.label}
                  </span>
                )}
                <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#17345F] leading-[1.25] tracking-tight">
                  {feeStructure.heading || "Admission Fee Structure"}
                </h2>
              </div>

              <div className="max-w-4xl mx-auto space-y-10">
                {feeStructure.tables.map((table, tIdx) => (
                  <div
                    key={table.id || tIdx}
                    className="shadow-xs rounded-2xl overflow-hidden border border-slate-200"
                  >
                    <div
                      className={`${
                        table.headerBg ||
                        (tIdx === 0 ? "bg-[#D97706]" : "bg-[#17345F]")
                      } px-6 py-4`}
                    >
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-wide uppercase">
                        {table.title}
                      </h3>
                    </div>
                    <div className="bg-white">
                      {table.rows.map((row, i) => (
                        <div
                          key={row.id || i}
                          className={`flex items-center justify-between px-6 py-4 sm:py-5 ${
                            i < table.rows.length - 1
                              ? "border-b border-slate-100"
                              : ""
                          }`}
                        >
                          <div>
                            <p className="text-sm sm:text-base font-semibold text-[#17345F]">
                              {row.level}
                            </p>
                            {row.description && (
                              <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
                                {row.description}
                              </p>
                            )}
                          </div>
                          <span className="text-sm sm:text-base font-bold text-[#17345F] shrink-0 ml-6">
                            {row.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
