import { create } from "zustand";

type OrderType = {
  id: number;
};

type UserStoreProps = {
  order: OrderType | null;
  setOrder: (id: number) => void;
};

export const useOrderStore = create<UserStoreProps>((set) => ({
  order: { id: 1 },
  setOrder: (id: number) => set({ order: { id } }),
}));
