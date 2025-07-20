import { Audio, type AVPlaybackSource } from "expo-av";
import { useState } from "react";
import {
  FlatList,
  type ImageSourcePropType,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "@/components/Buttons";
import CircleButton from "@/components/CircleButton";
import IconButton from "@/components/IconButton";
import ImageViewer from "@/components/ImageViewer";

const ARTISTS = ["Jennie", "Lisa", "Rosé", "Jisoo", "IU"];

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState("Jennie");
  const [showArtistOptions, setShowArtistOptions] = useState(false);
  const [currentArtist, setCurrentArtist] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const images: Record<string, ImageSourcePropType> = {
    Jennie: require("../../assets/images/jennie.png"),
    Lisa: require("../../assets/images/lisa.png"),
    Rosé: require("../../assets/images/rose.png"),
    Jisoo: require("../../assets/images/jisoo.png"),
    IU: require("../../assets/images/iu.png"),
  };

  const audioFiles: Record<string, number> = {
    Jennie: require("../../assets/sounds/jennie.mp3"),
    Lisa: require("../../assets/sounds/jennie.mp3"),
    Rosé: require("../../assets/sounds/jennie.mp3"),
    Jisoo: require("../../assets/sounds/jennie.mp3"),
    IU: require("../../assets/sounds/jennie.mp3"),
  };

  const selectArtist = (artist: string) => {
    setSelectedArtist(artist);
    setModalVisible(false);
    setShowArtistOptions(true);
  };

  const onReset = () => {
    setShowArtistOptions(false);
  };

  const onPlay = async () => {
    try {
      if (sound && currentArtist !== selectedArtist) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }

      if (isPlaying && currentArtist === selectedArtist) {
        await sound?.pauseAsync();
        setIsPlaying(false);
      } else {
        if (!sound || currentArtist !== selectedArtist) {
          const { sound: newSound } = await Audio.Sound.createAsync(
            audioFiles[selectedArtist] as AVPlaybackSource,
          );
          setSound(newSound);
          setCurrentArtist(selectedArtist);
          await newSound.playAsync();
        } else {
          await sound.playAsync();
        }
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio playback error:", error);
    }
  };

  const onShowQueue = async () => {
    // i will implement this later
  };

  return (
    <View className="flex-1 items-center bg-[#0D0D0D]">
      <View className="flex-1 justify-center">
        <View>
          <ImageViewer
            imgSource={images[selectedArtist] as ImageSourcePropType}
          />
          <Text className="absolute bottom-4 left-4 px-2 py-1 font-bold text-4xl text-white">
            {selectedArtist.toUpperCase()}
          </Text>
        </View>
      </View>
      <View className="flex-[0.33]">
        {showArtistOptions ? (
          <View className="flex-row">
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton
              iconName={
                isPlaying && currentArtist === selectedArtist
                  ? "pause"
                  : "play-arrow"
              }
              onPress={onPlay}
            />

            <IconButton
              icon="playlist-play"
              label="Queue"
              onPress={onShowQueue}
            />
          </View>
        ) : (
          <>
            <Button label="Choose a mix" theme="primary" />
            <Button
              label="Choose an artist"
              onPress={() => setModalVisible(true)}
            />
          </>
        )}
      </View>

      <Modal
        onRequestClose={() => setModalVisible(false)}
        visible={modalVisible}
      >
        <View className="flex-1 items-center justify-center bg-black">
          <View className="w-3/4 rounded-lg p-4">
            <Text className="mb-2 font-bold text-lg text-white">
              What do you want to listen to?
            </Text>
            <FlatList
              data={ARTISTS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="p-2"
                  onPress={() => selectArtist(item)}
                >
                  <Text className="text-white">{item.toUpperCase()}</Text>
                </TouchableOpacity>
              )}
            />
            <Button label="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
