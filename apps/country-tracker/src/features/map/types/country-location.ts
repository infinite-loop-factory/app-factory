export interface CountryLocation {
  country: string;
  country_code: string;
  capital: string;
  latitude: number;
  longitude: number;
}

export type CountryMetadataOverride = {
  country?: string;
  capital?: string;
  aliases?: string[];
};

export type CountryLocationEntry = {
  location: CountryLocation;
  aliases: string[];
};
