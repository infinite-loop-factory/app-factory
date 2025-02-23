import { supabase } from "@/supabase/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export function useDriverLocationsInterval({ orderId }: { orderId: number }) {
  return useQuery({
    queryFn: async () => {
      const newVar = await supabase
        .from("driver_location")
        .select("lon, lat, order(id)")
        .eq("order.id", orderId)
        .single();

      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.log(newVar.data);
      return newVar.data;
    },
    queryKey: ["driver_location", orderId],
    refetchInterval: 5500,
    gcTime: 0,
    staleTime: 0,
  });
}
