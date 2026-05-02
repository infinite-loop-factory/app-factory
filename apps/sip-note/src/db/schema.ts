export type TastingCategory =
  | "whiskey"
  | "wine"
  | "beer"
  | "sake"
  | "cocktail"
  | "etc";

export type PriceUnit = "glass" | "bottle";

export type TastingNoteRow = {
  id: string;
  category: TastingCategory;
  name: string;
  score: number | null;
  memo: string | null;
  price: number | null;
  price_unit: PriceUnit | null;
  date: number;
  place_id: string | null;
  created_at: number;
  updated_at: number;
};

export type TastingNoteTagRow = {
  note_id: string;
  tag: string;
};

export type TastingNotePhotoRow = {
  note_id: string;
  uri: string;
  sort_order: number;
};

export type PlaceRow = {
  id: string;
  name: string;
  category: string | null;
  latitude: number | null;
  longitude: number | null;
};
