import { Slot } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";
import { View, Text } from "react-native";

export default function RootLayout() {
  console.log("📌 _layout.tsx 렌더링됨");

  return (
    <AuthProvider>
      <View className="flex-1 justify-center items-center">
        <Text>레이아웃 로드됨</Text>
      </View>
      <Slot />
    </AuthProvider>
  );
}
