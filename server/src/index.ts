// src/index.ts
import express, { Application, Request, Response } from "express";
import http from "http";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import authRoutes from "./routes/authRoutes";
import roomRoutes from "./routes/roomRoutes";
import userActionsRoutes from "./routes/userActionsRoute";
import fileUploadRoutes from "./routes/fileUploadRoutes";
import { initializeSocket } from "./socket/socketHandler";
import { authenticateJWT } from "./middleware/authMiddleware";
import chatRooms from "./controllers/roomController";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("채팅 서버가 실행 중입니다.");
});

app.use("/auth", authRoutes);
app.use("/rooms", authenticateJWT, roomRoutes);
app.use("/user", authenticateJWT, userActionsRoutes);
app.use("/files", fileUploadRoutes);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*" },
});

initializeSocket(io);

setInterval(() => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  Object.values(chatRooms).forEach((room) => {
    room.messages = room.messages.filter((msg) => msg.timestamp > sevenDaysAgo);
  });
  console.log("오래된 메시지를 정리했습니다.");
}, 60 * 60 * 1000);

const PORT: number = 4000;
server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
