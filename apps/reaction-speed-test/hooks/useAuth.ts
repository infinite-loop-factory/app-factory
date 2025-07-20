import type { User } from "@supabase/supabase-js";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAsyncEffect } from "@reactuses/core";
import { noop } from "es-toolkit";
import { createContext, useContext, useState } from "react";
import { supabase } from "@/utils/supabase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  setRedirectPath: (path: string) => Promise<void>;
  getRedirectPath: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useAsyncEffect(
    async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    },
    noop,
    [],
  );

  useAsyncEffect(
    () => {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    },
    noop,
    [],
  );

  const signOut = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem("redirectPath");
  };

  const setRedirectPath = async (path: string) => {
    await AsyncStorage.setItem("redirectPath", path);
  };

  const getRedirectPath = async () => {
    return await AsyncStorage.getItem("redirectPath");
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signOut,
    setRedirectPath,
    getRedirectPath,
  };
};

export { AuthContext };
