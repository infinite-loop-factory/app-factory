import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { queryKeys } from "../queryKeys";

export type PoiItem = {
  id: string;
  name: string;
  roadName?: string;
  firstBuildNo?: string;
  upperAddrName: string;
  middleAddrName: string;
  lowerAddrName: string;
  telNo?: string;
  frontLat?: string;
  frontLon?: string;
};

const fetchSearchResults = async (query: string): Promise<PoiItem[]> => {
  const { data } = await axios.get("https://apis.openapi.sk.com/tmap/pois", {
    params: {
      searchKeyword: query,
      resCoordType: "WGS84GEO",
      reqCoordType: "WGS84GEO",
      count: 10,
    },
    headers: {
      appKey: process.env.EXPO_PUBLIC_TMAP_KEY,
    },
  });

  return data.searchPoiInfo?.pois?.poi || [];
};

export const useFetchSearchLocations = (
  searchQuery: string,
): UseQueryResult<PoiItem[], Error> => {
  return useQuery<PoiItem[], Error>({
    queryKey: [queryKeys.tmap.pois, searchQuery],
    queryFn: () => fetchSearchResults(searchQuery),
    enabled: !!searchQuery,
    staleTime: 1000 * 10,
    gcTime: 1000 * 60,
  });
};
