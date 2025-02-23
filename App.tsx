import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./src/context/AuthContext";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ChatRoomListScreen from "./src/screens/ChatRoomListScreen";
import ChatRoomScreen from "./src/screens/ChatRoomScreen";
import FileUploadScreen from "./src/screens/FileUploadScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ChatRooms: undefined;
  ChatRoom: { roomId: string; roomName: string };
  FileUpload: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "로그인" }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "회원가입" }}
          />
          <Stack.Screen
            name="ChatRooms"
            component={ChatRoomListScreen}
            options={{ title: "채팅방 리스트" }}
          />
          <Stack.Screen
            name="ChatRoom"
            component={ChatRoomScreen}
            options={({ route }) => ({ title: route.params.roomName })}
          />
          <Stack.Screen
            name="FileUpload"
            component={FileUploadScreen}
            options={{ title: "파일 업로드" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
