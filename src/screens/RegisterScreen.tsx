import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Register">;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { setToken } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axiosInstance.post("/auth/register", {
        username,
        password,
      });
      setToken(response.data.token);
      navigation.navigate("ChatRooms");
    } catch (error) {
      Alert.alert("회원가입 실패", "이미 존재하는 사용자일 수 있습니다.");
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl mb-4">회원가입</Text>
      <TextInput
        className="w-full border border-gray-300 rounded p-2 mb-4"
        placeholder="아이디"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="w-full border border-gray-300 rounded p-2 mb-4"
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        className="bg-blue-500 p-3 rounded w-full"
        onPress={handleRegister}
      >
        <Text className="text-white text-center">회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}
