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

const DEFAULT_CATEGORIES = [
  "All",
  "STEM & Innovation",
  "Arts & Culture",
  "Sports & Wellness",
  "Literary & Debate",
  "Social & Eco",
];

interface ClubsClientProps {
  bannerTitle?: string;
  breadcrumb?: string[];
  bannerImage?: string;
  overviewHeading?: string;
  overviewDescription?: string;
  categories?: string[];
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
        <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#17345F]/90 backdrop-blur-md text-white shadow-sm">
            {club.category}
          </span>
        </div>

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
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
            {club.description}
          </p>

          {/* Mentor & Schedule Info Strip */}
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
  overviewHeading = "Beyond the Textbook: Cultivating Curiosity, Leadership & Passion",
  overviewDescription = "At Kids' Foundation School, learning extends far beyond academic syllabi. Our vibrant clubs and student societies provide every learner the space to discover hidden talents, collaborate with peers across grades, compete in state and national arenas, and build lifelong self-confidence.",
  categories = DEFAULT_CATEGORIES,
  clubs,
}: ClubsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredClubs = useMemo(() => {
    if (selectedCategory === "All") return clubs;
    return clubs.filter((club) => club.category === selectedCategory);
  }, [clubs, selectedCategory]);

  return (
    <div className="relative flex-1 flex flex-col bg-slate-50 font-sans">
      <main className="flex-1 flex flex-col">
        {/* Page Banner */}
        <PageBanner
          title={bannerTitle}
          breadcrumb={breadcrumb}
          image={bannerImage || undefined}
        />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px] py-10 sm:py-16 space-y-12">
          {/* Philosophy / Overview Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="max-w-3xl space-y-4 relative z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#17345F] tracking-tight leading-tight">
                {overviewHeading}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {overviewDescription}
              </p>
            </div>
          </div>

          {/* Category Filter Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-[#17345F] text-white shadow-md shadow-[#17345F]/20"
                      : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results count indicator */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1">
              <span>
                Showing <strong>{filteredClubs.length}</strong> active club
                {filteredClubs.length === 1 ? "" : "s"}
                {selectedCategory !== "All" && ` in "${selectedCategory}"`}
              </span>
            </div>
          </div>

          {/* Clubs Grid */}
          {filteredClubs.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-800">No Clubs Found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                No clubs found in this category.
              </p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#17345F] text-white text-sm font-semibold hover:bg-[#122847] transition-all"
              >
                View All Clubs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredClubs.map((club) => (
                <ClubCard
                  key={club.id}
                  club={club}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
