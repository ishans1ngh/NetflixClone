import React from "react";
import HeroBanner from "@/components/hero/HeroBanner";
import ContentRow from "@/components/movie/ContentRow";
import ContinueWatchingRow from "@/components/movie/ContinueWatchingRow";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingTV,
  getPopularTV,
  getMoviesByGenre,
} from "@/lib/tmdb";
import { MOCK_MOVIES } from "@/lib/mockData";

export const revalidate = 3600; // Cache 1 hour

export default async function HomePage() {
  const [
    trendingMovies,
    popularMoviesData,
    topRatedMoviesData,
    trendingTV,
    popularTVData,
    actionMoviesData,
    comedyMoviesData,
    sciFiMoviesData,
  ] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(1),
    getTopRatedMovies(1),
    getTrendingTV(),
    getPopularTV(1),
    getMoviesByGenre(28, 1), // Action
    getMoviesByGenre(35, 1), // Comedy
    getMoviesByGenre(878, 1), // Sci-Fi
  ]);

  // Featured spotlight title (prefer playable item or first trending)
  const heroItem =
    trendingMovies.find((m) => m.id === 88801) ||
    trendingMovies[0] ||
    MOCK_MOVIES[0];

  return (
    <div className="relative pb-16 overflow-hidden">
      {/* 1. Cinematic Hero Banner */}
      <HeroBanner item={heroItem} />

      {/* 2. Content Rows Section */}
      <div className="relative -mt-20 sm:-mt-24 lg:-mt-32 z-20 space-y-2 animate-page-in">
        {/* Continue Watching Section (Client component based on user history) */}
        <ContinueWatchingRow />

        {/* Trending Now */}
        <ContentRow
          title="Trending Now"
          items={trendingMovies}
          mediaType="movie"
          exploreHref="/movies"
        />

        {/* Popular TV Shows */}
        <ContentRow
          title="Binge-Worthy TV Series"
          items={trendingTV}
          mediaType="tv"
          exploreHref="/tv-shows"
        />

        {/* Top Rated Movies */}
        <ContentRow
          title="Top Rated Masterpieces"
          items={topRatedMoviesData.results}
          mediaType="movie"
          exploreHref="/movies?sort=vote_average.desc"
        />

        {/* Sci-Fi & Cyberpunk Thrillers */}
        <ContentRow
          title="Sci-Fi & Futuristic Thrillers"
          items={sciFiMoviesData.results}
          mediaType="movie"
          exploreHref="/movies?genre=878"
        />

        {/* Action Packed Cinema */}
        <ContentRow
          title="Action & High-Octane Cinema"
          items={actionMoviesData.results}
          mediaType="movie"
          exploreHref="/movies?genre=28"
        />

        {/* Popular on CineFlix */}
        <ContentRow
          title="Popular on CineFlix"
          items={popularMoviesData.results}
          mediaType="movie"
          exploreHref="/movies"
        />

        {/* Laugh-Out-Loud Comedies */}
        <ContentRow
          title="Laugh-Out-Loud Comedies"
          items={comedyMoviesData.results}
          mediaType="movie"
          exploreHref="/movies?genre=35"
        />

        {/* Top Rated Series */}
        <ContentRow
          title="Critically Acclaimed Television"
          items={popularTVData.results}
          mediaType="tv"
          exploreHref="/tv-shows"
        />
      </div>
    </div>
  );
}
