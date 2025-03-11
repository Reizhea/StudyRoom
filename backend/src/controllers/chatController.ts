import { Request, Response } from "express";
import Chat from "../models/Chat";
import { getErrorMessage } from "../utils/errorHandler";
import { Types } from "mongoose";

export const saveMessage = async (groupId: string, sender: string, content: string): Promise<void> => {
  try {
    const message = new Chat({ groupId, sender, content });
    await message.save();
  } catch (error) {
    console.error("Error saving chat message:", getErrorMessage(error));
  }
};

export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
  const { groupId } = req.params;

  try {
    const messages = await Chat.find({ groupId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve chat history", error: getErrorMessage(error) });
  }
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
    const { messageId } = req.params;
  
    try {
      // Ensure the messageId is a valid ObjectId
      const objectId = new Types.ObjectId(messageId);  // Convert messageId to ObjectId
      
      const deletedMessage = await Chat.findByIdAndDelete(objectId);
      
      if (!deletedMessage) {
        res.status(404).json({ message: "Message not found" });
        return;
      }
  
      res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete message", error: getErrorMessage(error) });
    }
  };