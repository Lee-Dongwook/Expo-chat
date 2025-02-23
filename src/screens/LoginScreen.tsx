import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { setToken } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });
      setToken(response.data.token);
      navigation.navigate("ChatRooms");
    } catch (error) {
      Alert.alert("로그인 실패", "아이디와 비밀번호를 확인하세요.");
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl mb-4">로그인</Text>
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
        className="bg-blue-500 p-3 rounded w-full mb-2"
        onPress={handleLogin}
      >
        <Text className="text-white text-center">로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text className="text-blue-500">회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}
