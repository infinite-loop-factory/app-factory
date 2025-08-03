import { atom } from "jotai";

export interface Coordinate {
  latitude: number;
  longitude: number;
  name: string;
}

export const startPointAtom = atom<Coordinate | null>(null);
export const endPointAtom = atom<Coordinate | null>(null);
