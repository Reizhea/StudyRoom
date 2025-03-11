import mongoose, { Schema, Document, Types } from "mongoose";

export interface IResource {
  _id: Types.ObjectId;
  title: string;
  url: string;
  addedBy: Types.ObjectId; // User ID of the uploader
}

export interface IGroup extends Document {
  name: string;
  description: string;
  admin: Types.ObjectId; // User ID
  members: Types.ObjectId[]; // Array of User IDs
  pendingInvites: Types.ObjectId[]; // Array of User IDs for pending invites
  resources: IResource[];
}

const ResourceSchema = new Schema<IResource>({
  _id: { type: Schema.Types.ObjectId, required: true, auto: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const GroupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  description: { type: String },
  admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  pendingInvites: [{ type: Schema.Types.ObjectId, ref: "User" }],
  resources: [ResourceSchema],
});

export default mongoose.model<IGroup>("Group", GroupSchema);
