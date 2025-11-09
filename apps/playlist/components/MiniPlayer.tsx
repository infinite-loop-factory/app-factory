import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useMemo, useRef } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePlayer } from "@/contexts/PlayerContext";

export default function MiniPlayer() {
  const {
    currentTrack,
    artist,
    image,
    isPlaying,
    togglePlayPause,
    recentlyPlayed,
    playTrack,
  } = usePlayer();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  // 바텀시트의 스냅 포인트 설정: 미니 플레이어(90px), 전체 화면(90%)
  const snapPoints = useMemo(() => [90, "90%"], []);

  // 트랙이 없으면 렌더링하지 않음
  if (!(currentTrack && artist)) {
    return null;
  }

  return (
    <BottomSheet
      backgroundStyle={{ backgroundColor: "#1a1a1a" }}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: "#666" }}
      index={0}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
    >
      <BottomSheetView style={{ flex: 1, paddingHorizontal: 16 }}>
        {/* === 미니 플레이어 뷰 === */}
        <View className="flex-row items-center justify-between pb-4">
          <TouchableOpacity
            activeOpacity={0.9}
            className="flex-1 flex-row items-center"
            onPress={() => bottomSheetRef.current?.expand()}
          >
            <Image
              className="h-12 w-12 rounded-md"
              source={image ?? require("../assets/images/jennie.png")}
            />
            <View className="ml-3 flex-1">
              <Text className="font-semibold text-white" numberOfLines={1}>
                {currentTrack}
              </Text>
              <Text className="text-gray-400 text-sm" numberOfLines={1}>
                {artist}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="ml-3" onPress={togglePlayPause}>
            <Ionicons
              color="white"
              name={isPlaying ? "pause" : "play"}
              size={28}
            />
          </TouchableOpacity>
        </View>

        {/* === 전체 플레이어 뷰 === */}
        <View className="flex-1">
          {/* 앨범 아트 & 트랙 정보 */}
          <View className="mb-6 items-center">
            <Image
              className="mb-6 h-64 w-64 rounded-2xl"
              source={image ?? require("../assets/images/jennie.png")}
            />
            <Text className="text-center font-bold text-2xl text-white">
              {currentTrack}
            </Text>
            <Text className="text-base text-gray-400">{artist}</Text>
          </View>

          {/* 재생 컨트롤 */}
          <View className="mb-8 items-center">
            <TouchableOpacity
              className="h-16 w-16 items-center justify-center rounded-full bg-white"
              onPress={togglePlayPause}
            >
              <Ionicons
                color="black"
                name={isPlaying ? "pause" : "play"}
                size={32}
              />
            </TouchableOpacity>
          </View>

          {/* 최근 재생 목록 */}
          <View className="flex-1">
            <Text className="mb-3 font-semibold text-lg text-white">
              Recently Played
            </Text>
            <FlatList
              contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
              data={recentlyPlayed}
              keyExtractor={(item) => `${item.artist}-${item.track}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="mb-2 rounded-lg bg-gray-800 p-3"
                  onPress={() => {
                    playTrack(item.artist, item.track, item.file);
                    bottomSheetRef.current?.snapToIndex(0);
                  }}
                >
                  <Text className="font-medium text-white">{item.track}</Text>
                  <Text className="text-gray-400 text-sm">{item.artist}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
