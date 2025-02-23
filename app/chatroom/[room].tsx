import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "@/src/context/AuthContext";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/App";

type ChatRoomRouteProp = RouteProp<RootStackParamList, "ChatRoom">;

export default function ChatRoomScreen() {
  const { token } = useContext(AuthContext);
  const route = useRoute<ChatRoomRouteProp>();
  const { roomId } = route.params;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    // 토큰을 이용한 소켓 인증
    const newSocket = io("http://localhost:4000", {
      auth: { token },
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("소켓 연결 성공");
      newSocket.emit("join room", { roomId, user: "본인아이디" });
    });

    newSocket.on("chat message", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on("room messages", (msgs: any[]) => {
      setMessages(msgs);
    });

    newSocket.on("notification", (data: any) => {
      Alert.alert("알림", data.message);
    });

    return () => {
      newSocket.emit("leave room", { roomId, user: "본인아이디" });
      newSocket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (inputMessage && socket) {
      socket.emit("chat message", {
        roomId,
        user: "본인아이디",
        text: inputMessage,
      });
      setInputMessage("");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="p-2 border-b border-gray-200">
      <Text className="font-bold">{item.user}</Text>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        className="flex-1 p-4"
      />
      <View className="flex-row p-4 border-t border-gray-300">
        <TextInput
          className="flex-1 border border-gray-300 rounded p-2"
          placeholder="메시지 입력..."
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity
          className="ml-2 bg-blue-500 rounded p-3"
          onPress={sendMessage}
        >
          <Text className="text-white">전송</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
