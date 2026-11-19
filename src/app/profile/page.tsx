"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Film,
  Bookmark,
  Clock,
  Trash2,
  LogOut,
  CheckCircle2,
  Edit2,
  Save,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWatchlist } from "@/context/WatchlistContext";

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut, updateProfile } = useAuth();
  const { watchlist, watchHistory, clearHistory, removeFromHistory } = useWatchlist();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "Guest");
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar_url || AVATAR_OPTIONS[0]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      username: username.trim() || user?.username,
      avatar_url: selectedAvatar,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const totalWatchMinutes = watchHistory.reduce(
    (acc, cur) => acc + Math.floor(cur.progress_seconds / 60),
    0
  );

  return (
    <div className="pt-28 sm:pt-32 pb-16 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
      {/* Profile Card */}
      <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-sm p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="relative">
              <img
                src={selectedAvatar}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-zinc-800"
              />
              <span className="absolute bottom-0 right-0 bg-emerald-500 w-4 h-4 rounded-full border-2 border-[#080808]" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-semibold text-white">
                  {user?.username || "Guest"}
                </h1>
                <span className="bg-zinc-800/50 text-zinc-500 text-[10px] font-medium uppercase px-2 py-0.5 rounded border border-zinc-800/30">
                  Demo
                </span>
              </div>
              <p className="text-sm text-zinc-500">{user?.email || "guest@cineverse.com"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-zinc-900/50 hover:bg-zinc-900/80 text-white text-xs font-medium px-4 py-2.5 rounded-sm border border-zinc-800/30 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            ) : null}

            {user ? (
              <button
                onClick={async () => {
                  await signOut();
                  router.push("/");
                }}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-zinc-900/30 hover:bg-red-950/30 text-zinc-500 hover:text-red-400 text-xs font-medium px-4 py-2.5 rounded-sm border border-zinc-800/30 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-[#E50914] hover:bg-[#f40612] text-white text-xs font-medium px-4 py-2.5 rounded-sm transition-colors"
              >
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-6 pt-6 border-t border-zinc-800/30 space-y-4 animate-in fade-in duration-200"
          >
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full sm:w-72 bg-zinc-900/50 border border-zinc-800/50 text-white text-sm rounded-sm px-3 py-2.5 focus:outline-none focus:border-zinc-700 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase mb-3">
                Avatar
              </label>
              <div className="flex items-center space-x-3">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                      selectedAvatar === av
                        ? "border-[#E50914] scale-105"
                        : "border-zinc-800/50 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                className="flex items-center space-x-1.5 bg-[#E50914] hover:bg-[#f40612] text-white text-xs font-medium px-4 py-2.5 rounded-sm transition-colors btn-press"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-zinc-900/50 hover:bg-zinc-900/80 text-zinc-400 text-xs font-medium px-4 py-2.5 rounded-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {saveSuccess && (
          <div className="mt-4 flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 p-2.5 rounded-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-sm p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-sm bg-[#E50914]/10 text-[#E50914] flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">{watchlist.length}</p>
            <p className="text-xs text-zinc-500">Watchlist</p>
          </div>
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-sm p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-sm bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">{watchHistory.length}</p>
            <p className="text-xs text-zinc-500">Watched</p>
          </div>
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-sm p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-sm bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">{totalWatchMinutes}m</p>
            <p className="text-xs text-zinc-500">Watch Time</p>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-zinc-900/30 border border-zinc-800/30 rounded-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/30">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-[#E50914]" />
            <h2 className="text-lg font-semibold text-white">Viewing History</h2>
          </div>

          {watchHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-zinc-500 hover:text-red-400 flex items-center space-x-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {watchHistory.length > 0 ? (
          <div className="space-y-3">
            {watchHistory.map((item) => {
              const percent =
                item.duration_seconds > 0
                  ? Math.round((item.progress_seconds / item.duration_seconds) * 100)
                  : 0;

              return (
                <div
                  key={`${item.content_id}-${item.content_type}`}
                  className="bg-zinc-900/30 border border-zinc-800/30 rounded-sm p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className="w-20 aspect-video rounded-sm overflow-hidden bg-zinc-900 flex-none">
                      <img
                        src={`https://image.tmdb.org/t/p/w300${item.backdrop_path || item.poster_path}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                      <p className="text-xs text-zinc-500">
                        {Math.floor(item.progress_seconds / 60)} min ({percent}%)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 flex-none">
                    <button
                      onClick={() => window.location.href = `/watch?id=${item.content_id}&type=${item.content_type}&t=${item.progress_seconds}`}
                      className="px-4 py-2 bg-zinc-900/50 hover:bg-[#E50914] text-white text-xs font-medium rounded-sm transition-colors btn-press"
                    >
                      Resume
                    </button>
                    <button
                      onClick={() => removeFromHistory(item.content_id, item.content_type)}
                      className="text-zinc-600 hover:text-zinc-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500 text-sm">
            No viewing history yet.
          </div>
        )}
      </div>
    </div>
  );
}
