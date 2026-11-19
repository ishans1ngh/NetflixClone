"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@/types";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
}

const DEFAULT_GUEST: UserProfile = {
  id: "guest-user-001",
  email: "guest@cineverse.com",
  username: "Cinephile Guest",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
  created_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  continueAsGuest: () => {},
  updateProfile: async () => ({}),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Local storage only - no backend required
    const savedUser = localStorage.getItem("cineverse_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    // Demo authentication - accepts any email/password for demo purposes
    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const mockProfile: UserProfile = {
      id: "usr-" + Math.random().toString(36).substring(2, 9),
      email,
      username: email.split("@")[0],
      avatar_url: DEFAULT_GUEST.avatar_url,
      created_at: new Date().toISOString(),
    };
    setUser(mockProfile);
    localStorage.setItem("cineverse_user", JSON.stringify(mockProfile));
    return {};
  };

  const signUp = async (
    email: string,
    password: string,
    username?: string
  ): Promise<{ error?: string }> => {
    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const mockProfile: UserProfile = {
      id: "usr-" + Math.random().toString(36).substring(2, 9),
      email,
      username: username || email.split("@")[0],
      avatar_url: DEFAULT_GUEST.avatar_url,
      created_at: new Date().toISOString(),
    };
    setUser(mockProfile);
    localStorage.setItem("cineverse_user", JSON.stringify(mockProfile));
    return {};
  };

  const signOut = async () => {
    localStorage.removeItem("cineverse_user");
    setUser(null);
  };

  const continueAsGuest = () => {
    setUser(DEFAULT_GUEST);
    localStorage.setItem("cineverse_user", JSON.stringify(DEFAULT_GUEST));
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ error?: string }> => {
    if (!user) return { error: "No user signed in" };

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("cineverse_user", JSON.stringify(updatedUser));
    return {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        continueAsGuest,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
