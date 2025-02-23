import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Text,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import io, { Socket } from "socket.io-client";
import MessageItem from "../components/MessageItem";

type ChatMessage = {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  // 추가 기능에 따른 reactions, readBy, attachments 등 확장 가능
};

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

let socket: Socket;

export default function ChatScreen({ route }: Props) {
  const { token, username, roomId, roomName } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    socket = io("http://localhost:4000", {
      auth: { token },
    });

    socket.emit("join room", { roomId, user: username });

    socket.on("chat message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("room messages", (msgs: ChatMessage[]) => {
      setMessages(msgs);
    });

    socket.on("notification", (data: { message: string }) => {
      Alert.alert("알림", data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, username, roomId]);

  const handleSend = () => {
    if (!message.trim()) return;
    socket.emit("chat message", { roomId, user: username, text: message });
    setMessage("");
  };

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <MessageItem message={item} />
  );

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">{roomName}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        className="mb-4"
      />
      <View className="flex-row items-center">
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="메시지 입력"
          className="flex-1 border border-gray-300 p-3 mr-2 rounded"
        />
        <TouchableOpacity
          onPress={handleSend}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          <Text className="text-white">전송</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
