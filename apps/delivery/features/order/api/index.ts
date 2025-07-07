import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase/utils/supabase";

export function useDriverLocationsInterval({ orderId }: { orderId: number }) {
  return useQuery({
    gcTime: 0,
    queryFn: async () => {
      const newVar = await supabase
        .from("driver_location")
        .select("lon, lat, order(id)")
        .eq("order.id", orderId)
        .single();

      // biome-ignore lint/suspicious/noConsole: debug
      console.log(newVar.data);
      return newVar.data;
    },
    queryKey: ["driver_location", orderId],
    refetchInterval: 5500,
    staleTime: 0,
  });
}
