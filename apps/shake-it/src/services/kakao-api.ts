const KAKAO_REST_API_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY ?? "";

interface KakaoAddress {
  address_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
}

interface KakaoCoordToAddressDocument {
  road_address: KakaoAddress | null;
  address: KakaoAddress | null;
}

interface KakaoCoordToAddressResponse {
  meta: {
    total_count: number;
  };
  documents: KakaoCoordToAddressDocument[];
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
    if (!KAKAO_REST_API_KEY) {
      console.error("Kakao REST API key is missing");
      return "";
    }

    const searchParams = new URLSearchParams({
      x: longitude.toString(),
      y: latitude.toString(),
      input_coord: "WGS84",
    });
    const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error("Kakao reverse geocode failed:", response.status);
      return "";
    }

    const data: KakaoCoordToAddressResponse = await response.json();
    if (data.meta.total_count === 0 || data.documents.length === 0) {
      return "";
    }

    const result = data.documents[0];
    if (!result) {
      return "";
    }

    // 도로명 주소가 있으면 우선 사용, 없으면 지번 주소 사용
    const region = result.road_address ?? result.address;
    if (!region) {
      return "";
    }

    const area2 = region.region_2depth_name;
    const area3 = region.region_3depth_name;

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
    console.error("Kakao reverse geocode error:", error);
    return "";
  }
}
