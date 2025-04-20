import axios from "axios";
import { useState } from "react";

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

interface Coord {
  lat: number;
  lon: number;
}

interface TMapResponse {
  features: {
    geometry: {
      type: string;
      coordinates: [number, number][];
    };
  }[];
}

export default function usePedestrianRoutes() {
  const [pathCoords, setPathCoords] = useState<Coord[]>([]);

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

    if (!data?.length) return [];

    const pathCoords = data
      .filter((item) => item.geometry.type === "LineString")
      .flatMap((item) => item.geometry.coordinates)
      .map(([lon, lat]) => ({ lat, lon }));

    setPathCoords(pathCoords);

    return pathCoords;
  };

  return { getRoutes, pathCoords };
}
