import { Types } from "mongoose";

import { Conversation } from "./model.js";
import { Message } from "./messageModel.js";

export const communicationRepository = {
  async findConversationById(conversationId: string) {
    return Conversation.findById(conversationId).populate(
      "participants",
      "_id name email avatar",
    );
  },

  async findDirectConversation(userId: string, participantId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const participantObjectId = new Types.ObjectId(participantId);

    return Conversation.findOne({
      type: "DIRECT",
      participants: {
        $all: [userObjectId, participantObjectId],
        $size: 2,
      },
    }).populate("participants", "_id name email avatar");
  },

  async createConversation(data: {
    participants: Types.ObjectId[];
    type: "DIRECT" | "GROUP";
    name?: string | null;
    createdBy: Types.ObjectId;
  }) {
    const conversation = await Conversation.create(data);

    return conversation.populate("participants", "_id name email avatar");
  },

  async findUserConversations(userId: string) {
    return Conversation.find({
      participants: new Types.ObjectId(userId),
    })
      .populate("participants", "_id name email avatar")
      .sort({
        updatedAt: -1,
      });
  },

  async addConversationParticipant(conversationId: string, userId: string) {
    return Conversation.findByIdAndUpdate(
      conversationId,
      {
        $addToSet: {
          participants: new Types.ObjectId(userId),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("participants", "_id name email avatar");
  },

  async removeConversationParticipant(conversationId: string, userId: string) {
    return Conversation.findByIdAndUpdate(
      conversationId,
      {
        $pull: {
          participants: new Types.ObjectId(userId),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("participants", "_id name email avatar");
  },

  async updateConversationName(conversationId: string, name: string) {
    return Conversation.findByIdAndUpdate(
      conversationId,
      {
        name,
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("participants", "_id name email avatar");
  },

  /*
   * Create message
   *
   * Populate sender so frontend receives
   * sender name + email + avatar.
   */
  async createMessage(data: {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    content: string;
  }) {
    const message = await Message.create(data);

    return message.populate("senderId", "_id name email avatar");
  },

  /*
   * Find message
   */

  async findMessageById(messageId: string) {
    return Message.findById(messageId).populate(
      "senderId",
      "_id name email avatar",
    );
  },

  /*
   * Find conversation messages
   */

  async findMessages(conversationId: string, limit: number, skip: number) {
    return Message.find({
      conversationId: new Types.ObjectId(conversationId),
    })
      .populate("senderId", "_id name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  },

  /*
   * Update message
   */

  async updateMessage(messageId: string, content: string) {
    return Message.findByIdAndUpdate(
      messageId,
      {
        content,
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("senderId", "_id name email avatar");
  },

  /*
   * Delete message
   */

  async deleteMessage(messageId: string) {
    return Message.findByIdAndDelete(messageId);
  },
};
