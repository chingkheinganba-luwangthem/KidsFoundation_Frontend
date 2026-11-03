import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NewsItem } from "@/types";

interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  return (
    <article className="group bg-white rounded-2xl shadow-[0_4px_20px_rgba(23,52,95,0.05)] hover:shadow-[0_10px_30px_rgba(23,52,95,0.1)] overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      <Link href={item.linkHref} className="block overflow-hidden relative aspect-[16/10] min-h-[175px] w-full">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 360px"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="text-[11px] sm:text-xs font-semibold text-[#D97706] tracking-wide mb-1.5">
          {item.date}
        </div>
        <h3 className="text-sm sm:text-base font-bold text-[#17345F] leading-snug mb-2 group-hover:text-[#F47C61] transition-colors">
          <Link href={item.linkHref}>{item.title}</Link>
        </h3>
        <p className="text-xs sm:text-sm text-[#64748B] leading-[1.7] line-clamp-3 mt-auto">
          {item.description}
        </p>
      </div>
    </article>
  );
}
