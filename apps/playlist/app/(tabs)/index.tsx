import Button from "@/components/Buttons";
import ImageViewer from "@/components/ImageViewer";
import { useState } from "react";
import {
  FlatList,
  type ImageSourcePropType,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ARTISTS = ["Jennie", "Lisa", "Rosé", "Jisoo", "IU"];

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState("Jennie");

  const images: Record<string, ImageSourcePropType> = {
    Jennie: require("../../assets/images/jennie.png"),
    Lisa: require("../../assets/images/lisa.png"),
    Rosé: require("../../assets/images/rose.png"),
    Jisoo: require("../../assets/images/jisoo.png"),
    IU: require("../../assets/images/iu.png"),
  };

  const selectArtist = (artist: string) => {
    setSelectedArtist(artist);
    setModalVisible(false);
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

      <View className="flex-[0.33] items-center">
        <Button label="Choose a mix" theme="primary" />
        <Button
          label="Choose an artist"
          onPress={() => setModalVisible(true)}
        />
      </View>

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
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
