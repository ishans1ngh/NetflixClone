import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Calendar, Tv, ArrowLeft } from "lucide-react";
import ContentRow from "@/components/movie/ContentRow";
import { getTVDetails, getBackdropUrl, getImageUrl } from "@/lib/tmdb";
import TVDetailClient from "./TVDetailClient";

interface TVPageProps {
  params: Promise<{ id: string }>;
}

export default async function TVDetailPage({ params }: TVPageProps) {
  const { id } = await params;
  const show = await getTVDetails(id);

  if (!show) {
    notFound();
  }

  const title = show.name || "TV Series Details";
  const releaseYear = (show.first_air_date || "").substring(0, 4) || "2024";
  const rating = show.vote_average ? show.vote_average.toFixed(1) : "8.4";
  const backdropUrl = getBackdropUrl(show.backdrop_path);
  const posterUrl = getImageUrl(show.poster_path, "w500");

  const cast = show.credits?.cast?.slice(0, 8) || [];
  const similarShows = show.similar?.results || [];
  const trailer =
    show.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
    show.videos?.results?.[0];

  return (
    <div className="relative pb-20">
      {/* Hero Backdrop */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden select-none">
        <img
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover object-center"
        />

        {/* Gradient Vignettes */}
        <div className="absolute inset-0 hero-gradient-left" />
        <div className="absolute inset-0 hero-gradient-bottom" />

        {/* Back Link */}
        <div className="absolute top-24 left-6 sm:left-8 lg:left-12 z-30">
          <Link
            href="/tv-shows"
            className="flex items-center space-x-2 text-xs font-medium text-zinc-400 hover:text-white bg-black/60 px-4 py-2 rounded-full border border-zinc-800/50 backdrop-blur-sm transition-all duration-300 hover:bg-black/80"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>

        {/* Show Title & Meta Overlay */}
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-12 sm:pb-16">
          <div className="max-w-3xl space-y-5">
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
              <span className="flex items-center bg-[#E50914] text-white px-3 py-1 rounded-sm font-semibold uppercase text-xs">
                TV Series
              </span>
              <span className="flex items-center text-amber-400 font-semibold bg-black/60 px-2.5 py-1 rounded border border-zinc-800/50">
                <Star className="w-4 h-4 fill-amber-400 mr-1.5" />
                {rating}
              </span>
              <span className="flex items-center text-zinc-300 bg-black/50 px-2.5 py-1 rounded border border-zinc-800/50">
                <Calendar className="w-4 h-4 mr-1.5 text-zinc-500" />
                {releaseYear}
              </span>
              {show.number_of_seasons && (
                <span className="flex items-center text-zinc-300 bg-black/50 px-2.5 py-1 rounded border border-zinc-800/50">
                  <Tv className="w-4 h-4 mr-1.5 text-zinc-500" />
                  {show.number_of_seasons} {show.number_of_seasons === 1 ? "Season" : "Seasons"}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight cinematic-text-shadow leading-tight">
              {title}
            </h1>

            {show.tagline && (
              <p className="text-sm sm:text-base italic text-zinc-400 font-light leading-relaxed max-w-2xl">
                "{show.tagline}"
              </p>
            )}

            {/* Interactive TV Actions */}
            <TVDetailClient show={show} trailerKey={trailer?.key} />
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* Left: Poster */}
          <div className="hidden md:block">
            <div className="aspect-[2/3] w-full rounded-sm overflow-hidden border border-zinc-800/30 shadow-2xl bg-zinc-900">
              <img
                src={posterUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Synopsis, Genres, Cast */}
          <div className="md:col-span-2 lg:col-span-3 space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">Series Overview</h2>
              <p className="text-base text-zinc-400 leading-relaxed font-light">
                {show.overview || "No overview available for this series."}
              </p>
            </div>

            {/* Genres */}
            {show.genres && show.genres.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {show.genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/tv-shows?genre=${genre.id}`}
                      className="text-xs px-3 py-1.5 bg-zinc-900/50 hover:bg-zinc-800/50 text-zinc-400 hover:text-white rounded-sm border border-zinc-800/30 transition-all duration-300"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Cast */}
            {cast.length > 0 && (
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
                  Cast
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {cast.map((actor) => (
                    <div
                      key={actor.id}
                      className="bg-zinc-900/30 border border-zinc-800/30 rounded-sm p-3 flex items-center space-x-3 hover:bg-zinc-900/50 transition-colors duration-300"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 flex-none">
                        <img
                          src={getImageUrl(actor.profile_path, "w300")}
                          alt={actor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{actor.name}</p>
                        <p className="text-[11px] text-zinc-500 truncate">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar TV Shows */}
        {similarShows.length > 0 && (
          <div className="pt-8 border-t border-zinc-900/50">
            <ContentRow
              title="More Series Like This"
              items={similarShows}
              mediaType="tv"
            />
          </div>
        )}
      </div>
    </div>
  );
}
