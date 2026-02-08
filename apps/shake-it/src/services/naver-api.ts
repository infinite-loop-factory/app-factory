const NAVER_CLIENT_ID = process.env.EXPO_PUBLIC_NAVER_CLIENT_ID ?? "";
const NAVER_CLIENT_SECRET = process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET ?? "";

interface ReverseGeocodeRegion {
  area1: { name: string };
  area2: { name: string };
  area3: { name: string };
}

interface ReverseGeocodeResult {
  region: ReverseGeocodeRegion;
}

interface ReverseGeocodeResponse {
  status: { code: number };
  results: ReverseGeocodeResult[];
}

/**
 * 위도/경도를 받아서 한글 지역명을 반환합니다.
 * @param latitude 위도
 * @param longitude 경도
 * @returns 지역명 (예: "강남구 역삼동") 또는 에러 시 빈 문자열
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<string> {
  try {
    const url = `https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${longitude},${latitude}&output=json&orders=legalcode`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-ncp-apigw-api-key-id": NAVER_CLIENT_ID,
        "x-ncp-apigw-api-key": NAVER_CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      console.error("Reverse geocode failed:", response.status);
      return "";
    }

    const data: ReverseGeocodeResponse = await response.json();

    const result = data.results[0];
    if (data.status.code !== 0 || !result) {
      return "";
    }

    const region = result.region;
    const area2 = region.area2.name; // 구/군
    const area3 = region.area3.name; // 동/읍/면

    if (area2 && area3) {
      return `${area2} ${area3}`;
    }
    if (area2) {
      return area2;
    }
    if (area3) {
      return area3;
    }

    return "";
  } catch (error) {
    console.error("Reverse geocode error:", error);
    return "";
  }
}
