import type React from "react";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/supabase/supabase";

export interface SupabaseUserInfo {
  id: string;
  email?: string | null;
}

export interface SupabaseAuthState {
  isLoading: boolean;
  isSignedIn: boolean;
  user?: SupabaseUserInfo;
}

interface SupabaseAuthContextValue extends SupabaseAuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextValue | undefined>(
  undefined,
);

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<SupabaseAuthState>({
    isLoading: true,
    isSignedIn: false,
  });

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      setState({
        isLoading: false,
        isSignedIn: !!session,
        user: session?.user
          ? { id: session.user.id, email: session.user.email }
          : undefined,
      });
    });

    // Listen for auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        isLoading: false,
        isSignedIn: !!session,
        user: session?.user
          ? { id: session.user.id, email: session.user.email }
          : undefined,
      });
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("[Supabase] signIn error", error.message);
    }
    setState({
      isLoading: false,
      isSignedIn: !!data.session,
      user: data.session?.user
        ? { id: data.session.user.id, email: data.session.user.email }
        : undefined,
    });
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("[Supabase] signUp error", error.message);
    }
    setState((s) => ({ ...s, isLoading: false }));
    if (data.user && !data.session) {
      // Email confirmations enabled case
      console.error(
        "[Supabase] Sign up successful. Please check your email to confirm.",
      );
    }
  }, []);

  const signOut = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true }));
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[Supabase] signOut error", error.message);
    }
    setState({ isLoading: false, isSignedIn: false });
  }, []);

  const value = useMemo(
    () => ({ ...state, signIn, signUp, signOut }),
    [state, signIn, signUp, signOut],
  );

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const ctx = useContext(SupabaseAuthContext);
  if (!ctx)
    throw new Error("useSupabaseAuth must be used within SupabaseAuthProvider");
  return ctx;
}
