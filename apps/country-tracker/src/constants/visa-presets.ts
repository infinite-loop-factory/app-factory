/**
 * Visa-free stay presets by nationality → destination country.
 * Key: nationality ISO 3166-1 alpha-2 (uppercase)
 * Value: Map of destination country code → max visa-free days
 *
 * Only popular destinations included. Users can always override.
 */
export const VISA_PRESETS: Record<string, Record<string, number>> = {
  KR: {
    JP: 90,
    US: 90,
    CA: 180,
    GB: 180,
    AU: 90,
    NZ: 90,
    SG: 90,
    TH: 90,
    MY: 90,
    PH: 30,
    VN: 15,
    TW: 90,
    HK: 90,
    DE: 90,
    FR: 90,
    IT: 90,
    ES: 90,
    NL: 90,
    CH: 90,
    AT: 90,
    SE: 90,
    CZ: 90,
    PT: 90,
    GR: 90,
    PL: 90,
    HU: 90,
    HR: 90,
    TR: 90,
    MX: 180,
    BR: 90,
    CL: 90,
    AR: 90,
    AE: 30,
  },
  JP: {
    KR: 90,
    US: 90,
    CA: 180,
    GB: 180,
    AU: 90,
    NZ: 90,
    SG: 90,
    TH: 30,
    MY: 90,
    TW: 90,
    HK: 90,
    DE: 90,
    FR: 90,
    IT: 90,
    ES: 90,
    MX: 180,
    BR: 90,
    AE: 30,
  },
  US: {
    KR: 90,
    JP: 90,
    CA: 180,
    GB: 180,
    AU: 90,
    NZ: 90,
    SG: 90,
    TH: 30,
    DE: 90,
    FR: 90,
    IT: 90,
    ES: 90,
    MX: 180,
    BR: 90,
    AE: 30,
  },
};

/**
 * Get suggested visa-free days for a nationality + destination pair.
 * Returns undefined if no preset exists.
 */
export function getVisaPreset(
  nationality: string,
  destinationCode: string,
): number | undefined {
  const nat = nationality.toUpperCase();
  const dest = destinationCode.toUpperCase();
  return VISA_PRESETS[nat]?.[dest];
}
