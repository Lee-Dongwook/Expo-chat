import { v4 as uuidv4 } from "uuid";
import { ChatRoom } from "../models/chat";

const chatRooms: { [id: string]: ChatRoom } = {};

const defaultRoomId = uuidv4();
chatRooms[defaultRoomId] = {
  id: defaultRoomId,
  name: "General",
  type: "group",
  messages: [],
};

export const getRooms = (req: any, res: any) => {
  res.json(Object.values(chatRooms));
};

export const createRoom = (req: any, res: any) => {
  const { name, type } = req.body;
  if (!name) {
    return res.status(400).json({ error: "채팅방 이름은 필수입니다." });
  }
  const roomId = uuidv4();
  const newRoom: ChatRoom = {
    id: roomId,
    name,
    type: type === "private" ? "private" : "group",
    messages: [],
  };
  chatRooms[roomId] = newRoom;
  res.status(201).json(newRoom);
};

export const getRoomMessages = (req: any, res: any) => {
  const { roomId } = req.params;
  const room = chatRooms[roomId];
  if (!room) {
    return res.status(404).json({ error: "채팅방을 찾을 수 없습니다." });
  }
  res.json(room.messages);
};

export const searchMessages = (req: any, res: any) => {
  const { roomId } = req.params;
  const { keyword } = req.query;

  if (!keyword || typeof keyword !== "string") {
    return res.status(400).json({ error: "검색 키워드가 필요합니다." });
  }

  const room = chatRooms[roomId];
  if (!room) {
    return res.status(404).json({ error: "채팅방을 찾을 수 없습니다." });
  }
  const results = room.messages.filter((msg) => msg.text.includes(keyword));
  res.json(results);
};

export default chatRooms;
