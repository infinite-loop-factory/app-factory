import type { User } from "@supabase/supabase-js";

import supabase from "@/libs/supabase";
import { get } from "es-toolkit/compat";
import { useEffect, useRef, useState } from "react";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const prevUserId = useRef<string | null>(null);

  useEffect(() => {
    // 최초 세션 확인
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
      setLoading(false);
    });

    // auth 상태 변화 구독만 사용
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      },
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user || prevUserId.current === user.id) return;
    prevUserId.current = user.id;
    const upsertUser = async () => {
      try {
        const identity = get(user, "identities.0");
        const provider = get(identity, "provider");
        const provider_id = get(identity, "id");
        const userMeta = user.user_metadata || {};
        const name =
          userMeta.name ||
          userMeta.full_name ||
          userMeta.user_name ||
          userMeta.preferred_username ||
          null;
        const avatar_url = get(user, "user_metadata.avatar_url");
        const { error } = await supabase.from("users").upsert({
          id: user.id,
          email: user.email,
          provider,
          provider_id,
          name,
          avatar_url,
        });
        if (error) {
          console.error("Failed to upsert user:", error);
        }
      } catch (err) {
        console.error("Unexpected error during user upsert:", err);
      }
    };
    upsertUser();
  }, [user]);

  return { user, loading };
}
