"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Info, Plus, Check, Star, Volume2, VolumeX } from "lucide-react";
import { MediaItem } from "@/types";
import { getBackdropUrl } from "@/lib/tmdb";
import { useWatchlist } from "@/context/WatchlistContext";

interface HeroBannerProps {
  item: MediaItem;
}

export default function HeroBanner({ item }: HeroBannerProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [muted, setMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!item) return null;

  const title = item.title || item.name || "Featured Title";
  const releaseYear = (item.release_date || item.first_air_date || "").substring(0, 4) || "2024";
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "8.5";
  const isMovie = item.media_type === "movie" || !item.first_air_date;
  const contentType = isMovie ? "movie" : "tv";
  const inList = isInWatchlist(item.id, contentType);

  const handleWatchlistToggle = () => {
    if (inList) {
      removeFromWatchlist(item.id, contentType);
    } else {
      addToWatchlist({
        content_id: item.id,
        content_type: contentType,
        title,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        vote_average: item.vote_average || 8.0,
        release_date: item.release_date || item.first_air_date,
      });
    }
  };

  const backdropUrl = getBackdropUrl(item.backdrop_path);

  return (
    <div className="relative w-full h-[80vh] lg:h-[85vh] overflow-hidden select-none">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0">
        <img
          src={backdropUrl}
          alt={title}
          className={`w-full h-full object-cover object-center transition-all duration-1000 ease-out ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Loading skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-[#0a0a0a] animate-shimmer" />
        )}

        {/* Enhanced Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/20" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-full flex items-center">
        <div 
          className={`max-w-2xl pt-12 lg:pt-16 space-y-6 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Badge & Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
            <span className="flex items-center bg-[#E50914] text-white px-3 py-1.5 rounded-sm font-semibold tracking-widest uppercase text-[11px] shadow-lg shadow-[#E50914]/30">
              Featured
            </span>
            <span className="flex items-center text-amber-400 font-semibold bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded-sm border border-amber-400/20">
              <Star className="w-3.5 h-3.5 fill-amber-400 mr-1.5" />
              {rating}
            </span>
            <span className="text-zinc-300 font-light tracking-wide">{releaseYear}</span>
            {item.runtime && (
              <span className="text-zinc-400 font-light">
                {Math.floor(item.runtime / 60)}h {item.runtime % 60}m
              </span>
            )}
            {item.genres && item.genres.length > 0 && (
              <span className="text-zinc-400 font-light">
                {item.genres[0].name}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tight leading-[1.1] cinematic-text-shadow">
            {title}
          </h1>

          {/* Overview */}
          <p className="text-zinc-300 text-base sm:text-lg lg:text-xl leading-relaxed line-clamp-3 max-w-2xl cinematic-text-shadow font-light tracking-wide">
            {item.overview || "Stream this critically acclaimed cinematic presentation exclusively on CINEVERSE with full audio-visual fidelity."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {/* Play Button */}
            <Link
              href={`/watch?id=${item.id}&type=${contentType}`}
              className="group flex items-center space-x-3 bg-white hover:bg-zinc-100 text-black px-8 py-4 rounded-sm font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl btn-press"
            >
              <Play className="w-5 h-5 fill-black group-hover:scale-110 transition-transform" />
              <span>Play</span>
            </Link>

            {/* More Info */}
            <Link
              href={isMovie ? `/movie/${item.id}` : `/tv/${item.id}`}
              className="group flex items-center space-x-3 bg-zinc-900/60 hover:bg-zinc-800/80 text-white backdrop-blur-md px-8 py-4 rounded-sm font-medium text-base border border-zinc-700/50 transition-all duration-300 hover:scale-105 hover:border-zinc-600 btn-press"
            >
              <Info className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
              <span>More Info</span>
            </Link>

            {/* Add to Watchlist */}
            <button
              onClick={handleWatchlistToggle}
              className={`group flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-300 hover:scale-110 btn-press ${
                inList
                  ? "bg-[#E50914] border-[#E50914] text-white shadow-lg shadow-[#E50914]/40"
                  : "bg-black/50 border-zinc-700 text-zinc-400 hover:border-white hover:text-white"
              }`}
              title={inList ? "Remove from My List" : "Add to My List"}
            >
              {inList ? (
                <Check className="w-6 h-6 group-hover:scale-110 transition-transform" />
              ) : (
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute right-8 lg:right-12 bottom-12 lg:bottom-16 flex items-center space-x-4">
        <button
          onClick={() => setMuted(!muted)}
          className="group p-3 rounded-full border border-zinc-700/50 bg-black/40 backdrop-blur-sm text-zinc-400 hover:text-white hover:border-zinc-500 hover:bg-black/60 transition-all duration-300"
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? (
            <VolumeX className="w-5 h-5 group-hover:scale-110 transition-transform" />
          ) : (
            <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
        </button>
        <div className="h-8 w-px bg-zinc-700/50" />
        <span className="text-xs text-zinc-400 font-medium tracking-widest uppercase bg-black/40 backdrop-blur-sm px-3 py-2 rounded-sm border border-zinc-800/50">
          HD • 5.1
        </span>
      </div>

      {/* Slide Indicator */}
      <div className="absolute bottom-12 lg:bottom-16 left-6 sm:left-8 lg:left-12 flex items-center space-x-2">
        <div className="w-8 h-0.5 bg-[#E50914] rounded-full shadow-lg shadow-[#E50914]/50" />
        <div className="w-2 h-0.5 bg-zinc-700 rounded-full" />
        <div className="w-2 h-0.5 bg-zinc-700 rounded-full" />
        <div className="w-2 h-0.5 bg-zinc-700 rounded-full" />
      </div>
    </div>
  );
}
