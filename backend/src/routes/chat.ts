import express from "express";
import { getChatHistory, deleteMessage } from "../controllers/chatController"; // Correct import
import { authenticateToken } from "../middlewares/authenticateToken";

const router = express.Router();

router.get("/:groupId", authenticateToken, getChatHistory);

router.delete("/:messageId", authenticateToken, deleteMessage);

export default router;
