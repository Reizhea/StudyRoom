import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { MONGO_URI, PORT } from "./config";
import authRoutes from "./routes/auth";
import groupRoutes from "./routes/group";
import chatRoutes from "./routes/chat";
import { saveMessage } from "./controllers/chatController";
import Chat from "./models/Chat";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

dotenv.config({ path: "./.env" });

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { dbName: "studyroom" })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/chat", chatRoutes);

// WebSocket Configuration
io.on("connection", (socket) => {
  console.log(`⚡ New WebSocket Connection: ${socket.id}`);

  // Authenticate WebSocket Connection
  socket.on("authenticate", ({ accessToken }) => {
    try {
      if (!accessToken) {
        console.error("❌ Missing access token");
        socket.disconnect();
        return;
      }

      // Verify Token & Extract User ID
      const decoded = jwt.verify(accessToken, JWT_SECRET) as { id: string };
      (socket as any).userId = decoded.id; // Store userId in socket object

      console.log(`✅ User ${decoded.id} authenticated with socket ${socket.id}`);
    } catch (error) {
      console.error("❌ Invalid access token:", error);
      socket.disconnect(); // Disconnect if invalid token
    }
  });

  // User joins a chat room
  socket.on("joinRoom", async ({ groupId }) => {
    const userId = (socket as any).userId;
    if (!userId) {
      console.error("❌ User not authenticated");
      return;
    }

    socket.join(groupId);
    console.log(`✅ User ${userId} joined room: ${groupId}`);

    try {
      const messages = await Chat.find({ groupId }).sort({ timestamp: 1 });
      socket.emit("chatHistory", messages);
    } catch (error) {
      console.error("❌ Error fetching chat history:", error);
    }
  });

  // Handle incoming messages
  socket.on("message", async ({ groupId, content }) => {
    const userId = (socket as any).userId;
    if (!userId || !groupId || !content) {
      console.error("❌ Invalid message format");
      return;
    }

    console.log(`📩 Message in ${groupId} from ${userId}: "${content}"`);

    await saveMessage(groupId, userId, content);
    io.to(groupId).emit("message", { sender: userId, content, timestamp: new Date().toISOString() });
  });

  // Handle message deletion
  socket.on("deleteMessage", async (messageId) => {
    const userId = (socket as any).userId;

    try {
      const message = await Chat.findById(messageId);
      if (!message) {
        console.log("❌ Message not found");
        return;
      }

      if (message.sender.toString() !== userId) {
        console.log("❌ User is not authorized to delete this message");
        return;
      }

      await Chat.findByIdAndDelete(messageId);
      console.log(`📩 Message deleted: ${messageId}`);

      io.to(message.groupId.toString()).emit("messageDeleted", messageId);
    } catch (error) {
      console.error("❌ Error deleting message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
