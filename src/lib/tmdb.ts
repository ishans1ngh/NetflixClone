import { MediaItem, Season } from "@/types";
import { MOCK_MOVIES, MOCK_TV_SHOWS } from "./mockData";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export function getImageUrl(
  path: string | null | undefined,
  size: "w300" | "w500" | "w780" | "w1280" | "original" = "w500"
): string {
  if (!path) {
    return "/images/poster-placeholder.svg";
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(
  path: string | null | undefined,
  size: "w780" | "w1280" | "original" = "original"
): string {
  if (!path) {
    return "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80";
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

async function tmdbFetch<T>(endpoint: string, queryParams: Record<string, string | number> = {}): Promise<T | null> {
  const apiKey = process.env.TMDB_API_KEY;
  const apiToken = process.env.TMDB_READ_ACCESS_TOKEN;
  const useMockOnly = process.env.USE_MOCK_DATA === "true";

  // If mock only mode or no API key configured, return null to activate fallback mock data
  if (useMockOnly || (!apiKey && !apiToken)) {
    return null;
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  
  if (apiKey) {
    url.searchParams.append("api_key", apiKey);
  }

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (apiToken && !apiKey) {
    headers["Authorization"] = `Bearer ${apiToken}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const res = await fetch(url.toString(), {
      headers,
      signal: controller.signal,
      next: { revalidate: 3600 }, // Cache 1 hour
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`TMDB API response not OK [${res.status}] for ${endpoint}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(`TMDB API fetch error for ${endpoint}:`, error);
    return null;
  }
}

export async function getTrendingMovies(timeWindow = "week"): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: MediaItem[] }>(`/trending/movie/${timeWindow}`);
  if (data?.results && data.results.length > 0) {
    return data.results.map((item) => ({ ...item, media_type: "movie" }));
  }
  return MOCK_MOVIES;
}

export async function getTrendingTV(timeWindow = "week"): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: MediaItem[] }>(`/trending/tv/${timeWindow}`);
  if (data?.results && data.results.length > 0) {
    return data.results.map((item) => ({ ...item, media_type: "tv" }));
  }
  return MOCK_TV_SHOWS;
}

export async function getPopularMovies(page = 1): Promise<{ results: MediaItem[]; total_pages: number }> {
  const data = await tmdbFetch<{ results: MediaItem[]; total_pages: number }>(`/movie/popular`, { page });
  if (data?.results && data.results.length > 0) {
    return {
      results: data.results.map((item) => ({ ...item, media_type: "movie" })),
      total_pages: data.total_pages || 1,
    };
  }
  return { results: MOCK_MOVIES, total_pages: 1 };
}

export async function getTopRatedMovies(page = 1): Promise<{ results: MediaItem[]; total_pages: number }> {
  const data = await tmdbFetch<{ results: MediaItem[]; total_pages: number }>(`/movie/top_rated`, { page });
  if (data?.results && data.results.length > 0) {
    return {
      results: data.results.map((item) => ({ ...item, media_type: "movie" })),
      total_pages: data.total_pages || 1,
    };
  }
  return { results: [...MOCK_MOVIES].sort((a, b) => b.vote_average - a.vote_average), total_pages: 1 };
}

export async function getUpcomingMovies(page = 1): Promise<{ results: MediaItem[]; total_pages: number }> {
  const data = await tmdbFetch<{ results: MediaItem[]; total_pages: number }>(`/movie/upcoming`, { page });
  if (data?.results && data.results.length > 0) {
    return {
      results: data.results.map((item) => ({ ...item, media_type: "movie" })),
      total_pages: data.total_pages || 1,
    };
  }
  return { results: MOCK_MOVIES, total_pages: 1 };
}

export async function getPopularTV(page = 1): Promise<{ results: MediaItem[]; total_pages: number }> {
  const data = await tmdbFetch<{ results: MediaItem[]; total_pages: number }>(`/tv/popular`, { page });
  if (data?.results && data.results.length > 0) {
    return {
      results: data.results.map((item) => ({ ...item, media_type: "tv" })),
      total_pages: data.total_pages || 1,
    };
  }
  return { results: MOCK_TV_SHOWS, total_pages: 1 };
}

export async function getTopRatedTV(page = 1): Promise<{ results: MediaItem[]; total_pages: number }> {
  const data = await tmdbFetch<{ results: MediaItem[]; total_pages: number }>(`/tv/top_rated`, { page });
  if (data?.results && data.results.length > 0) {
    return {
      results: data.results.map((item) => ({ ...item, media_type: "tv" })),
      total_pages: data.total_pages || 1,
    };
  }
  return { results: [...MOCK_TV_SHOWS].sort((a, b) => b.vote_average - a.vote_average), total_pages: 1 };
}

export async function getMoviesByGenre(
  genreId?: number,
  page = 1,
  sortBy = "popularity.desc"
): Promise<{ results: MediaItem[]; total_pages: number }> {
  const params: Record<string, string | number> = {
    page,
    sort_by: sortBy,
  };
  if (genreId) {
    params.with_genres = genreId;
  }
  const data = await tmdbFetch<{ results: MediaItem[]; total_pages: number }>(`/discover/movie`, params);
  if (data?.results && data.results.length > 0) {
    return {
      results: data.results.map((item) => ({ ...item, media_type: "movie" })),
      total_pages: data.total_pages || 1,
    };
  }

  // Fallback filtering
  const filtered = genreId
    ? MOCK_MOVIES.filter((m) => m.genre_ids?.includes(genreId) || m.genres?.some((g) => g.id === genreId))
    : MOCK_MOVIES;
  return { results: filtered.length > 0 ? filtered : MOCK_MOVIES, total_pages: 1 };
}

export async function getTVByGenre(
  genreId?: number,
  page = 1,
  sortBy = "popularity.desc"
): Promise<{ results: MediaItem[]; total_pages: number }> {
  const params: Record<string, string | number> = {
    page,
    sort_by: sortBy,
  };
  if (genreId) {
    params.with_genres = genreId;
  }
  const data = await tmdbFetch<{ results: MediaItem[]; total_pages: number }>(`/discover/tv`, params);
  if (data?.results && data.results.length > 0) {
    return {
      results: data.results.map((item) => ({ ...item, media_type: "tv" })),
      total_pages: data.total_pages || 1,
    };
  }

  const filtered = genreId
    ? MOCK_TV_SHOWS.filter((s) => s.genre_ids?.includes(genreId) || s.genres?.some((g) => g.id === genreId))
    : MOCK_TV_SHOWS;
  return { results: filtered.length > 0 ? filtered : MOCK_TV_SHOWS, total_pages: 1 };
}

export async function getMovieDetails(id: string | number): Promise<MediaItem | null> {
  const numId = Number(id);
  // Check our playable registry / mock first if ID matches
  const localMatch = MOCK_MOVIES.find((m) => m.id === numId);

  const data = await tmdbFetch<MediaItem>(`/movie/${id}`, {
    append_to_response: "videos,credits,similar",
  });

  if (data) {
    return { ...data, media_type: "movie" };
  }

  if (localMatch) {
    return localMatch;
  }

  // Fallback to first mock movie
  return MOCK_MOVIES[0] || null;
}

export async function getTVDetails(id: string | number): Promise<MediaItem | null> {
  const numId = Number(id);
  const localMatch = MOCK_TV_SHOWS.find((s) => s.id === numId);

  const data = await tmdbFetch<MediaItem>(`/tv/${id}`, {
    append_to_response: "videos,credits,similar",
  });

  if (data) {
    return { ...data, media_type: "tv" };
  }

  if (localMatch) {
    return localMatch;
  }

  return MOCK_TV_SHOWS[0] || null;
}

export async function getTVSeason(tvId: string | number, seasonNumber: number): Promise<Season | null> {
  const data = await tmdbFetch<Season>(`/tv/${tvId}/season/${seasonNumber}`);
  if (data) {
    return data;
  }

  const localShow = MOCK_TV_SHOWS.find((s) => s.id === Number(tvId));
  const localSeason = localShow?.seasons?.find((s) => s.season_number === seasonNumber);
  return localSeason || null;
}

export async function searchMulti(
  query: string,
  page = 1
): Promise<{ results: MediaItem[]; total_pages: number }> {
  if (!query || query.trim() === "") {
    return { results: [], total_pages: 0 };
  }

  const data = await tmdbFetch<{ results: MediaItem[]; total_pages: number }>(`/search/multi`, {
    query: encodeURIComponent(query),
    page,
  });

  if (data?.results && data.results.length > 0) {
    const filtered = data.results.filter(
      (item) => item.media_type === "movie" || item.media_type === "tv"
    );
    return {
      results: filtered,
      total_pages: data.total_pages || 1,
    };
  }

  // Fallback client/mock search
  const q = query.toLowerCase();
  const matchedMovies = MOCK_MOVIES.filter(
    (m) =>
      m.title?.toLowerCase().includes(q) ||
      m.overview?.toLowerCase().includes(q) ||
      m.credits?.cast?.some((c) => c.name.toLowerCase().includes(q))
  );
  const matchedTV = MOCK_TV_SHOWS.filter(
    (s) =>
      s.name?.toLowerCase().includes(q) ||
      s.overview?.toLowerCase().includes(q) ||
      s.credits?.cast?.some((c) => c.name.toLowerCase().includes(q))
  );

  return {
    results: [...matchedMovies, ...matchedTV],
    total_pages: 1,
  };
}
