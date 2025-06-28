import {
  clearAutoLoginSetting,
  getAutoLoginSetting,
} from "@/utils/autoLoginStorage";
import { supabase } from "@/utils/supabase";
import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

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
    } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthState({
        user: session?.user ?? null,
        session: session,
        loading: false,
        isAuthenticated: !!session?.user,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      }
      await clearAutoLoginSetting();
    } catch (error) {
      console.error("Error in signOut:", error);
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
  };
};
