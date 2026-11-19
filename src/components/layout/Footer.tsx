import React from "react";
import Link from "next/link";
import { Film, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] border-t border-zinc-800/80 text-zinc-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-[#E50914] rounded-md flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black tracking-wider text-[#E50914]">
                CINE<span className="text-white">VERSE</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your premier gateway to cinematic discoveries, trending series, classic public-domain masterpieces, and high-definition studio previews.
            </p>
            <div className="flex items-center space-x-2 text-xs text-zinc-500">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Certified Safe & Authorized Streaming</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Explore Content</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Featured Highlights
                </Link>
              </li>
              <li>
                <Link href="/movies" className="hover:text-white transition-colors">
                  Trending Movies
                </Link>
              </li>
              <li>
                <Link href="/tv-shows" className="hover:text-white transition-colors">
                  Popular TV Series
                </Link>
              </li>
              <li>
                <Link href="/my-list" className="hover:text-white transition-colors">
                  My Saved Watchlist
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  Browse by Genre & Actors
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Attribution */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Platform Attribution</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              This product uses the TMDB API for metadata and imagery but is not endorsed or certified by TMDB.
            </p>
            <div className="inline-block px-2.5 py-1 rounded bg-zinc-800/80 text-[11px] text-zinc-300 font-mono">
              TMDB API v3 Integrated
            </div>
          </div>

          {/* Technology & Community */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Technology Stack</h4>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li>Next.js App Router & TypeScript</li>
              <li>Tailwind CSS & Framer Motion</li>
              <li>localStorage for demo persistence</li>
              <li>HTML5 Custom Video Engine</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} CINEVERSE Streaming Systems. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span>Built with modern web standards</span>
            <span>•</span>
            <span className="text-[#E50914] font-medium">Production Ready on Vercel</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
