import mongoose, { Schema, Document, Types } from "mongoose";

export interface IChatMessage extends Document {
  groupId: Types.ObjectId;
  sender: Types.ObjectId;
  content: string; 
  timestamp: Date;
}

const ChatSchema = new Schema<IChatMessage>({
  groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IChatMessage>("Chat", ChatSchema);
