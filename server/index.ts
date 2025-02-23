import express, { Application, Request, Response } from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
}

interface ChatRoom {
  id: string;
  name: string;
  messages: ChatMessage[];
}

const app: Application = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const chatRooms: { [id: string]: ChatRoom } = {};

const defaultRoomId = uuidv4();
chatRooms[defaultRoomId] = {
  id: defaultRoomId,
  name: "General",
  messages: [],
};

app.get("/", (req: Request, res: Response) => {
  res.send("채팅 서버가 실행 중입니다.");
});

app.get("/rooms", (req: Request, res: Response) => {
  const roomsArray = Object.values(chatRooms);
  res.json(roomsArray);
});

app.post("/rooms", (req: any, res: any) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "채팅방 이름은 필수입니다." });
  }
  const roomId = uuidv4();
  const newRoom: ChatRoom = {
    id: roomId,
    name,
    messages: [],
  };
  chatRooms[roomId] = newRoom;
  res.status(201).json(newRoom);
});

app.get("/rooms/:roomId/messages", (req: any, res: any) => {
  const { roomId } = req.params;
  const room = chatRooms[roomId];
  if (!room) {
    return res.status(404).json({ error: "채팅방을 찾을 수 없습니다." });
  }
  res.json(room.messages);
});

io.on("connection", (socket: Socket) => {
  console.log(`클라이언트 연결됨: ${socket.id}`);

  socket.on("join room", (data: { roomId: string; user: string }) => {
    const { roomId, user } = data;

    if (!chatRooms[roomId]) {
      console.log(`채팅방을 찾을 수 없음: ${roomId}`);
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

const PORT = 4000;

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
