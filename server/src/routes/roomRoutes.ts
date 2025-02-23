import { Router } from "express";
import {
  getRooms,
  createRoom,
  getRoomMessages,
} from "../controllers/roomController";

const router = Router();

router.get("/", getRooms);
router.post("/", createRoom);
router.get("/:roomId/messages", getRoomMessages);

export default router;
