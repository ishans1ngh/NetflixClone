"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Plus, Check, Film, X } from "lucide-react";
import { MediaItem } from "@/types";
import { useWatchlist } from "@/context/WatchlistContext";

interface MovieDetailActionsProps {
  movie: MediaItem;
  trailerKey?: string;
  isPlayable: boolean;
}

export default function MovieDetailActions({
  movie,
  trailerKey,
  isPlayable,
}: MovieDetailActionsProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);

  const inList = isInWatchlist(movie.id, "movie");
  const title = movie.title || "Movie";

  const handleWatchlistToggle = () => {
    if (inList) {
      removeFromWatchlist(movie.id, "movie");
    } else {
      addToWatchlist({
        content_id: movie.id,
        content_type: "movie",
        title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average || 8.0,
        release_date: movie.release_date,
      });
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 pt-2">
        {/* Play Button */}
        <Link
          href={`/watch?id=${movie.id}&type=movie`}
          className="flex items-center space-x-3 bg-white hover:bg-zinc-200 text-black px-8 py-4 rounded-sm font-semibold text-base transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl btn-press"
        >
          <Play className="w-5 h-5 fill-black" />
          <span>{isPlayable ? "Play" : "Play Preview"}</span>
        </Link>

        {/* Watch Trailer Modal Trigger */}
        {trailerKey && (
          <button
            onClick={() => setTrailerModalOpen(true)}
            className="flex items-center space-x-3 bg-zinc-900/60 hover:bg-zinc-800/80 text-white backdrop-blur-md px-8 py-4 rounded-sm font-medium text-base border border-zinc-800/50 transition-all duration-300 hover:scale-105 btn-press"
          >
            <Film className="w-5 h-5 text-zinc-400" />
            <span>Trailer</span>
          </button>
        )}

        {/* Add/Remove My List */}
        <button
          onClick={handleWatchlistToggle}
          className={`flex items-center space-x-3 px-8 py-4 rounded-sm font-medium text-base border transition-all duration-300 hover:scale-105 btn-press ${
            inList
              ? "bg-zinc-900/60 border-zinc-700 text-zinc-300 hover:border-zinc-600"
              : "bg-black/50 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
          }`}
        >
          {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <span>{inList ? "In List" : "My List"}</span>
        </button>
      </div>

      {/* Trailer Modal */}
      {trailerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-sm overflow-hidden shadow-2xl border border-zinc-900">
            <button
              onClick={() => setTrailerModalOpen(false)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-[#E50914] text-white flex items-center justify-center transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&controls=1`}
              title={`${title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </>
  );
}
