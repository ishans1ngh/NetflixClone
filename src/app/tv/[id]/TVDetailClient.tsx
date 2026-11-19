"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Plus, Check, Film, X, ChevronDown, Clock } from "lucide-react";
import { MediaItem, Season } from "@/types";
import { useWatchlist } from "@/context/WatchlistContext";
import { getBackdropUrl } from "@/lib/tmdb";

interface TVDetailClientProps {
  show: MediaItem;
  trailerKey?: string;
}

export default function TVDetailClient({ show, trailerKey }: TVDetailClientProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);

  const seasons: Season[] = show.seasons || [
    {
      id: 1,
      name: "Season 1",
      season_number: 1,
      overview: "Season 1 episodes",
      poster_path: null,
      episode_count: 10,
    },
  ];

  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(
    seasons[0]?.season_number || 1
  );

  const inList = isInWatchlist(show.id, "tv");
  const title = show.name || "TV Series";

  const currentSeason =
    seasons.find((s) => s.season_number === selectedSeasonNumber) || seasons[0];

  const handleWatchlistToggle = () => {
    if (inList) {
      removeFromWatchlist(show.id, "tv");
    } else {
      addToWatchlist({
        content_id: show.id,
        content_type: "tv",
        title,
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        vote_average: show.vote_average || 8.0,
        release_date: show.first_air_date,
      });
    }
  };

  return (
    <>
      {/* Top Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Link
          href={`/watch?id=${show.id}&type=tv`}
          className="flex items-center space-x-3 bg-white hover:bg-zinc-200 text-black px-8 py-4 rounded-sm font-semibold text-base transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl btn-press"
        >
          <Play className="w-5 h-5 fill-black" />
          <span>Play Season 1</span>
        </Link>

        {trailerKey && (
          <button
            onClick={() => setTrailerModalOpen(true)}
            className="flex items-center space-x-3 bg-zinc-900/60 hover:bg-zinc-800/80 text-white backdrop-blur-md px-8 py-4 rounded-sm font-medium text-base border border-zinc-800/50 transition-all duration-300 hover:scale-105 btn-press"
          >
            <Film className="w-5 h-5 text-zinc-400" />
            <span>Trailer</span>
          </button>
        )}

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

      {/* Season Selector & Episode Listings */}
      <div className="mt-12 pt-12 border-t border-zinc-900/50 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Episodes</h3>

          {/* Season Dropdown */}
          <div className="relative">
            <select
              value={selectedSeasonNumber}
              onChange={(e) => setSelectedSeasonNumber(parseInt(e.target.value, 10))}
              className="bg-zinc-900/50 border border-zinc-800/50 text-white text-sm font-medium rounded-sm px-4 py-2.5 pr-10 appearance-none focus:outline-none focus:border-zinc-700 cursor-pointer transition-colors"
            >
              {seasons.map((season) => (
                <option key={season.id} value={season.season_number}>
                  {season.name || `Season ${season.season_number}`}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Episode Items */}
        <div className="space-y-4">
          {currentSeason?.episodes && currentSeason.episodes.length > 0 ? (
            currentSeason.episodes.map((ep) => (
              <div
                key={ep.id}
                className="bg-zinc-900/30 hover:bg-zinc-900/50 border border-zinc-800/30 rounded-sm p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300"
              >
                <div className="flex items-start sm:items-center space-x-4">
                  <span className="text-lg font-semibold text-zinc-600 font-mono w-8 text-center flex-none">
                    {ep.episode_number}
                  </span>
                  <div className="w-32 sm:w-40 aspect-video rounded-sm overflow-hidden bg-zinc-800 flex-none relative">
                    <img
                      src={getBackdropUrl(ep.still_path || show.backdrop_path, "w780")}
                      alt={ep.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-[#E50914] transition-colors">
                      {ep.name}
                    </h4>
                    <p className="text-xs text-zinc-500 line-clamp-2 max-w-xl mt-1">
                      {ep.overview || "Episode synopsis coming soon."}
                    </p>
                    {ep.runtime && (
                      <span className="text-[11px] text-zinc-600 mt-2 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {ep.runtime} min
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/watch?id=${show.id}&type=tv&season=${ep.season_number}&episode=${ep.episode_number}`}
                  className="w-full sm:w-auto text-center px-5 py-2.5 bg-zinc-900/50 hover:bg-[#E50914] text-white text-xs font-semibold rounded-sm transition-all duration-300 btn-press"
                >
                  Play
                </Link>
              </div>
            ))
          ) : (
            // Default sample episodes
            Array.from({ length: Math.min(8, currentSeason?.episode_count || 6) }).map((_, i) => (
              <div
                key={i}
                className="bg-zinc-900/30 hover:bg-zinc-900/50 border border-zinc-800/30 rounded-sm p-4 sm:p-5 flex items-center justify-between gap-4 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-base font-semibold text-zinc-600 font-mono w-8 text-center">
                    {i + 1}
                  </span>
                  <div className="w-32 sm:w-40 aspect-video rounded-sm overflow-hidden bg-zinc-800 flex-none relative">
                    <img
                      src={getBackdropUrl(show.backdrop_path, "w780")}
                      alt={`Episode ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Episode {i + 1}
                    </h4>
                    <p className="text-xs text-zinc-500 line-clamp-1 max-w-lg mt-0.5">
                      Stream episode {i + 1} of {title} in high definition.
                    </p>
                    <span className="text-[11px] text-zinc-600 mt-2 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      55 min
                    </span>
                  </div>
                </div>

                <Link
                  href={`/watch?id=${show.id}&type=tv&season=${selectedSeasonNumber}&episode=${i + 1}`}
                  className="px-5 py-2.5 bg-zinc-900/50 hover:bg-[#E50914] text-white text-xs font-semibold rounded-sm transition-all duration-300 btn-press flex-none"
                >
                  Play
                </Link>
              </div>
            ))
          )}
        </div>
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
