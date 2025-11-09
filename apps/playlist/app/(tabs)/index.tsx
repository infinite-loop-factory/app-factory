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
import { usePlayer } from "@/contexts/PlayerContext";

const ARTISTS = ["Jennie", "Lisa", "Rosé", "Jisoo", "IU"];

export default function Index() {
  const { isPlaying, playTrack, togglePlayPause, currentTrack, artist } =
    usePlayer();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState("Jennie");
  const [showArtistOptions, setShowArtistOptions] = useState(false);
  const [queueModalVisible, setQueueModalVisible] = useState(false);

  const images: Record<string, ImageSourcePropType> = {
    Jennie: require("../../assets/images/jennie.png"),
    Lisa: require("../../assets/images/lisa.png"),
    Rosé: require("../../assets/images/rose.png"),
    Jisoo: require("../../assets/images/jisoo.png"),
    IU: require("../../assets/images/iu.png"),
  };

  const artistTracks: Record<string, { title: string; file: number }[]> = {
    Jennie: [
      { title: "SOLO", file: require("../../assets/sounds/jennie.mp3") },
      { title: "You & Me", file: require("../../assets/sounds/jennie.mp3") },
    ],
    Lisa: [
      { title: "LALISA", file: require("../../assets/sounds/jennie.mp3") },
      { title: "MONEY", file: require("../../assets/sounds/jennie.mp3") },
    ],
    Rosé: [
      {
        title: "On The Ground",
        file: require("../../assets/sounds/jennie.mp3"),
      },
      { title: "GONE", file: require("../../assets/sounds/jennie.mp3") },
    ],
    Jisoo: [
      { title: "FLOWER", file: require("../../assets/sounds/jennie.mp3") },
    ],
    IU: [
      { title: "Blueming", file: require("../../assets/sounds/jennie.mp3") },
      { title: "Celebrity", file: require("../../assets/sounds/jennie.mp3") },
    ],
  };

  const selectArtist = (artist: string) => {
    setSelectedArtist(artist);
    setModalVisible(false);
    setShowArtistOptions(true);
  };

  const onReset = () => {
    setShowArtistOptions(false);
  };

  const onShowQueue = () => {
    setQueueModalVisible(true);
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
              iconName={isPlaying ? "pause" : "play-arrow"}
              onPress={() => {
                const tracks = artistTracks[selectedArtist];
                if (!tracks || tracks.length === 0) return;

                if (artist === selectedArtist && currentTrack) {
                  togglePlayPause();
                } else {
                  const firstTrack = tracks[0];

                  if (firstTrack) {
                    playTrack(
                      selectedArtist,
                      firstTrack.title,
                      firstTrack.file,
                      images[selectedArtist],
                    );
                  }
                }
              }}
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
      <Modal
        onRequestClose={() => setQueueModalVisible(false)}
        transparent={true}
        visible={queueModalVisible}
      >
        <View className="flex-1 items-center justify-center bg-black bg-opacity-80">
          <View className="max-h-[70%] w-11/12 rounded-lg bg-[#1a1a1a] p-5">
            <Text className="mb-4 font-bold text-lg text-white">
              {selectedArtist}'s Songs
            </Text>
            <FlatList
              data={artistTracks[selectedArtist]}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="mb-2 rounded bg-gray-800 p-3"
                  onPress={() => {
                    playTrack(
                      selectedArtist,
                      item.title,
                      item.file,
                      images[selectedArtist],
                    );
                    setQueueModalVisible(false);
                  }}
                >
                  <Text className="text-white">{item.title}</Text>
                </TouchableOpacity>
              )}
            />
            <Button label="Close" onPress={() => setQueueModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
