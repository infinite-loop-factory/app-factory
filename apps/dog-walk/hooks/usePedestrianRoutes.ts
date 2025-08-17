import axios from "axios";

interface IDetailMapProps {
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
}

interface TMapResponse {
  features: {
    geometry: {
      type: string;
      coordinates: [number, number][];
    };
    properties: {
      totalDistance: number;
      totalTime: number;
    };
  }[];
}

export default function usePedestrianRoutes() {
  const fetchRoutes = async ({ start, end }: IDetailMapProps) => {
    if (!(start.latitude && start.longitude && end.latitude && end.longitude))
      return;

    const requestBody = {
      startX: start.longitude,
      startY: start.latitude,
      endX: end.longitude,
      endY: end.latitude,
      reqCoordType: "WGS84GEO",
      resCoordType: "WGS84GEO",
      startName: "출발지",
      endName: "도착지",
    };

    try {
      const { data } = await axios.post<TMapResponse>(
        "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            appKey: process.env.EXPO_PUBLIC_TMAP_KEY,
          },
        },
      );

      return data.features;
    } catch (_error) {
      throw new Error("경로 조회에 실패했습니다");
    }
  };

  const getRoutes = async ({ start, end }: IDetailMapProps) => {
    const data = await fetchRoutes({ start, end });

    if (!data?.length)
      return { pathCoords: [], totalDistance: 0, totalTime: 0 };

    const distanceFeature = data.find(
      (item) => item.properties?.totalDistance !== undefined,
    );
    const totalDistance = distanceFeature?.properties?.totalDistance ?? 0;
    const totalTime = distanceFeature?.properties?.totalTime ?? 0;

    const pathCoords = data
      .filter((item) => item.geometry.type === "LineString")
      .flatMap((item) => item.geometry.coordinates)
      .map(([lon, lat]) => ({ lat, lon }));

    return { pathCoords, totalDistance, totalTime };
  };

  return { getRoutes };
}
