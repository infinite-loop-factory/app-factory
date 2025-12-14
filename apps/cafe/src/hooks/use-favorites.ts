import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const FAVORITES_KEY = "@cafe_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (storedFavorites !== null) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);
  const _saveFavorites = async (newFavorites: string[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  };

  const isFavorite = (cafeId: string): boolean => {
    return favorites.includes(cafeId);
  };

  const toggleFavorite = async (cafeId: string) => {
    const newFavorites = isFavorite(cafeId)
      ? favorites.filter((id) => id !== cafeId)
      : [...favorites, cafeId];

    // Update state immediately for instant UI feedback
    setFavorites(newFavorites);

    // Then persist to storage
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error("❌ Failed to save favorites:", error);
    }
  };

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
  };
};
