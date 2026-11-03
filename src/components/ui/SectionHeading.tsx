import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  heading: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  labelColor?: string;
  headingClassName?: string;
  descriptionClassName?: string;
}

export function SectionHeading({
  label,
  heading,
  description,
  align = "center",
  className,
  labelColor,
  headingClassName,
  descriptionClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center mx-auto max-w-3xl" : "text-left",
        className
      )}
    >
      {label && (
        <span
          className={cn(
            "text-xs sm:text-[13px] font-semibold tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal",
            labelColor ? labelColor : "text-[#D97706]"
          )}
        >
          {label}
        </span>
      )}
      <h2
        className={cn(
          "text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#17345F] leading-[1.22] tracking-tight",
          headingClassName
        )}
      >
        {heading}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-3 sm:mt-4 text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85] max-w-2xl",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
