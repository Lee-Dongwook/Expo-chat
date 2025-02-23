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
    });

    socket.on("leave room", (data: { roomId: string; user: string }) => {
      const { roomId, user } = data;
      socket.leave(roomId);
      console.log(`사용자 ${user}가 채팅방 ${roomId}에서 퇴장함`);
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
      }
    );

    socket.on("disconnect", () => {
      console.log(`클라이언트 연결 종료됨: ${socket.id}`);
    });
  });
};
