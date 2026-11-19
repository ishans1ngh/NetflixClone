"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, User, LogOut, Menu, X, Bookmark, Film } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "TV Shows", href: "/tv-shows" },
    { name: "My List", href: "/my-list" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#080808]/95 backdrop-blur-2xl border-b border-zinc-900/50 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Brand & Nav Links */}
        <div className="flex items-center space-x-10 sm:space-x-12">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 bg-[#E50914] rounded-sm flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#E50914]/30">
              <Film className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              CINE<span className="text-[#E50914]">VERSE</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-10 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative transition-all duration-300 ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-7 left-0 right-0 h-0.5 bg-[#E50914] rounded-full shadow-lg shadow-[#E50914]/50" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="bg-black/80 border border-zinc-700/50 text-white text-sm rounded-full pl-10 pr-10 py-2.5 focus:outline-none focus:border-zinc-600 w-64 transition-all duration-300 focus:shadow-lg focus:shadow-black/50"
                />
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="group text-zinc-400 hover:text-white p-2 transition-all duration-300 hover:bg-zinc-900/30 rounded-full"
                title="Search"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>

          {/* Mobile search */}
          <Link
            href="/search"
            className="sm:hidden text-zinc-400 hover:text-white p-2 transition-all duration-300 hover:bg-zinc-900/30 rounded-full"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Watchlist */}
          <Link
            href="/my-list"
            className="hidden sm:flex text-zinc-400 hover:text-white p-2 transition-all duration-300 hover:bg-zinc-900/30 rounded-full"
            title="My List"
          >
            <Bookmark className="w-5 h-5" />
          </Link>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="group flex items-center space-x-2.5 p-1.5 rounded-full hover:bg-zinc-900/30 transition-all duration-300"
            >
              <img
                src={
                  user?.avatar_url ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                }
                alt={user?.username || "Profile"}
                className="w-8 h-8 rounded-full object-cover border-2 border-zinc-800 group-hover:border-zinc-600 transition-all duration-300"
              />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-3 w-56 bg-[#0a0a0a] border border-zinc-800/50 rounded-lg shadow-2xl py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2 duration-200"
                onMouseLeave={() => setProfileOpen(false)}
              >
                <div className="px-4 py-3 border-b border-zinc-800/50">
                  <p className="text-white font-medium truncate">
                    {user?.username || "Guest User"}
                  </p>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">
                    {user?.email || "guest@cineverse.com"}
                  </p>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center space-x-2.5 px-4 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/my-list"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center space-x-2.5 px-4 py-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>My List</span>
                </Link>

                <div className="border-t border-zinc-800/50 my-1" />

                {user ? (
                  <button
                    onClick={() => {
                      signOut();
                      setProfileOpen(false);
                      router.push("/");
                    }}
                    className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-left text-zinc-400 hover:text-red-400 hover:bg-zinc-900/50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 text-white bg-[#E50914] hover:bg-[#f40612] rounded mx-2 my-1 font-medium transition-colors shadow-lg shadow-[#E50914]/20"
                  >
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-zinc-400 hover:text-white p-2 transition-all duration-300 hover:bg-zinc-900/30 rounded-full"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#080808]/98 backdrop-blur-2xl border-b border-zinc-900/50 px-6 py-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative mb-6">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-zinc-700 transition-all duration-300"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                pathname === link.href
                  ? "bg-zinc-900/50 text-white font-semibold"
                  : "text-zinc-400 hover:bg-zinc-900/30 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 rounded-lg text-base font-medium text-zinc-400 hover:bg-zinc-900/30 hover:text-white transition-all duration-300"
          >
            Profile
          </Link>
        </div>
      )}
    </header>
  );
}
