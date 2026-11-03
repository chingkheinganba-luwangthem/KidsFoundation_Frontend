"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryItem } from "@/types";

/** Simple image shape for pages that don't use full GalleryItem */
interface SimpleLightboxImage {
  src: string;
  alt: string;
  title?: string;
  category?: string;
}

/* ─── Props for the standalone (self-managed) lightbox ─── */
interface StandaloneLightboxProps {
  images: SimpleLightboxImage[];
  initialIndex: number;
  onClose: () => void;
  /** Discriminator – omit these when using standalone mode */
  items?: never;
  currentIndex?: never;
  onSelectIndex?: never;
}

/* ─── Props for the controlled (parent-managed) lightbox ─── */
interface ControlledLightboxProps {
  items: GalleryItem[];
  currentIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
  /** Discriminator */
  images?: never;
  initialIndex?: never;
}

type ImageLightboxProps = StandaloneLightboxProps | ControlledLightboxProps;

export function ImageLightbox(props: ImageLightboxProps) {
  const isControlled = "items" in props && props.items !== undefined;

  /* Controlled mode values */
  const controlledItems = isControlled ? props.items : [];
  const controlledIndex = isControlled ? props.currentIndex : null;

  /* Standalone mode values */
  const standaloneImages = !isControlled ? props.images : [];
  const [standaloneIndex, setStandaloneIndex] = useState(
    !isControlled ? props.initialIndex : 0
  );

  /* Unified helpers */
  const totalLength = isControlled ? controlledItems.length : standaloneImages.length;
  const activeIndex = isControlled ? controlledIndex : standaloneIndex;
  const isOpen = activeIndex !== null && activeIndex >= 0 && activeIndex < totalLength;

  const getCurrentImage = (): SimpleLightboxImage | null => {
    if (!isOpen || activeIndex === null) return null;
    if (isControlled) {
      const item = controlledItems[activeIndex];
      return { src: item.image, alt: item.imageAlt, title: item.title, category: item.category };
    }
    return standaloneImages[activeIndex];
  };

  const currentImage = getCurrentImage();

  const handlePrev = useCallback(() => {
    if (activeIndex === null) return;
    const prev = (activeIndex - 1 + totalLength) % totalLength;
    if (isControlled) {
      props.onSelectIndex(prev);
    } else {
      setStandaloneIndex(prev);
    }
  }, [activeIndex, totalLength, isControlled, props]);

  const handleNext = useCallback(() => {
    if (activeIndex === null) return;
    const next = (activeIndex + 1) % totalLength;
    if (isControlled) {
      props.onSelectIndex(next);
    } else {
      setStandaloneIndex(next);
    }
  }, [activeIndex, totalLength, isControlled, props]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, props, handlePrev, handleNext]);

  if (!isOpen || !currentImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 transition-all duration-300"
      onClick={props.onClose}
    >
      {/* Top controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <span className="text-white/70 text-xs sm:text-sm font-medium mr-2">
          {(activeIndex ?? 0) + 1} / {totalLength}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            props.onClose();
          }}
          aria-label="Close modal"
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Prev button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        aria-label="Previous image"
        className="absolute left-3 sm:left-6 z-20 p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Next button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        aria-label="Next image"
        className="absolute right-3 sm:right-6 z-20 p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Main content modal */}
      <div
        className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[65vh] sm:h-[75vh] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>
        <div className="mt-4 text-center">
          {currentImage.title && (
            <p className="text-white text-base sm:text-lg font-semibold">
              {currentImage.title}
            </p>
          )}
          {currentImage.category && (
            <p className="text-white/60 text-xs sm:text-sm mt-1 uppercase tracking-wider">
              {currentImage.category}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
