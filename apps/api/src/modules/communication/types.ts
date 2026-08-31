import { Types } from "mongoose";

export const COMMUNICATION_TYPE = {
  DIRECT: "DIRECT",
  GROUP: "GROUP",
} as const;

export type CommunicationType =
  (typeof COMMUNICATION_TYPE)[keyof typeof COMMUNICATION_TYPE];

export interface IConversation {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
  type: CommunicationType;
  name?: string | null;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
