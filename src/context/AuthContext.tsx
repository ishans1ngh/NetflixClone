"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@/types";
import { supabase } from "@/lib/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: UserProfile | null;
  supabaseUser: User | null;
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
  supabaseUser: null,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  continueAsGuest: () => {},
  updateProfile: async () => ({}),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        const userProfile: UserProfile = {
          id: session.user.id,
          email: session.user.email || "",
          username: session.user.user_metadata?.username || session.user.email?.split("@")[0] || "",
          avatar_url: session.user.user_metadata?.avatar_url || DEFAULT_GUEST.avatar_url,
          created_at: session.user.created_at || new Date().toISOString(),
        };
        setUser(userProfile);
      } else {
        // Fallback to localStorage for guest users
        const savedUser = localStorage.getItem("cineverse_user");
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            setUser(null);
          }
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user);
          const userProfile: UserProfile = {
            id: session.user.id,
            email: session.user.email || "",
            username: session.user.user_metadata?.username || session.user.email?.split("@")[0] || "",
            avatar_url: session.user.user_metadata?.avatar_url || DEFAULT_GUEST.avatar_url,
            created_at: session.user.created_at || new Date().toISOString(),
          };
          setUser(userProfile);
        } else {
          setSupabaseUser(null);
          // Keep guest user if signed in as guest
          const savedUser = localStorage.getItem("cineverse_user");
          if (savedUser) {
            try {
              const parsed = JSON.parse(savedUser);
              if (parsed.id === DEFAULT_GUEST.id) {
                setUser(parsed);
              } else {
                setUser(null);
                localStorage.removeItem("cineverse_user");
              }
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split("@")[0],
          avatar_url: DEFAULT_GUEST.avatar_url,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("cineverse_user");
    setUser(null);
    setSupabaseUser(null);
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
        supabaseUser,
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
