"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bookmark, Film, Tv, Trash2, Play } from "lucide-react";
import { useWatchlist } from "@/context/WatchlistContext";
import { getImageUrl } from "@/lib/tmdb";
import { MediaType } from "@/types";

export default function MyListPage() {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");

  const filteredItems = watchlist.filter((item) => {
    if (filter === "all") return true;
    return item.content_type === filter;
  });

  return (
    <div className="pt-28 sm:pt-32 pb-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12 min-h-[75vh]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-zinc-900/50">
        <div>
          <div className="flex items-center space-x-2 text-[#E50914] mb-2">
            <Bookmark className="w-5 h-5 fill-current" />
            <span className="text-xs font-semibold uppercase tracking-widest">My List</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Your Watchlist
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            Movies and TV shows you've saved to watch later.
          </p>
        </div>

        {/* Filter Tabs */}
        {watchlist.length > 0 && (
          <div className="flex items-center space-x-1 bg-zinc-900/30 border border-zinc-800/40 rounded-sm p-1 text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-sm transition-all duration-300 ${
                filter === "all" ? "bg-zinc-800 text-white font-semibold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              All ({watchlist.length})
            </button>
            <button
              onClick={() => setFilter("movie")}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-sm transition-all duration-300 ${
                filter === "movie" ? "bg-zinc-800 text-white font-semibold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Movies</span>
            </button>
            <button
              onClick={() => setFilter("tv")}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-sm transition-all duration-300 ${
                filter === "tv" ? "bg-zinc-800 text-white font-semibold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>TV</span>
            </button>
          </div>
        )}
      </div>

      {/* Watchlist Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => {
            const detailsHref = item.content_type === "movie" ? `/movie/${item.content_id}` : `/tv/${item.content_id}`;
            const watchHref = `/watch?id=${item.content_id}&type=${item.content_type}`;
            const posterUrl = getImageUrl(item.poster_path || item.backdrop_path, "w500");

            return (
              <div
                key={`${item.content_id}-${item.content_type}`}
                className="relative group rounded-sm overflow-hidden bg-zinc-900/30 border border-zinc-800/40 hover:border-zinc-700/60 transition-all duration-300 flex flex-col hover-lift"
              >
                <div
                  onClick={() => window.location.href = detailsHref}
                  className="relative aspect-[2/3] w-full overflow-hidden cursor-pointer"
                >
                  <img
                    src={posterUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg shadow-[#E50914]/30 transition-transform group-hover:scale-110">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/50 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-zinc-500 mt-1">
                      <span className="uppercase text-[10px] font-medium text-zinc-600">
                        {item.content_type}
                      </span>
                      {item.vote_average > 0 && (
                        <span className="text-amber-400">★ {item.vote_average.toFixed(1)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-800/40">
                    <button
                      onClick={() => window.location.href = watchHref}
                      className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center space-x-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play</span>
                    </button>

                    <button
                      onClick={() => removeFromWatchlist(item.content_id, item.content_type as MediaType)}
                      className="text-zinc-600 hover:text-red-400 transition-colors p-1 hover:scale-110 transition-transform"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-24 px-4 max-w-md mx-auto space-y-6 bg-zinc-900/30 rounded-sm border border-zinc-900/50">
          <div className="w-16 h-16 rounded-full bg-zinc-900/50 flex items-center justify-center mx-auto text-zinc-600">
            <Bookmark className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-semibold text-white">Your list is empty</h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Browse movies and TV shows and add them to your watchlist.
          </p>
          <div className="flex items-center justify-center space-x-4 pt-2">
            <Link
              href="/movies"
              className="bg-[#E50914] hover:bg-[#f40612] text-white text-xs font-medium px-6 py-3 rounded-sm transition-colors shadow-lg shadow-[#E50914]/20 btn-press"
            >
              Browse Movies
            </Link>
            <Link
              href="/tv-shows"
              className="bg-zinc-900/50 hover:bg-zinc-900/80 text-white text-xs font-medium px-6 py-3 rounded-sm border border-zinc-800/50 transition-colors btn-press"
            >
              Browse TV
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
