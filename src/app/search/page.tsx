"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, Clock, Film, Tv, Sparkles, AlertCircle } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import { MediaItem, MediaType } from "@/types";
import { searchMulti } from "@/lib/tmdb";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "movie" | "tv">("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const suggestions = [
    "Tears of Steel",
    "Interstellar",
    "Inception",
    "The Dark Knight",
    "House of the Dragon",
    "Stranger Things",
    "Sci-Fi",
    "Action",
  ];

  useEffect(() => {
    const saved = localStorage.getItem("cineverse_search_history");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query.trim()) {
        router.replace(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, router]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    searchMulti(debouncedQuery.trim()).then((data) => {
      setResults(data.results || []);
      setLoading(false);

      if (debouncedQuery.trim().length > 1) {
        setRecentSearches((prev) => {
          const filtered = prev.filter((s) => s.toLowerCase() !== debouncedQuery.toLowerCase());
          const updated = [debouncedQuery.trim(), ...filtered].slice(0, 8);
          localStorage.setItem("cineverse_search_history", JSON.stringify(updated));
          return updated;
        });
      }
    });
  }, [debouncedQuery]);

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem("cineverse_search_history");
  };

  const filteredResults = results.filter((item) => {
    if (activeTab === "all") return true;
    return item.media_type === activeTab;
  });

  return (
    <div className="pt-28 sm:pt-32 pb-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
      {/* Search Input */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, TV shows, genres..."
            autoFocus
            className="w-full bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 focus:border-zinc-600 text-white text-lg sm:text-xl rounded-sm pl-12 pr-12 py-4 focus:outline-none focus:shadow-lg focus:shadow-black/30 transition-all duration-300"
          />
          <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                router.replace("/search");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Suggestions & Recent */}
        {!debouncedQuery && (
          <div className="space-y-8 pt-4">
            {recentSearches.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-500 uppercase tracking-widest">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Recent
                  </span>
                  <button
                    onClick={clearHistory}
                    className="hover:text-zinc-300 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="bg-zinc-900/30 hover:bg-zinc-900/50 text-zinc-400 hover:text-white text-sm px-4 py-2 rounded-sm border border-zinc-800/40 hover:border-zinc-700 transition-all duration-300"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <span className="flex items-center text-xs text-zinc-500 uppercase tracking-widest">
                <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                Popular
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => setQuery(sug)}
                    className="bg-zinc-900/30 border border-zinc-800/40 hover:border-zinc-700/50 text-zinc-400 hover:text-white text-sm px-4 py-2 rounded-sm transition-all duration-300"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {debouncedQuery && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900/50">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              Results for <span className="text-[#E50914]">"{debouncedQuery}"</span>
              {!loading && (
                <span className="text-sm text-zinc-500 font-normal ml-2">
                  ({filteredResults.length} titles)
                </span>
              )}
            </h2>

            <div className="flex items-center space-x-1 bg-zinc-900/30 border border-zinc-800/40 rounded-sm p-1 text-xs font-medium">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-sm transition-all duration-300 ${
                  activeTab === "all" ? "bg-zinc-800 text-white font-semibold" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("movie")}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-sm transition-all duration-300 ${
                  activeTab === "movie" ? "bg-zinc-800 text-white font-semibold" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Movies</span>
              </button>
              <button
                onClick={() => setActiveTab("tv")}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-sm transition-all duration-300 ${
                  activeTab === "tv" ? "bg-zinc-800 text-white font-semibold" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>TV</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-sm bg-zinc-900/50 animate-shimmer"
                />
              ))}
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredResults.map((item) => (
                <div key={`${item.id}-${item.media_type}`} className="w-full flex justify-center">
                  <MovieCard item={item} mediaType={item.media_type as MediaType} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-900/30 rounded-sm border border-zinc-900/50">
              <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Results</h3>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                Try a different search term or browse our catalog.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 text-center text-zinc-500">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-[#E50914] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
