"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Film, Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, continueAsGuest } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter email and password.");
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setErrorMessage(error);
    } else {
      router.push("/");
    }
  };

  const handleGuestLogin = () => {
    continueAsGuest();
    router.push("/");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-20 select-none overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-[#080808] to-black z-0" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10 filter blur-sm scale-105 z-0" />

      <div className="relative z-10 w-full max-w-md bg-[#0a0a0a]/80 border border-zinc-800/50 backdrop-blur-xl rounded-sm p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center space-x-2.5">
            <div className="w-10 h-10 bg-[#E50914] rounded-sm flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              CINE<span className="text-[#E50914]">VERSE</span>
            </span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-semibold text-white">
            Sign In
          </h1>
          <p className="text-sm text-zinc-500">
            Welcome back to CINEVERSE
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-xs p-3 rounded-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-zinc-900/50 border border-zinc-800/50 text-white text-sm rounded-sm pl-10 pr-4 py-3 focus:outline-none focus:border-zinc-700 transition-colors"
              />
              <Mail className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••••"
                required
                className="w-full bg-zinc-900/50 border border-zinc-800/50 text-white text-sm rounded-sm pl-10 pr-10 py-3 focus:outline-none focus:border-zinc-700 transition-colors"
              />
              <Lock className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E50914] hover:bg-[#f40612] text-white font-medium text-sm py-3 rounded-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center justify-center space-x-2 btn-press"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-zinc-800/50 space-y-4">
          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full bg-zinc-900/50 hover:bg-zinc-900/80 text-white text-xs font-medium py-3 rounded-sm border border-zinc-800/30 transition-colors"
          >
            Continue as Guest
          </button>

          <p className="text-center text-xs text-zinc-500">
            New to CINEVERSE?{" "}
            <Link href="/signup" className="text-white font-medium hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
