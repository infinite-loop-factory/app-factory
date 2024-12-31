import { Text, TouchableOpacity, View } from "react-native";

export default function ShoppingImage() {
  return (
    <TouchableOpacity>
      <View className={" h-[170px] w-[170px] rounded-xl bg-primary-50 p-2"}>
        <View>
          <Text className={"label-7"}>[[두 끼도 쌉가능]] 1인세트</Text>
          <Text className={"label-7"}>15,900원</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
