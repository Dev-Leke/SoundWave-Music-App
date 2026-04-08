import { Text, View } from "react-native";
import { Colors } from "../../constants/theme";
export default function LibraryScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white" }}>Library coming soon</Text>
    </View>
  );
}
