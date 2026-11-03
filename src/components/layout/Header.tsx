"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, ChevronDown, ArrowRight } from "lucide-react";
import { IMAGES } from "@/data/images";
import { cn } from "@/lib/utils";
import { searchSite } from "@/data/searchData";
import { HeaderData, GlobalSettingData } from "@/types/strapi";
import { getStrapiMediaUrl } from "@/lib/strapi";

interface HeaderProps {
  headerData?: HeaderData | null;
  globalData?: GlobalSettingData | null;
}

export function Header({ headerData, globalData }: HeaderProps = {}) {
  const logo = headerData?.logo || globalData?.logo;
  const logoSrc = logo ? getStrapiMediaUrl(logo) : IMAGES.logo;
  const schoolName = headerData?.schoolName || globalData?.schoolName || "KIDS' FOUNDATION";
  const locationText = headerData?.location || globalData?.location || "IMPHAL, MANIPUR";
  const topNoticeText = headerData?.topNoticeText || globalData?.topNoticeText;
  const topNoticeLink = headerData?.topNoticeLink || globalData?.topNoticeLink;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [newsDropdownOpen, setNewsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
    setNewsDropdownOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const allStrapiLinks = React.useMemo(() => {
    return [
      ...(headerData?.navigation || []),
      ...(headerData?.moreLinks || []),
      ...(headerData?.actionButtons || []),
    ];
  }, [headerData]);

  const normalizeHref = (href?: string) => {
    if (!href) return "";
    return href.toLowerCase().trim().replace(/\/+$/, "").replace(/\s+/g, "-");
  };

  const getLabel = (href: string, fallback: string) => {
    const targetNorm = normalizeHref(href);
    const match = allStrapiLinks.find((l) => {
      const norm = normalizeHref(l.href);
      if (targetNorm === "/about") {
        return norm === "/about" || norm === "/about-us" || l.label?.toLowerCase().trim() === "about";
      }
      return norm === targetNorm;
    });
    return match?.label || fallback;
  };

  const standardHrefs = React.useMemo(() => new Set([
    "",
    "/",
    "/about",
    "/about-us",
    "/learning",
    "/campus",
    "/about/sports-and-arts",
    "/gallery",
    "/admission",
    "/events",
    "/news",
    "/news/publications",
    "/clubs-and-activities",
    "/clubs",
    "/contact",
  ]), []);

  const extraNavLinks = React.useMemo(() => {
    return (headerData?.navigation || []).filter((item) => {
      const norm = normalizeHref(item.href);
      if (norm === "/about" || norm === "/about-us" || item.label?.toLowerCase().trim() === "about") {
        return false;
      }
      return !standardHrefs.has(norm);
    });
  }, [headerData, standardHrefs]);

  const aboutLinks = [
    { label: getLabel("/about", "About Us"), href: "/about" },
    { label: getLabel("/learning", "Learning"), href: "/learning" },
    { label: getLabel("/campus", "Campus"), href: "/campus" },
    { label: getLabel("/about/sports-and-arts", "Sports & Arts"), href: "/about/sports-and-arts" },
  ];

  const isAboutActive = aboutLinks.some(
    (link) => pathname === link.href || (link.href !== "/about" && pathname.startsWith(link.href))
  );

  const liveResults = React.useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];
    return searchSite(searchQuery).slice(0, 4);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-[#17345F]/95 backdrop-blur-md shadow-lg border-b border-white/10"
          : "bg-transparent"
      )}
    >
      {/* Optional Top Announcement Banner from Strapi Header */}
      {topNoticeText && (
        <div className="w-full bg-[#112442]/95 border-b border-white/10 text-[11px] sm:text-xs py-1.5 px-4 text-center text-[#FBBF24] font-medium backdrop-blur-md">
          {topNoticeLink ? (
            <Link href={topNoticeLink} className="hover:underline inline-flex items-center gap-1">
              <span>{topNoticeText}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          ) : (
            <span>{topNoticeText}</span>
          )}
        </div>
      )}

      <div
        className={cn(
          "w-full transition-all duration-300",
          isScrolled ? "py-2.5 sm:py-3" : "py-4 sm:py-5"
        )}
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            {/* Logo & School Name */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 lg:gap-4 group shrink-0">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-[72px] lg:h-[72px] shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={logoSrc}
                  alt={`${schoolName} Logo`}
                  fill
                  sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 72px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white font-bold tracking-[0.08em] sm:tracking-[0.12em] text-[13px] sm:text-[16px] lg:text-[17px] uppercase leading-none font-serif">
                  {schoolName}
                </span>
                <span className="text-[#FBBF24] tracking-[0.2em] sm:tracking-[0.26em] text-[9.5px] sm:text-[10.5px] lg:text-[11px] font-medium uppercase leading-tight mt-1">
                  {locationText}
                </span>
              </div>
            </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5">
            {/* Home */}
            <Link
              href="/"
              className={cn(
                "relative text-[13px] xl:text-[14px] font-medium transition-colors py-1 whitespace-nowrap",
                isActive("/") ? "text-white font-semibold" : "text-white/85 hover:text-white"
              )}
            >
              {getLabel("/", "Home")}
              {isActive("/") && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#FBBF24] rounded-full" />
              )}
            </Link>

            {/* About Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-1 text-[13px] xl:text-[14px] font-medium transition-colors py-1 whitespace-nowrap",
                  isAboutActive ? "text-white font-semibold" : "text-white/85 hover:text-white"
                )}
              >
                {getLabel("/about", "About")}
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    aboutDropdownOpen && "rotate-180"
                  )}
                />
                {isAboutActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#FBBF24] rounded-full" />
                )}
              </button>

              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="bg-[#17345F]/98 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl py-2 px-1 min-w-[180px]">
                    {aboutLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "block px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors",
                          pathname === item.href
                            ? "bg-white/15 text-[#FBBF24] font-semibold"
                            : "text-white/90 hover:bg-white/10 hover:text-white"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Gallery */}
            <Link
              href="/gallery"
              className={cn(
                "relative text-[13px] xl:text-[14px] font-medium transition-colors py-1 whitespace-nowrap",
                isActive("/gallery") ? "text-white font-semibold" : "text-white/85 hover:text-white"
              )}
            >
              {getLabel("/gallery", "Gallery")}
              {isActive("/gallery") && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#FBBF24] rounded-full" />
              )}
            </Link>

            {/* Admissions */}
            <Link
              href="/admission"
              className={cn(
                "relative text-[13px] xl:text-[14px] font-medium transition-colors py-1 whitespace-nowrap",
                isActive("/admission") ? "text-white font-semibold" : "text-white/85 hover:text-white"
              )}
            >
              {getLabel("/admission", "Admissions")}
              {isActive("/admission") && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#FBBF24] rounded-full" />
              )}
            </Link>

            {/* News & Events Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setNewsDropdownOpen(true)}
              onMouseLeave={() => setNewsDropdownOpen(false)}
            >
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-1 text-[13px] xl:text-[14px] font-medium transition-colors py-1 whitespace-nowrap",
                  "text-white/85 hover:text-white"
                )}
              >
                {getLabel("/news", "News & Events")}
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    newsDropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {newsDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="bg-[#17345F]/98 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl py-2 px-1 min-w-[180px]">
                    <Link
                      href="/events"
                      className="block px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors text-white/90 hover:bg-white/10 hover:text-white"
                    >
                      {getLabel("/events", "Events")}
                    </Link>
                    <Link
                      href="/news"
                      className="block px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors text-white/90 hover:bg-white/10 hover:text-white"
                    >
                      {getLabel("/news", "News & Updates")}
                    </Link>
                    <Link
                      href="/news/publications"
                      className="block px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors text-white/90 hover:bg-white/10 hover:text-white"
                    >
                      {getLabel("/news/publications", "Publications")}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Clubs & Activities */}
            <Link
              href="/clubs-and-activities"
              className={cn(
                "relative text-[13px] xl:text-[14px] font-medium transition-colors py-1 whitespace-nowrap",
                isActive("/clubs-and-activities") || isActive("/clubs")
                  ? "text-white font-semibold"
                  : "text-white/85 hover:text-white"
              )}
            >
              {getLabel("/clubs-and-activities", "Clubs & Activities")}
              {(isActive("/clubs-and-activities") || isActive("/clubs")) && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#FBBF24] rounded-full" />
              )}
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className={cn(
                "relative text-[13px] xl:text-[14px] font-medium transition-colors py-1 whitespace-nowrap",
                isActive("/contact") ? "text-white font-semibold" : "text-white/85 hover:text-white"
              )}
            >
              {getLabel("/contact", "Contact")}
              {isActive("/contact") && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#FBBF24] rounded-full" />
              )}
            </Link>

            {/* Any extra navigation items added in Strapi */}
            {extraNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-[13px] xl:text-[14px] font-medium transition-colors py-1 whitespace-nowrap",
                  isActive(item.href) ? "text-white font-semibold" : "text-white/85 hover:text-white"
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#FBBF24] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <div className="relative hidden md:flex items-center shrink-0">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
                placeholder="Search..."
                className="w-36 lg:w-44 focus:w-60 h-9 pl-3.5 pr-9 rounded-full bg-white/10 border border-white/25 text-white text-sm placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/70 focus:bg-white/15 transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/70 hover:text-[#FBBF24] transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Live Suggestions Dropdown */}
            {searchFocused && liveResults.length > 0 && (
              <div className="absolute top-full right-0 mt-2.5 w-80 bg-[#17345F]/98 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-2 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider px-3 py-1">
                  Quick Matches
                </div>
                <div className="space-y-1">
                  {liveResults.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => {
                        setSearchFocused(false);
                        setSearchQuery("");
                      }}
                      className="block px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white truncate mr-2">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[#FBBF24] bg-white/10 px-1.5 py-0.5 rounded-full shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/70 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
                <button
                  type="button"
                  onMouseDown={() => {
                    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchFocused(false);
                  }}
                  className="w-full mt-1 pt-2 border-t border-white/10 text-center text-xs text-[#FBBF24] hover:text-white font-medium flex items-center justify-center gap-1 py-1 cursor-pointer"
                >
                  <span>See all results for &ldquo;{searchQuery}&rdquo;</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/10 active:bg-white/20"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#17345F]/98 backdrop-blur-xl border-b border-white/10 px-5 sm:px-6 pt-4 pb-6 mt-2 sm:mt-3 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto overscroll-contain shadow-2xl">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full h-11 pl-4 pr-11 rounded-full bg-white/10 border border-white/25 text-white text-sm placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/60"
            />
            <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/70">
              <Search className="w-4.5 h-4.5" />
            </button>
          </form>

          <nav className="flex flex-col space-y-1">
            {[
              { label: getLabel("/", "Home"), href: "/" },
              { label: getLabel("/about", "About Us"), href: "/about" },
              { label: getLabel("/learning", "Learning"), href: "/learning" },
              { label: getLabel("/campus", "Campus"), href: "/campus" },
              { label: getLabel("/about/sports-and-arts", "Sports & Arts"), href: "/about/sports-and-arts" },
              { label: getLabel("/gallery", "Gallery"), href: "/gallery" },
              { label: getLabel("/admission", "Admissions"), href: "/admission" },
              { label: getLabel("/events", "Events"), href: "/events" },
              { label: getLabel("/news", "News & Updates"), href: "/news" },
              { label: getLabel("/news/publications", "Publications"), href: "/news/publications" },
              { label: getLabel("/clubs-and-activities", "Clubs & Activities"), href: "/clubs-and-activities" },
              { label: getLabel("/contact", "Contact"), href: "/contact" },
              ...extraNavLinks.map((item) => ({ label: item.label, href: item.href })),
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-base font-medium py-2.5 border-b border-white/5 flex items-center justify-between",
                  isActive(item.href)
                    ? "text-[#FBBF24] font-semibold"
                    : "text-white/90 hover:text-white"
                )}
              >
                <span>{item.label}</span>
                {isActive(item.href) && <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
