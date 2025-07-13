import type { Session, User } from "@supabase/supabase-js";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Href, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  clearAutoLoginSetting,
  getAutoLoginSetting,
} from "@/utils/autoLoginStorage";
import { supabase } from "@/utils/supabase";

const REDIRECT_KEY = "redirect_after_login";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
  });
  const router = useRouter();

  const handleSuccessfulLogin = useCallback(async () => {
    try {
      const redirectPath = await AsyncStorage.getItem(REDIRECT_KEY);

      if (redirectPath) {
        await AsyncStorage.removeItem(REDIRECT_KEY);
        router.push(redirectPath as Href);
      } else {
        router.push("/menu");
      }
    } catch (error) {
      console.error("Error handling redirect:", error);
      router.push("/menu");
    }
  }, [router]);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const autoLoginEnabled = await getAutoLoginSetting();

        if (!autoLoginEnabled) {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            isAuthenticated: false,
          });
          return;
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
        }

        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false,
          isAuthenticated: !!session?.user,
        });
      } catch (error) {
        console.error("Error in getInitialSession:", error);
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setAuthState({
          user: session.user,
          session: session,
          loading: false,
          isAuthenticated: true,
        });

        if (event === "SIGNED_IN") {
          await handleSuccessfulLogin();
        }
      } else {
        setAuthState({
          user: null,
          session: null,
          loading: false,
          isAuthenticated: false,
        });

        if (event === "SIGNED_OUT") {
          router.push("/");
        }
      }

      setAuthState((prev) => ({ ...prev, loading: false }));
    });

    return () => subscription.unsubscribe();
  }, [router, handleSuccessfulLogin]);

  const setRedirectPath = async (path: string) => {
    try {
      await AsyncStorage.setItem(REDIRECT_KEY, path);
    } catch (error) {
      console.error("Error setting redirect path:", error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        throw error;
      }
      await clearAutoLoginSetting();
    } catch (error) {
      console.error("Error in signOut:", error);
      throw error;
    }
  };

  const refreshSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Error refreshing session:", error);
      }
      return session;
    } catch (error) {
      console.error("Error in refreshSession:", error);
      return null;
    }
  };

  return {
    ...authState,
    signOut,
    refreshSession,
    setRedirectPath,
  };
};
