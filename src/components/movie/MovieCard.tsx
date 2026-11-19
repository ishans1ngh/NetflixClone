"use client";

import React, { useState } from "react";
import { Play, Plus, Check, Info, Star } from "lucide-react";
import { MediaItem, MediaType } from "@/types";
import { getImageUrl } from "@/lib/tmdb";
import { useWatchlist } from "@/context/WatchlistContext";

interface MovieCardProps {
  item: MediaItem;
  mediaType?: MediaType;
  progressPercent?: number;
  progressSeconds?: number;
}

export default function MovieCard({
  item,
  mediaType,
  progressPercent,
  progressSeconds,
}: MovieCardProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [isHovered, setIsHovered] = useState(false);

  const title = item.title || item.name || "Untitled";
  const type: MediaType = mediaType || item.media_type || (item.first_air_date ? "tv" : "movie");
  const inList = isInWatchlist(item.id, type);
  const posterUrl = getImageUrl(item.poster_path || item.backdrop_path, "w500");
  const releaseYear = (item.release_date || item.first_air_date || "").substring(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inList) {
      removeFromWatchlist(item.id, type);
    } else {
      addToWatchlist({
        content_id: item.id,
        content_type: type,
        title,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        vote_average: item.vote_average || 7.5,
        release_date: item.release_date || item.first_air_date,
      });
    }
  };

  const detailsUrl = type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
  const watchUrl = `/watch?id=${item.id}&type=${type}${
    progressSeconds ? `&t=${progressSeconds}` : ""
  }`;

  return (
    <div
      className="relative flex-none w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <div
        onClick={() => window.location.href = detailsUrl}
        className="relative aspect-[2/3] w-full rounded-sm overflow-hidden bg-zinc-900 border border-zinc-800/40 hover:border-zinc-700/60 transition-all duration-500 hover-lift"
      >
        {/* Poster Image */}
        <img
          src={posterUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Continue watching progress bar */}
        {progressPercent !== undefined && progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-900/90 z-20">
            <div
              className="h-full bg-[#E50914] transition-all duration-500 shadow-lg shadow-[#E50914]/30"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        )}

        {/* Rating Badge */}
        {rating && (
          <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md text-amber-400 text-[10px] font-semibold px-2 py-1 rounded-sm flex items-center border border-zinc-700/50 shadow-lg">
            <Star className="w-3 h-3 fill-amber-400 mr-1" />
            {rating}
          </div>
        )}

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 via-black/20 to-transparent p-4 flex flex-col justify-end transition-all duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight mb-2">
            {title}
          </h3>

          <div className="flex items-center space-x-2 text-[10px] text-zinc-400 mb-3">
            {releaseYear && <span>{releaseYear}</span>}
            <span className="text-zinc-600">•</span>
            <span className="uppercase text-zinc-500">{type}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = watchUrl;
              }}
              className="flex-1 flex items-center justify-center space-x-1.5 bg-white hover:bg-zinc-100 text-black py-2 rounded-sm font-medium text-xs transition-all duration-300 hover:scale-105 btn-press"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Play</span>
            </button>

            <button
              type="button"
              onClick={handleWatchlistToggle}
              className={`w-8 h-8 rounded-sm border flex items-center justify-center transition-all duration-300 hover:scale-110 btn-press ${
                inList
                  ? "bg-[#E50914] border-[#E50914] text-white shadow-lg shadow-[#E50914]/30"
                  : "bg-black/70 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white hover:bg-black/80"
              }`}
              title={inList ? "Remove from List" : "Add to List"}
            >
              {inList ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = detailsUrl;
              }}
              className="w-8 h-8 rounded-sm bg-black/70 border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white hover:bg-black/80 flex items-center justify-center transition-all duration-300 hover:scale-110 btn-press"
              title="More Info"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
