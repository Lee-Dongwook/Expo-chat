// src/index.ts
import express, { Application, Request, Response } from "express";
import http from "http";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import authRoutes from "./routes/authRoutes";
import roomRoutes from "./routes/roomRoutes";
import { initializeSocket } from "./socket/socketHandler";

const app: Application = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("채팅 서버가 실행 중입니다.");
});

app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*" },
});

initializeSocket(io);

const PORT: number = 3000;
server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
