import type React from "react";

import * as WebBrowser from "expo-web-browser";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  type NaverAuthResult,
  revokeNaverToken,
  signInWithNaver,
} from "./naver";

export interface AuthUserProfile {
  id: string;
  nickname?: string;
  name?: string;
  email?: string;
  profile_image?: string;
}

export interface AuthState {
  isLoading: boolean;
  isSignedIn: boolean;
  user?: AuthUserProfile;
  accessToken?: string;
}

interface AuthContextValue extends AuthState {
  signInWithNaver: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoading: false,
    isSignedIn: false,
  });

  // Required for Android to properly handle auth session results when app is foregrounded
  WebBrowser.maybeCompleteAuthSession();

  const handleSignInWithNaver = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const result: NaverAuthResult | null = await signInWithNaver();
      if (result?.tokens?.access_token) {
        setState({
          isLoading: false,
          isSignedIn: true,
          accessToken: result.tokens.access_token,
          user: result.profile
            ? {
                id: result.profile.id,
                nickname: result.profile.nickname,
                name: result.profile.name,
                email: result.profile.email,
                profile_image: result.profile.profile_image,
              }
            : undefined,
        });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    } catch (_e) {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    const token = state.accessToken;
    setState({ isLoading: false, isSignedIn: false });
    if (token) {
      try {
        await revokeNaverToken(token);
      } catch (_e) {
        // Best-effort revoke; ignore errors to avoid blocking sign-out UX
      }
    }
  }, [state.accessToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signInWithNaver: handleSignInWithNaver,
      signOut: handleSignOut,
    }),
    [state, handleSignInWithNaver, handleSignOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
