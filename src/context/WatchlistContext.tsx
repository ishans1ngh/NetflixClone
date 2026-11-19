"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { MediaType, WatchHistoryItem, WatchlistItem } from "@/types";
import { useAuth } from "./AuthContext";

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  watchHistory: WatchHistoryItem[];
  isInWatchlist: (contentId: number, contentType: MediaType) => boolean;
  addToWatchlist: (item: {
    content_id: number;
    content_type: MediaType;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date?: string;
  }) => Promise<void>;
  removeFromWatchlist: (contentId: number, contentType: MediaType) => Promise<void>;
  saveProgress: (item: {
    content_id: number;
    content_type: MediaType;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    progress_seconds: number;
    duration_seconds: number;
    episode_title?: string;
    season_number?: number;
    episode_number?: number;
  }) => Promise<void>;
  getProgress: (contentId: number, contentType: MediaType) => WatchHistoryItem | undefined;
  removeFromHistory: (contentId: number, contentType: MediaType) => Promise<void>;
  clearHistory: () => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType>({
  watchlist: [],
  watchHistory: [],
  isInWatchlist: () => false,
  addToWatchlist: async () => {},
  removeFromWatchlist: async () => {},
  saveProgress: async () => {},
  getProgress: () => undefined,
  removeFromHistory: async () => {},
  clearHistory: async () => {},
});

const DEFAULT_SAMPLE_HISTORY: WatchHistoryItem[] = [
  {
    id: "hist-1",
    content_id: 88801,
    content_type: "movie",
    title: "Tears of Steel",
    poster_path: "/2u7zbn8EudG6kLlBzUYqP8Ry244.jpg",
    backdrop_path: "/yF1EbKW8b243qvVYsv2eOEv497e.jpg",
    progress_seconds: 320,
    duration_seconds: 734,
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "hist-2",
    content_id: 88802,
    content_type: "movie",
    title: "Sintel",
    poster_path: "/bOX3D4i96zpjUooPq6gEbehuK1P.jpg",
    backdrop_path: "/6ELCZlTA5lGUops70hKdB83WJxH.jpg",
    progress_seconds: 540,
    duration_seconds: 888,
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);

  // Load initial data from localStorage
  useEffect(() => {
    const savedWl = localStorage.getItem("cineverse_watchlist");
    if (savedWl) {
      try {
        setWatchlist(JSON.parse(savedWl));
      } catch {
        setWatchlist([]);
      }
    }

    const savedHist = localStorage.getItem("cineverse_watch_history");
    if (savedHist) {
      try {
        setWatchHistory(JSON.parse(savedHist));
      } catch {
        setWatchHistory(DEFAULT_SAMPLE_HISTORY);
      }
    } else {
      setWatchHistory(DEFAULT_SAMPLE_HISTORY);
      localStorage.setItem("cineverse_watch_history", JSON.stringify(DEFAULT_SAMPLE_HISTORY));
    }
  }, [user]);

  const isInWatchlist = (contentId: number, contentType: MediaType): boolean => {
    return watchlist.some(
      (item) => item.content_id === contentId && item.content_type === contentType
    );
  };

  const addToWatchlist = async (item: {
    content_id: number;
    content_type: MediaType;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date?: string;
  }) => {
    if (isInWatchlist(item.content_id, item.content_type)) return;

    const newItem: WatchlistItem = {
      id: "wl-" + Math.random().toString(36).substring(2, 9),
      user_id: user?.id,
      content_id: item.content_id,
      content_type: item.content_type,
      title: item.title,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      vote_average: item.vote_average,
      release_date: item.release_date,
      added_at: new Date().toISOString(),
    };

    const updatedList = [newItem, ...watchlist];
    setWatchlist(updatedList);
    localStorage.setItem("cineverse_watchlist", JSON.stringify(updatedList));
  };

  const removeFromWatchlist = async (contentId: number, contentType: MediaType) => {
    const updated = watchlist.filter(
      (item) => !(item.content_id === contentId && item.content_type === contentType)
    );
    setWatchlist(updated);
    localStorage.setItem("cineverse_watchlist", JSON.stringify(updated));
  };

  const saveProgress = async (item: {
    content_id: number;
    content_type: MediaType;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    progress_seconds: number;
    duration_seconds: number;
    episode_title?: string;
    season_number?: number;
    episode_number?: number;
  }) => {
    const existingIndex = watchHistory.findIndex(
      (h) => h.content_id === item.content_id && h.content_type === item.content_type
    );

    const updatedItem: WatchHistoryItem = {
      id: existingIndex >= 0 ? watchHistory[existingIndex].id : "hist-" + Math.random().toString(36).substring(2, 9),
      user_id: user?.id,
      content_id: item.content_id,
      content_type: item.content_type,
      title: item.title,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      progress_seconds: Math.floor(item.progress_seconds),
      duration_seconds: Math.floor(item.duration_seconds),
      episode_title: item.episode_title,
      season_number: item.season_number,
      episode_number: item.episode_number,
      updated_at: new Date().toISOString(),
    };

    let updatedHistory = [...watchHistory];
    if (existingIndex >= 0) {
      updatedHistory.splice(existingIndex, 1);
    }
    updatedHistory = [updatedItem, ...updatedHistory];
    setWatchHistory(updatedHistory);
    localStorage.setItem("cineverse_watch_history", JSON.stringify(updatedHistory));
  };

  const getProgress = (contentId: number, contentType: MediaType) => {
    return watchHistory.find(
      (h) => h.content_id === contentId && h.content_type === contentType
    );
  };

  const removeFromHistory = async (contentId: number, contentType: MediaType) => {
    const updated = watchHistory.filter(
      (h) => !(h.content_id === contentId && h.content_type === contentType)
    );
    setWatchHistory(updated);
    localStorage.setItem("cineverse_watch_history", JSON.stringify(updated));
  };

  const clearHistory = async () => {
    setWatchHistory([]);
    localStorage.removeItem("cineverse_watch_history");
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        watchHistory,
        isInWatchlist,
        addToWatchlist,
        removeFromWatchlist,
        saveProgress,
        getProgress,
        removeFromHistory,
        clearHistory,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => useContext(WatchlistContext);
