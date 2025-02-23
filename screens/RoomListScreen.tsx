import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import RoomItem from "../components/RoomItem";

type Props = NativeStackScreenProps<RootStackParamList, "RoomList">;

export default function RoomListScreen({ route, navigation }: Props) {
  const { token, username } = route.params;
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:4000/rooms", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        Alert.alert("오류", "채팅방을 가져오는 데 실패했습니다.");
        setLoading(false);
      });
  }, [token]);

  const handleRoomSelect = (room: any) => {
    navigation.navigate("Chat", {
      token,
      username,
      roomId: room.id,
      roomName: room.name,
    });
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleRoomSelect(item)}>
            <RoomItem room={item} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
