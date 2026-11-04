"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { PageBanner } from "@/components/ui/PageBanner";
import { Club } from "@/types/strapi";
import {
  Users,
  MapPin,
  Clock,
  User,
  Award,
} from "lucide-react";

interface ClubsClientProps {
  bannerTitle?: string;
  breadcrumb?: string[];
  bannerImage?: string;
  description?: string;
  clubs: Club[];
}

function ClubCard({ club }: { club: Club }) {
  const [imgSrc, setImgSrc] = useState(club.image || "/images/banner_images/banner.jpg");

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col">
      {/* Club Card Image */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
        <Image
          src={imgSrc}
          alt={club.name}
          fill
          onError={() => setImgSrc("/images/banner_images/banner.jpg")}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Floating Top Category Badge */}
        {club.category && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#17345F]/90 backdrop-blur-md text-white shadow-sm">
              {club.category}
            </span>
          </div>
        )}

        {/* Floating Bottom Info (Members & Schedule) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 z-10 text-white text-[11px]">
          {club.membersCount ? (
            <span className="px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm flex items-center gap-1 font-medium">
              <Users className="w-3 h-3 text-[#FBBF24]" />
              {club.membersCount} Members
            </span>
          ) : <span />}

          {club.location && (
            <span className="px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm flex items-center gap-1 font-medium truncate max-w-[160px]">
              <MapPin className="w-3 h-3 text-[#F47C61] shrink-0" />
              <span className="truncate">{club.location}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Club Name */}
          <h3 className="text-lg font-bold text-[#17345F] leading-snug">
            {club.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {club.description}
          </p>

          {/* Mentor & Schedule Info Strip */}
          {(club.meetingSchedule || club.mentor) && (
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              {club.meetingSchedule && (
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{club.meetingSchedule}</span>
                </div>
              )}
              {club.mentor && (
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">
                    <strong className="text-slate-700">{club.mentor}</strong>
                    {club.mentorRole && ` · ${club.mentorRole}`}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Recent Highlight Badge */}
          {club.recentHighlight && (
            <div className="mt-2 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
              <Award className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span className="line-clamp-2 leading-tight">
                <strong>Highlight:</strong> {club.recentHighlight}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ClubsClient({
  bannerTitle = "Clubs & Activities",
  breadcrumb = ["Home", "Clubs & Activities"],
  bannerImage,
  description,
  clubs,
}: ClubsClientProps) {
  // Parse description and optional quote from Strapi
  const { paragraphs, quote } = useMemo(() => {
    if (!description) return { paragraphs: [], quote: "" };

    const quoteIdx = description.search(/["“]/);
    if (quoteIdx > -1) {
      const body = description.slice(0, quoteIdx).trim();
      const q = description.slice(quoteIdx).trim();
      const paras = body
        .split(/\n\s*\n/)
        .map((p) => p.replace(/\r?\n/g, " ").trim())
        .filter(Boolean);
      return {
        paragraphs: paras.length > 0 ? paras : [body.replace(/\r?\n/g, " ")],
        quote: q.replace(/\r?\n/g, " "),
      };
    }

    const paras = description
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\r?\n/g, " ").trim())
      .filter(Boolean);

    return {
      paragraphs: paras.length > 0 ? paras : [description.replace(/\r?\n/g, " ").trim()],
      quote: "",
    };
  }, [description]);

  return (
    <div className="relative flex-1 flex flex-col bg-slate-50 font-sans">
      <main className="flex-1 flex flex-col">
        {/* Page Banner */}
        <PageBanner
          title={bannerTitle}
          breadcrumb={breadcrumb}
          image={bannerImage || undefined}
        />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px] py-10 sm:py-16 space-y-10 sm:space-y-12">
          {/* Introductory Description Section from Strapi */}
          {description && (
            <div className="max-w-4xl space-y-4">
              {paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className="text-sm sm:text-base lg:text-[16.5px] text-[#475569] leading-[1.8] sm:leading-[1.85]"
                >
                  {p}
                </p>
              ))}

              {quote && (
                <p className="text-base sm:text-lg italic text-[#17345F] font-serif border-l-2 border-[#F47C61] pl-4 py-1 mt-4">
                  {quote}
                </p>
              )}
            </div>
          )}

          {/* Clubs Grid */}
          {clubs.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-800">No Clubs Found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                No active clubs found at this time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {clubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
