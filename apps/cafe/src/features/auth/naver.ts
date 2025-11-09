import { AuthRequest, makeRedirectUri, ResponseType } from "expo-auth-session";
import Constants from "expo-constants";

export interface NaverTokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string; // "bearer"
  expires_in: number | string;
}

export interface NaverProfileResponse {
  resultcode: string; // "00" on success
  message: string;
  response?: {
    id: string;
    nickname?: string;
    name?: string;
    email?: string;
    profile_image?: string;
    age?: string;
    gender?: string; // M | F
    birthday?: string;
    mobile?: string;
  };
}

const NAVER_AUTHORIZE_ENDPOINT = "https://nid.naver.com/oauth2.0/authorize";
const NAVER_TOKEN_ENDPOINT = "https://nid.naver.com/oauth2.0/token";
const NAVER_PROFILE_ENDPOINT = "https://openapi.naver.com/v1/nid/me";

function getEnv() {
  const extra = (Constants.expoConfig?.extra || {}) as Record<string, unknown>;
  return {
    clientId: String(
      extra.NAVER_CLIENT_ID ?? process.env.NAVER_CLIENT_ID ?? "",
    ),
    clientSecret: String(
      extra.NAVER_CLIENT_SECRET ?? process.env.NAVER_CLIENT_SECRET ?? "",
    ),
  };
}

export type NaverAuthResult = {
  tokens: NaverTokenResponse;
  profile?: NaverProfileResponse["response"];
};

export async function signInWithNaver(): Promise<NaverAuthResult | null> {
  const { clientId, clientSecret } = getEnv();
  if (!(clientId && clientSecret)) {
    console.error(
      "NAVER_CLIENT_ID or NAVER_CLIENT_SECRET is not configured in app.config.ts -> extra",
    );
  }

  // Build redirect URI (native: cafe://, web: current origin)
  const redirectUri = makeRedirectUri({
    scheme: Constants.expoConfig?.scheme as string,
    // On web with GitHub Pages we preserve path; AuthSession will infer correctly
    // If you want a custom path, add `path: "auth"` and register the same at Naver console
  });

  const state = Math.random().toString(36).slice(2);

  // Prepare an OAuth request using the modern API
  const request = new AuthRequest({
    clientId,
    redirectUri,
    responseType: ResponseType.Code,
    state,
  });

  const discovery = { authorizationEndpoint: NAVER_AUTHORIZE_ENDPOINT };

  // Ensure URL is constructed (mainly for web correctness)
  await request.makeAuthUrlAsync(discovery);

  // Launch the browser and wait for the redirect back into the app
  const result = await request.promptAsync(discovery);
  if (result.type !== "success") return null;

  const { code, state: returnedState } = (result.params || {}) as Record<
    string,
    string
  >;
  if (!code) return null;
  if (returnedState && returnedState !== state) {
    console.error("State mismatch in Naver login");
  }

  // Exchange code for token
  const tokenRes = await fetch(NAVER_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code,
      state,
      redirect_uri: redirectUri,
    }).toString(),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    throw new Error(`Failed to get Naver token: ${tokenRes.status} ${text}`);
  }

  const tokens = (await tokenRes.json()) as NaverTokenResponse;

  // Fetch profile (requires Authorization header)
  let profile: NaverAuthResult["profile"] | undefined;
  try {
    const profileRes = await fetch(NAVER_PROFILE_ENDPOINT, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profileJson = (await profileRes.json()) as NaverProfileResponse;
    if (profileJson.resultcode === "00" && profileJson.response) {
      profile = profileJson.response;
    }
  } catch (e) {
    console.error("Failed to fetch Naver profile", e);
  }

  return { tokens, profile };
}

export function revokeNaverToken(accessToken: string) {
  // Naver supports token deletion via: https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=...&client_secret=...&access_token=...&service_provider=NAVER
  const { clientId, clientSecret } = getEnv();
  const url = new URL(NAVER_TOKEN_ENDPOINT);
  url.searchParams.set("grant_type", "delete");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("client_secret", clientSecret);
  url.searchParams.set("access_token", accessToken);
  url.searchParams.set("service_provider", "NAVER");
  return fetch(url.toString(), { method: "GET" });
}
