import { Router } from "express";
import { blockUser, reportMessage } from "../controllers/userActionsController";

const router = Router();

router.post("/block", blockUser);
router.post("/report", reportMessage);

export default router;
