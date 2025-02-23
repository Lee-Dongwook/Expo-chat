import React from "react";
import { View, Text } from "react-native";

type RoomItemProps = {
  room: {
    id: string;
    name: string;
    type: string;
  };
};

export default function RoomItem({ room }: RoomItemProps) {
  return (
    <View className="p-4 border-b border-gray-200">
      <Text className="text-lg font-semibold">{room.name}</Text>
      <Text className="text-sm text-gray-500">
        {room.type === "private" ? "1:1 채팅" : "그룹 채팅"}
      </Text>
    </View>
  );
}
