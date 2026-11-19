"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaItem, MediaType } from "@/types";
import MovieCard from "./MovieCard";

interface ContentRowProps {
  title: string;
  items: MediaItem[];
  mediaType?: MediaType;
  exploreHref?: string;
  loading?: boolean;
}

export default function ContentRow({
  title,
  items,
  mediaType,
  exploreHref,
  loading = false,
}: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.8;
      const targetScroll =
        direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;

      rowRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const updateArrows = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  if (!loading && (!items || items.length === 0)) {
    return null;
  }

  return (
    <div className="relative my-10 sm:my-14 px-6 sm:px-8 lg:px-12 space-y-5">
      {/* Row Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white tracking-tight">
          {title}
        </h2>

        {exploreHref && (
          <Link
            href={exploreHref}
            className="text-xs sm:text-sm text-zinc-500 hover:text-white font-medium transition-all duration-300 flex items-center space-x-1 group/link"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {/* Row Carousel */}
      <div className="relative group/row">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
            className="absolute -left-4 top-0 bottom-0 z-30 w-12 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-transparent hover:via-[#080808]/95 text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover/row:opacity-100 hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={rowRef}
          onScroll={updateArrows}
          className="flex space-x-3 sm:space-x-4 overflow-x-auto no-scrollbar scroll-smooth py-3"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-none w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] aspect-[2/3] rounded-sm bg-zinc-900/50 animate-shimmer"
                />
              ))
            : items.map((item) => (
                <MovieCard
                  key={`${item.id}-${item.media_type || mediaType || "item"}`}
                  item={item}
                  mediaType={mediaType}
                />
              ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
            className="absolute -right-4 top-0 bottom-0 z-30 w-12 bg-gradient-to-l from-[#080808] via-[#080808]/90 to-transparent hover:via-[#080808]/95 text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover/row:opacity-100 hover:scale-105"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
