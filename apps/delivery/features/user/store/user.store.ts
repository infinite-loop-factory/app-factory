import { supabase } from "@/supabase/utils/supabase";
import { create } from "zustand";

type UserType = {
  id: string;
  email: string;
  name: string;
};

type UserStoreProps = {
  user?: UserType | null;
  isLogin: boolean;
  setUser: (user: UserType) => void;
  logout: () => void;
};

export const useUserStore = create<UserStoreProps>((set) => ({
  isLogin: false,
  setUser: (user: UserType) => set({ user, isLogin: true }),
  logout: () => {
    supabase.auth.signOut().then(() => set({ user: null }));
  },
}));
