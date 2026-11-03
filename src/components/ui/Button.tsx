import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid-coral" | "outline-white" | "outline-navy" | "outline-light";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "solid-coral",
  size = "md",
  href,
  children,
  className,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-1.5 text-xs font-medium",
    md: "px-6 py-2.5 text-sm font-semibold",
    lg: "px-7 py-3 text-base font-semibold",
  };

  const variantClasses = {
    "solid-coral":
      "bg-[#F47C61] hover:bg-[#E0684E] text-white shadow-sm hover:shadow-md active:scale-98",
    "outline-white":
      "bg-white/10 hover:bg-white/20 text-white border border-white/40 backdrop-blur-xs active:scale-98",
    "outline-navy":
      "bg-transparent hover:bg-[#17345F]/5 text-[#17345F] border border-[#CBD5E1] active:scale-98",
    "outline-light":
      "bg-[#E7EEF8]/80 hover:bg-[#DCE6F5] text-[#17345F] border border-[#CAD9EE] active:scale-98",
  };

  const baseClasses =
    "inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer select-none";

  const combinedClasses = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
