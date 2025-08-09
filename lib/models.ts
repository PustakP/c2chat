import mongoose, { Schema, models, model } from "mongoose";

// s: message schema
const MessageSchema = new Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

// s: chat schema
const ChatSchema = new Schema(
  {
    slug: { type: String, index: true, unique: true },
    title: { type: String },
    messages: { type: [MessageSchema], default: [] },
  },
  { timestamps: true }
);

export type MessageDoc = { role: "user" | "assistant"; content: string };
export type ChatDoc = {
  slug: string;
  title?: string;
  messages: MessageDoc[];
};

export const ChatModel = models.Chat || model("Chat", ChatSchema);


