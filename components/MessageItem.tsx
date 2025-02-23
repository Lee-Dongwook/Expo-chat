import React from "react";
import { View, Text } from "react-native";

type MessageItemProps = {
  message: {
    id: string;
    user: string;
    text: string;
    timestamp: string;
  };
};

export default function MessageItem({ message }: MessageItemProps) {
  return (
    <View className="p-3 border-b border-gray-200">
      <Text className="font-bold">{message.user}</Text>
      <Text>{message.text}</Text>
      <Text className="text-xs text-gray-500">
        {new Date(message.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );
}
