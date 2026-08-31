import { Schema, model } from "mongoose";

import { COMMUNICATION_TYPE, type IConversation } from "./types.js";

const conversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    type: {
      type: String,
      required: true,
      enum: Object.values(COMMUNICATION_TYPE),
      index: true,
    },

    name: {
      type: String,
      default: null,
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({
  participants: 1,
  updatedAt: -1,
});

export const Conversation = model<IConversation>(
  "Conversation",
  conversationSchema,
);
