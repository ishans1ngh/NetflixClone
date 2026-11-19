import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Clock, Calendar, ArrowLeft } from "lucide-react";
import ContentRow from "@/components/movie/ContentRow";
import { getMovieDetails, getBackdropUrl, getImageUrl } from "@/lib/tmdb";
import { PLAYABLE_REGISTRY } from "@/lib/mockData";
import MovieDetailActions from "./MovieDetailActions";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  if (!movie) {
    notFound();
  }

  const title = movie.title || "Movie Details";
  const releaseYear = (movie.release_date || "").substring(0, 4) || "2024";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "8.2";
  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const posterUrl = getImageUrl(movie.poster_path, "w500");

  const director = movie.credits?.crew?.find((c) => c.job === "Director")?.name;
  const cast = movie.credits?.cast?.slice(0, 8) || [];
  const similarMovies = movie.similar?.results || [];

  const trailer =
    movie.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
    movie.videos?.results?.[0];

  const isPlayable = Boolean(PLAYABLE_REGISTRY[Number(id)]);

  return (
    <div className="relative pb-20">
      {/* Hero Backdrop Section */}
      <div className="relative w-full h-[65vh] sm:h-[75vh] lg:h-[85vh] overflow-hidden select-none">
        <img
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover object-center"
        />

        {/* Enhanced Gradient Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/20" />

        {/* Back Button */}
        <div className="absolute top-24 left-6 sm:left-8 lg:left-12 z-30">
          <Link
            href="/movies"
            className="group flex items-center space-x-2 text-xs font-medium text-zinc-400 hover:text-white bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800/50 transition-all duration-300 hover:bg-black/80 hover:border-zinc-700"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </Link>
        </div>

        {/* Movie Header Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-12 sm:pb-16">
          <div className="max-w-3xl space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
              <span className="flex items-center bg-[#E50914] text-white px-3 py-1.5 rounded-sm font-semibold tracking-widest uppercase text-[11px] shadow-lg shadow-[#E50914]/30">
                Movie
              </span>
              <span className="flex items-center text-amber-400 font-semibold bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded-sm border border-amber-400/20">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1.5" />
                {rating}
              </span>
              <span className="flex items-center text-zinc-300 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-sm border border-zinc-800/50">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
                {releaseYear}
              </span>
              {movie.runtime && (
                <span className="flex items-center text-zinc-300 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-sm border border-zinc-800/50">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-zinc-500" />
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight cinematic-text-shadow leading-[1.1]">
              {title}
            </h1>

            {movie.tagline && (
              <p className="text-sm sm:text-base lg:text-lg italic text-zinc-400 font-light leading-relaxed max-w-2xl">
                "{movie.tagline}"
              </p>
            )}

            {/* Client interactive buttons */}
            <MovieDetailActions movie={movie} trailerKey={trailer?.key} isPlayable={isPlayable} />
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* Left: Poster */}
          <div className="hidden md:block">
            <div className="aspect-[2/3] w-full rounded-sm overflow-hidden border border-zinc-800/40 shadow-2xl bg-zinc-900">
              <img
                src={posterUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Synopsis, Genres, Cast & Crew */}
          <div className="md:col-span-2 lg:col-span-3 space-y-10">
            {/* Overview */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 tracking-tight">Overview</h2>
              <p className="text-base lg:text-lg text-zinc-400 leading-relaxed font-light">
                {movie.overview || "No extended synopsis is currently available."}
              </p>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/movies?genre=${genre.id}`}
                      className="text-xs px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800/50 text-zinc-400 hover:text-white rounded-sm border border-zinc-800/40 transition-all duration-300 hover:border-zinc-700"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Director */}
            {director && (
              <div>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mr-2">
                  Director:
                </span>
                <span className="text-sm text-zinc-300 font-medium">{director}</span>
              </div>
            )}

            {/* Top Cast */}
            {cast.length > 0 && (
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
                  Cast
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {cast.map((actor) => (
                    <div
                      key={actor.id}
                      className="bg-zinc-900/30 border border-zinc-800/40 rounded-sm p-3 flex items-center space-x-3 hover:bg-zinc-900/50 hover:border-zinc-700/50 transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 flex-none border border-zinc-700/30">
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

        {/* Similar Titles Row */}
        {similarMovies.length > 0 && (
          <div className="pt-8 border-t border-zinc-900/50">
            <ContentRow
              title="More Like This"
              items={similarMovies}
              mediaType="movie"
            />
          </div>
        )}
      </div>
    </div>
  );
}
