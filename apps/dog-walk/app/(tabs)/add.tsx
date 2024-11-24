import { StyleSheet, Text, View } from "react-native";

export default function AddScreen() {
  return (
    <View style={styles.wrapper}>
      <Text>산책 코스 추가 화면</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
