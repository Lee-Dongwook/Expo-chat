import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        Alert.alert("로그인 실패", "아이디 또는 비밀번호가 올바르지 않습니다.");
        return;
      }
      const data = await response.json();
      navigation.navigate("RoomList", { token: data.token, username });
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">로그인</Text>
      <TextInput
        placeholder="아이디"
        value={username}
        onChangeText={setUsername}
        className="w-full border border-gray-300 p-3 mb-3 rounded"
      />
      <TextInput
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="w-full border border-gray-300 p-3 mb-5 rounded"
      />
      <Button title="로그인" onPress={handleLogin} />
    </View>
  );
}
