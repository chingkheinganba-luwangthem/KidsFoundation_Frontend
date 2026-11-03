import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/data/siteConfig";
import { IMAGES } from "@/data/images";
import { AdmissionsSection } from "@/components/home/AdmissionsSection";
import { FooterData, GlobalSettingData, AdmissionsCtaData } from "@/types/strapi";
import { getStrapiMediaUrl } from "@/lib/strapi";

interface FooterProps {
  footerData?: FooterData | null;
  globalData?: GlobalSettingData | null;
  admissionsData?: AdmissionsCtaData | null;
  showAdmissions?: boolean;
  /**
   * Adjust vertical alignment of grass-hill background image:
   * e.g. "center 65%", "center 70%", "center 72%"
   * Higher % = image moves UP (more grass shows)
   * Lower % = image moves DOWN (more sky shows)
   */
  bgPosition?: string;
}

export function Footer({
  footerData,
  globalData,
  admissionsData,
  showAdmissions = true,
  bgPosition = "center 72%",
}: FooterProps) {
  const { footer, contact } = SITE_CONFIG;

  const footerBg =
    getStrapiMediaUrl(footerData?.footerBg || globalData?.footerBg) || IMAGES.footerBg;
  const logoSrc =
    getStrapiMediaUrl(footerData?.logo || globalData?.logo) || IMAGES.logo;
  const schoolName = globalData?.schoolName || "KIDS' FOUNDATION";
  const location = globalData?.location || "IMPHAL, MANIPUR";
  const tagline = footerData?.tagline || globalData?.tagline || footer.tagline;
  const cbseAffiliationNo =
    footerData?.cbseAffiliationNo || globalData?.cbseAffiliationNo || contact.cbseAffiliationNo;
  const address =
    footerData?.address || globalData?.address || "Airport Road, Ghari, Imphal-West,\nManipur - 795001, India";

  const phonesList =
    footerData?.phones && footerData.phones.length > 0
      ? footerData.phones
      : globalData?.phones && globalData.phones.length > 0
      ? globalData.phones
      : [];
  const mobile =
    phonesList.length > 0
      ? phonesList.map((p) => p.number).join(" / ")
      : contact.mobile.join(" / ");

  const landline = footerData?.landline || globalData?.landline || contact.phone;
  const email = footerData?.email || globalData?.email || contact.email;
  const copyright = footerData?.copyright || globalData?.copyright || footer.copyright;

  const quickLinks =
    footerData?.quickLinks && footerData.quickLinks.length > 0
      ? footerData.quickLinks
      : footer.navigationLinks;

  const importantLinks =
    footerData?.importantLinks && footerData.importantLinks.length > 0
      ? footerData.importantLinks
      : footer.disclosureLinks;

  return (
    <footer className="relative w-full overflow-hidden">
      {/* ── 1. Shared Grass-Hill Background (sky behind Admissions, grass behind Footer) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={footerBg}
          alt=""
          fill
          sizes="100vw"
          style={{ objectPosition: bgPosition }}
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="relative z-10 flex flex-col">
        {/* ── 2. Top Section: Admissions CTA (shares the same sky background) ── */}
        {showAdmissions && <AdmissionsSection data={admissionsData} />}

        {/* ── 3. Bottom Section: White Footer Card (sits on the grass hill) ── */}
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px] pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 lg:pb-20">
          {/* White Card with generous spacing, soft blur, and subtle shadow */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(23,52,95,0.12)] p-5 sm:p-8 md:p-10 lg:p-14 xl:p-16 border border-white/60">
            {/* 4 Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12">
              {/* Column 1: School Identity (Logo, Tagline, CBSE, Socials) */}
              <div className="lg:col-span-4 flex flex-col space-y-4">
                {/* Logo & Brand Name */}
                <Link href="/" className="flex items-center gap-3.5 sm:gap-4 group">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-[84px] lg:h-[84px] shrink-0 transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={logoSrc}
                      alt="Kids' Foundation Logo"
                      fill
                      sizes="90px"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[#17345F] font-bold tracking-[0.12em] text-base sm:text-lg lg:text-[21px] font-serif uppercase leading-tight">
                      {schoolName}
                    </span>
                    <span className="text-[#17345F] tracking-[0.24em] text-[11px] sm:text-[12px] font-semibold uppercase leading-tight mt-1.5">
                      {location}
                    </span>
                  </div>
                </Link>

                {/* Tagline */}
                <p className="text-sm sm:text-[14.5px] text-[#475569] italic leading-relaxed pt-1 max-w-sm">
                  {tagline}
                </p>

                {/* CBSE Badge */}
                <div className="inline-flex items-center self-start bg-[#E8EFF8] text-[#17345F] text-xs sm:text-[12.5px] font-semibold px-4 py-2 rounded-full border border-[#D5E2F3]">
                  CBSE Affiliation No:{" "}
                  <strong className="font-bold ml-1 text-[#17345F]">
                    {cbseAffiliationNo}
                  </strong>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-3 pt-2">
                  {(footerData?.socialLinks && footerData.socialLinks.length > 0
                    ? footerData.socialLinks
                    : [
                        { platform: "facebook", url: "https://facebook.com", ariaLabel: "Facebook" },
                        { platform: "instagram", url: "https://instagram.com", ariaLabel: "Instagram" },
                        { platform: "youtube", url: "https://youtube.com", ariaLabel: "YouTube" },
                      ]
                  ).map((s) => {
                    const p = (s.platform || "").toLowerCase();
                    return (
                      <a
                        key={s.url + s.platform}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={("ariaLabel" in s ? (s as { ariaLabel?: string }).ariaLabel : undefined) || s.platform}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E8EFF8] hover:bg-[#D5E2F3] text-[#17345F] flex items-center justify-center transition-colors"
                      >
                        {p.includes("facebook") ? (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        ) : p.includes("instagram") ? (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        ) : p.includes("youtube") ? (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.196 1.006.128.832.936z" />
                          </svg>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div className="lg:col-span-2 xl:col-span-2 flex flex-col">
                <h4 className="text-base sm:text-lg font-bold text-[#17345F] mb-4 sm:mb-6">
                  Quick Links
                </h4>
                <ul className="space-y-3 sm:space-y-4 text-sm sm:text-[14.5px] text-[#475569]">
                  {quickLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="hover:text-[#F47C61] transition-colors font-medium block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Important Links */}
              <div className="lg:col-span-3 xl:col-span-3 flex flex-col">
                <h4 className="text-base sm:text-lg font-bold text-[#17345F] mb-4 sm:mb-6">
                  Important Links
                </h4>
                <ul className="space-y-3 sm:space-y-4 text-sm sm:text-[14.5px] text-[#475569]">
                  {importantLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="hover:text-[#F47C61] transition-colors font-normal block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Contact Us */}
              <div className="lg:col-span-3 xl:col-span-3 flex flex-col">
                <h4 className="text-base sm:text-lg font-bold text-[#17345F] mb-4 sm:mb-6">
                  Contact Us
                </h4>
                <div className="space-y-3.5 sm:space-y-4 text-sm sm:text-[14.5px] text-[#475569] leading-relaxed">
                  <div>
                    <span className="text-xs sm:text-[12.5px] text-slate-500 font-medium block mb-0.5">
                      Address:
                    </span>
                    <span className="text-[#475569] font-medium block whitespace-pre-line">
                      {address}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs sm:text-[12.5px] text-slate-500 font-medium block mb-0.5">
                      Mobile:
                    </span>
                    <span className="text-[#475569] font-medium block">
                      {mobile}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs sm:text-[12.5px] text-slate-500 font-medium block mb-0.5">
                      Phone:
                    </span>
                    <span className="text-[#475569] font-medium block">
                      {landline}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs sm:text-[12.5px] text-slate-500 font-medium block mb-0.5">
                      Email:
                    </span>
                    <a
                      href={`mailto:${email}`}
                      className="hover:text-[#F47C61] transition-colors font-medium block break-all"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Subtle Divider and Copyright */}
            <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <p className="text-xs sm:text-[12.5px] text-[#64748B] font-normal">
                {copyright}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
