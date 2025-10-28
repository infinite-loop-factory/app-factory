import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Images from "@/assets/images";
import { CloseIcon, Icon } from "../ui/icon";

interface IImageViewModalProps {
  initialPage: number;
  data: string[];
  visible: boolean;
  onClose: () => void;
}

export default function ImageModal({
  data,
  visible,
  onClose,
  initialPage,
}: IImageViewModalProps) {
  const { width } = Dimensions.get("window");

  const { bottom } = useSafeAreaInsets();

  const [currentPage, setCurrentPage] = useState(initialPage ?? 0);

  const flatListRef = useRef<FlatList>(null);

  const IndicatorStyle = tva({
    variants: {
      variant: {
        default: "w-2 h-2 rounded-full bg-background-0 opacity-50",
        active: "w-2 h-2 rounded-full bg-background-0 ",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  const handlePageChange = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    const pageIndex = Math.round(offsetX / width);
    setCurrentPage(pageIndex);
  };

  useEffect(() => {
    if (visible && flatListRef.current) {
      setCurrentPage(initialPage);

      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: initialPage,
          animated: false,
        });
      }, 100);
    }
  }, [visible, initialPage]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent={true}
      visible={visible}
    >
      <View
        className="flex-1 bg-background-950"
        style={{ marginBottom: Platform.OS === "android" ? bottom : 0 }}
      >
        <View className="absolute top-11 z-10 h-16 w-full items-end px-4 py-5">
          <TouchableOpacity onPress={onClose}>
            <Icon as={CloseIcon} className="h-8 w-8 text-background-0" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={data}
          getItemLayout={(_data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          horizontal
          initialScrollIndex={currentPage}
          keyExtractor={(item, index) => `${item.uri}_${index}`}
          onMomentumScrollEnd={handlePageChange}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            }, 500);
          }}
          pagingEnabled
          ref={flatListRef}
          renderItem={({ item, index }) => (
            <View
              className="flex-1 justify-center"
              key={`modal_image_${index}`}
            >
              <Image
                key={`image_swiper_${item}`}
                resizeMode="cover"
                source={item ? { uri: item } : Images.defaultProfileImage}
                style={{ width: width, height: width }}
              />
            </View>
          )}
          scrollEnabled={data.length > 1}
          showsHorizontalScrollIndicator={false}
        />

        {/* NOTE: Indicatpr */}
        <View className="absolute bottom-12 w-full flex-row justify-center gap-2">
          {data.map((imageData, index) => (
            <View
              className={IndicatorStyle({
                variant: currentPage === index ? "active" : "default",
              })}
              key={`modal_indicator_${imageData}`}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
}
