import type { PriceUnit, TastingCategory } from "@/db/schema";

export type TastingNote = {
  id: string;
  category: TastingCategory;
  name: string;
  score: number | null;
  memo: string | null;
  price: number | null;
  priceUnit: PriceUnit | null;
  date: number;
  placeId: string | null;
  tags: string[];
  photos: string[];
  createdAt: number;
  updatedAt: number;
};

export type TastingNoteInput = {
  category: TastingCategory;
  name: string;
  score?: number | null;
  memo?: string | null;
  price?: number | null;
  priceUnit?: PriceUnit | null;
  date: number;
  placeId?: string | null;
  tags?: string[];
  photos?: string[];
};

export type TastingNoteFilter = {
  category?: TastingCategory;
  scoreMin?: number;
  scoreMax?: number;
  tags?: string[];
  dateFrom?: number;
  dateTo?: number;
  query?: string;
};
