// src/socket/socketHandler.ts
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "../models/chat";
import chatRooms from "../controllers/roomController";

const SECRET_KEY = "your_secret_key_here";

export const initializeSocket = (io: Server) => {
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
        if (err) return next(new Error("Authentication error"));
        socket.data.user = decoded;
        next();
      });
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log(`클라이언트 연결됨: ${socket.id}`);

    socket.on("join room", (data: { roomId: string; user: string }) => {
      const { roomId, user } = data;
      if (!chatRooms[roomId]) {
        console.log(`채팅방을 찾을 수 없음: ${roomId}`);
        return;
      }
      socket.join(roomId);
      console.log(`사용자 ${user}가 채팅방 ${roomId}에 입장함`);
      socket.emit("room messages", chatRooms[roomId].messages);
      socket
        .to(roomId)
        .emit("notification", { message: `${user}님이 입장했습니다.` });
    });

    socket.on("leave room", (data: { roomId: string; user: string }) => {
      const { roomId, user } = data;
      socket.leave(roomId);
      console.log(`사용자 ${user}가 채팅방 ${roomId}에서 퇴장함`);
      socket
        .to(roomId)
        .emit("notification", { message: `${user}님이 퇴장했습니다.` });
    });

    socket.on(
      "chat message",
      (data: { roomId: string; user: string; text: string }) => {
        const { roomId, user, text } = data;
        if (!chatRooms[roomId]) {
          console.log(`채팅방을 찾을 수 없음: ${roomId}`);
          return;
        }
        const newMessage: ChatMessage = {
          id: uuidv4(),
          user,
          text,
          timestamp: new Date(),
        };
        chatRooms[roomId].messages.push(newMessage);
        io.to(roomId).emit("chat message", newMessage);
        console.log(`채팅방 ${roomId}에서 ${user}의 메시지: ${text}`);

        if (text.toLowerCase().includes("hello") || text.includes("안녕")) {
          setTimeout(() => {
            const botMessage: ChatMessage = {
              id: uuidv4(),
              user: "ChatBot",
              text: `안녕하세요, ${user}님! 무엇을 도와드릴까요?`,
              timestamp: new Date(),
              reactions: {},
              readBy: [],
            };
            chatRooms[roomId].messages.push(botMessage);
            io.to(roomId).emit("chat message", botMessage);
            console.log(`ChatBot 응답: ${botMessage.text}`);
          }, 2000);
        }
      }
    );

    socket.on(
      "edit message",
      (data: {
        roomId: string;
        messageId: string;
        user: string;
        newText: string;
      }) => {
        const { roomId, messageId, user, newText } = data;

        if (!chatRooms[roomId]) {
          console.log(`채팅방을 찾을 수 없음: ${roomId}`);
          return;
        }

        const room = chatRooms[roomId];
        const msgIndex = room.messages.findIndex((m) => m.id === messageId);
        if (msgIndex === -1) {
          console.log(`메시지를 찾을 수 없음: ${messageId}`);
          return;
        }

        if (room.messages[msgIndex].user !== user) {
          console.log(
            `사용자 ${user}가 메시지 ${messageId}를 수정할 권한이 없음`
          );
          return;
        }

        room.messages[msgIndex].text = newText;
        room.messages[msgIndex].timestamp = new Date();
        io.to(roomId).emit("edit message", room.messages[msgIndex]);
        console.log(`채팅방 ${roomId}에서 ${user}의 메시지 수정: ${newText}`);
      }
    );

    socket.on(
      "delete message",
      (data: { roomId: string; messageId: string; user: string }) => {
        const { roomId, messageId, user } = data;
        if (!chatRooms[roomId]) {
          console.log(`채팅방을 찾을 수 없음: ${roomId}`);
          return;
        }
        const room = chatRooms[roomId];
        const msgIndex = room.messages.findIndex((m) => m.id === messageId);
        if (msgIndex === -1) {
          console.log(`메시지를 찾을 수 없음: ${messageId}`);
          return;
        }
        if (room.messages[msgIndex].user !== user) {
          console.log(
            `사용자 ${user}가 메시지 ${messageId}를 삭제할 권한이 없음`
          );
          return;
        }
        room.messages.splice(msgIndex, 1);
        io.to(roomId).emit("delete message", { messageId });
        console.log(`채팅방 ${roomId}에서 ${user}의 메시지 삭제: ${messageId}`);
      }
    );

    socket.on(
      "react message",
      (data: {
        roomId: string;
        messageId: string;
        user: string;
        emoji: string;
      }) => {
        const { roomId, messageId, user, emoji } = data;
        if (!chatRooms[roomId]) {
          console.log(`채팅방을 찾을 수 없음: ${roomId}`);
          return;
        }
        const room = chatRooms[roomId];
        const message = room.messages.find((m) => m.id === messageId);
        if (!message) {
          console.log(`메시지 미존재: ${messageId}`);
          return;
        }
        if (!message.reactions) message.reactions = {};
        if (!message.reactions[emoji]) {
          message.reactions[emoji] = [];
        }
        if (message.reactions[emoji].includes(user)) {
          message.reactions[emoji] = message.reactions[emoji].filter(
            (u) => u !== user
          );
        } else {
          message.reactions[emoji].push(user);
        }
        io.to(roomId).emit("react message", {
          messageId,
          reactions: message.reactions,
        });
        console.log(`사용자 ${user}가 메시지 ${messageId}에 ${emoji} 반응`);
      }
    );

    socket.on(
      "read message",
      (data: { roomId: string; messageId: string; user: string }) => {
        const { roomId, messageId, user } = data;
        if (!chatRooms[roomId]) {
          console.log(`채팅방 미존재: ${roomId}`);
          return;
        }
        const room = chatRooms[roomId];
        const message = room.messages.find((m) => m.id === messageId);
        if (!message) {
          console.log(`메시지 미존재: ${messageId}`);
          return;
        }
        if (!message.readBy) message.readBy = [];
        if (!message.readBy.includes(user)) {
          message.readBy.push(user);
        }
        io.to(roomId).emit("read message", {
          messageId,
          readBy: message.readBy,
        });
        console.log(`메시지 ${messageId}를 ${user}가 읽음`);
      }
    );

    socket.on(
      "typing",
      (data: { roomId: string; user: string; isTyping: boolean }) => {
        const { roomId, user, isTyping } = data;
        socket.to(roomId).emit("typing", { user, isTyping });
      }
    );

    socket.on("update online", (data: { user: string; status: string }) => {
      io.emit("online status", data);
    });

    socket.on("disconnect", () => {
      console.log(`클라이언트 연결 종료됨: ${socket.id}`);
    });
  });
};
