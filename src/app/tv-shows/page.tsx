import React from "react";
import Link from "next/link";
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import { getTVByGenre, getTopRatedTV } from "@/lib/tmdb";
import { TV_GENRES } from "@/lib/mockData";

interface TVShowsPageProps {
  searchParams: Promise<{
    genre?: string;
    sort?: string;
    page?: string;
    category?: string;
  }>;
}

export default async function TVShowsPage({ searchParams }: TVShowsPageProps) {
  const params = await searchParams;
  const currentGenreId = params.genre ? parseInt(params.genre, 10) : undefined;
  const currentSort = params.sort || "popularity.desc";
  const currentPage = params.page ? parseInt(params.page, 10) : 1;
  const currentCategory = params.category || "all";

  let tvData;
  if (currentCategory === "top-rated") {
    tvData = await getTopRatedTV(currentPage);
  } else {
    tvData = await getTVByGenre(currentGenreId, currentPage, currentSort);
  }

  const { results: tvShows, total_pages } = tvData;
  const totalPages = Math.min(total_pages, 50);

  const sortOptions = [
    { label: "Popular", value: "popularity.desc" },
    { label: "Top Rated", value: "vote_average.desc" },
    { label: "Newest", value: "first_air_date.desc" },
  ];

  return (
    <div className="pt-28 sm:pt-32 pb-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-900/50">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            TV Shows
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            Browse our collection of series.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-2 text-xs font-medium overflow-x-auto no-scrollbar pb-1">
          <Link
            href="/tv-shows"
            className={`px-4 py-2 rounded-sm transition-colors flex-none ${
              !currentGenreId && currentCategory === "all"
                ? "bg-[#E50914] text-white font-medium"
                : "bg-zinc-900/30 text-zinc-400 hover:text-white border border-zinc-800/30"
            }`}
          >
            All
          </Link>
          <Link
            href="/tv-shows?category=top-rated"
            className={`px-4 py-2 rounded-sm transition-colors flex-none ${
              currentCategory === "top-rated"
                ? "bg-[#E50914] text-white font-medium"
                : "bg-zinc-900/30 text-zinc-400 hover:text-white border border-zinc-800/30"
            }`}
          >
            Top Rated
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Genre Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-zinc-500 uppercase flex items-center mr-1">
            <Filter className="w-3.5 h-3.5 mr-1" />
            Genres
          </span>
          {TV_GENRES.map((genre) => {
            const isSelected = currentGenreId === genre.id;
            return (
              <Link
                key={genre.id}
                href={`/tv-shows?genre=${genre.id}&sort=${currentSort}`}
                className={`text-xs px-3 py-1.5 rounded-sm transition-all ${
                  isSelected
                    ? "bg-[#E50914] text-white font-medium"
                    : "bg-zinc-900/30 border border-zinc-800/30 text-zinc-400 hover:text-white hover:border-zinc-700/50"
                }`}
              >
                {genre.name}
              </Link>
            );
          })}
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-2 text-xs flex-none self-end lg:self-center">
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-500">Sort:</span>
          <div className="flex items-center space-x-1 bg-zinc-900/30 border border-zinc-800/30 rounded-sm p-1">
            {sortOptions.map((opt) => (
              <Link
                key={opt.value}
                href={`/tv-shows?${currentGenreId ? `genre=${currentGenreId}&` : ""}${
                  currentCategory !== "all" ? `category=${currentCategory}&` : ""
                }sort=${opt.value}`}
                className={`px-3 py-1.5 rounded-sm text-xs transition-colors ${
                  currentSort === opt.value
                    ? "bg-zinc-800 text-white font-medium"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {tvShows.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tvShows.map((show) => (
            <div key={show.id} className="w-full flex justify-center">
              <MovieCard item={show} mediaType="tv" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900/30 rounded-sm border border-zinc-900/50">
          <p className="text-zinc-500 text-base">No TV shows found.</p>
          <Link
            href="/tv-shows"
            className="inline-block mt-4 bg-[#E50914] text-white text-xs font-medium px-4 py-2.5 rounded-sm"
          >
            Reset
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 pt-8 border-t border-zinc-900/50">
          <Link
            href={`/tv-shows?page=${Math.max(1, currentPage - 1)}${
              currentGenreId ? `&genre=${currentGenreId}` : ""
            }&sort=${currentSort}`}
            className={`flex items-center space-x-2 px-4 py-2 rounded-sm border border-zinc-800/30 bg-zinc-900/30 text-sm font-medium transition-colors ${
              currentPage <= 1
                ? "opacity-50 pointer-events-none text-zinc-600"
                : "text-zinc-400 hover:text-white hover:border-zinc-700/50"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Link>

          <span className="text-sm font-medium text-zinc-500">
            <span className="text-white">{currentPage}</span> / {totalPages}
          </span>

          <Link
            href={`/tv-shows?page=${Math.min(totalPages, currentPage + 1)}${
              currentGenreId ? `&genre=${currentGenreId}` : ""
            }&sort=${currentSort}`}
            className={`flex items-center space-x-2 px-4 py-2 rounded-sm border border-zinc-800/30 bg-zinc-900/30 text-sm font-medium transition-colors ${
              currentPage >= totalPages
                ? "opacity-50 pointer-events-none text-zinc-600"
                : "text-zinc-400 hover:text-white hover:border-zinc-700/50"
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
