import { Router } from "express";
import {
  getRooms,
  createRoom,
  getRoomMessages,
  searchMessages,
} from "../controllers/roomController";

const router = Router();

router.get("/", getRooms);
router.post("/", createRoom);
router.get("/:roomId/messages", getRoomMessages);
router.get("/:roomId/search", searchMessages);

export default router;
