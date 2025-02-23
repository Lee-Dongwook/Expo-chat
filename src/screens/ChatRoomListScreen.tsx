import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ChatRooms"
>;

export default function ChatRoomListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { token } = useContext(AuthContext);
  const [rooms, setRooms] = useState<any[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [roomType, setRoomType] = useState<"group" | "private">("group");

  const fetchRooms = async () => {
    try {
      const response = await axiosInstance.get("/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(response.data);
    } catch (error) {
      Alert.alert("채팅방 로드 실패", "채팅방 정보를 불러오지 못했습니다.");
    }
  };

  const createRoom = async () => {
    if (!newRoomName) return;
    try {
      const response = await axiosInstance.post(
        "/rooms",
        { name: newRoomName, type: roomType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewRoomName("");
      fetchRooms();
    } catch (error) {
      Alert.alert("채팅방 생성 실패", "새 채팅방을 만들지 못했습니다.");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="p-4 border-b border-gray-200"
      onPress={() =>
        navigation.navigate("ChatRoom", {
          roomId: item.id,
          roomName: item.name,
        })
      }
    >
      <Text className="text-lg">{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-4">
      <FlatList
        data={rooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <View className="mt-4">
        <TextInput
          className="border border-gray-300 rounded p-2 mb-2"
          placeholder="새 채팅방 이름"
          value={newRoomName}
          onChangeText={setNewRoomName}
        />
        <TouchableOpacity
          className="bg-green-500 p-3 rounded"
          onPress={createRoom}
        >
          <Text className="text-white text-center">채팅방 생성</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
