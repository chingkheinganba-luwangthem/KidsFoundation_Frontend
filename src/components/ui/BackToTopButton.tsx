"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed bottom-6 right-6 z-40 group flex items-center justify-center w-12 h-12 rounded-full bg-[#17345F] text-white shadow-xl shadow-[#17345F]/30 border-2 border-white/20 transition-all duration-300 hover:bg-[#F47C61] hover:shadow-2xl hover:shadow-[#F47C61]/40 hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:ring-offset-2 ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-4 scale-75 pointer-events-none"
      }`}
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5 stroke-[2.5]" />
      
      {/* Subtle outer pulse effect on hover */}
      <span className="absolute inset-0 rounded-full border border-white/40 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pointer-events-none" />
    </button>
  );
}
