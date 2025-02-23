import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RoomListScreen from "./screens/RoomListScreen";
import ChatScreen from "./screens/ChatScreen";

export type RootStackParamList = {
  Login: undefined;
  RoomList: { token: string; username: string };
  Chat: { token: string; username: string; roomId: string; roomName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "로그인" }}
        />
        <Stack.Screen
          name="RoomList"
          component={RoomListScreen}
          options={{ title: "채팅방 목록" }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ title: "채팅" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
