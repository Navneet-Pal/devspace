import { Types } from "mongoose";

import { communicationRepository } from "./repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { StatusCode } from "../../constants/statusCode.js";
import { userRepository } from "../user/respository.js";

const ensureValidObjectId = (id: string, message: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCode.BAD_REQUEST, message);
  }
};

const ensureConversationParticipant = (
  conversation: {
    participants: Array<
      | Types.ObjectId
      | {
          _id: Types.ObjectId;
        }
    >;
  },
  userId: string,
) => {
  const isParticipant = conversation.participants.some((participant) => {
    const participantId = "_id" in participant ? participant._id : participant;

    return participantId.toString() === userId;
  });

  if (!isParticipant) {
    throw new ApiError(
      StatusCode.FORBIDDEN,
      "You are not a participant of this conversation.",
    );
  }
};

const ensureGroupCreator = (
  conversation: {
    type: "DIRECT" | "GROUP";
    createdBy: Types.ObjectId;
  },
  userId: string,
) => {
  if (conversation.type !== "GROUP") {
    throw new ApiError(
      StatusCode.BAD_REQUEST,
      "This operation is only available for group conversations.",
    );
  }

  if (conversation.createdBy.toString() !== userId) {
    throw new ApiError(
      StatusCode.FORBIDDEN,
      "Only the group creator can manage this group.",
    );
  }
};

const validateMessageContent = (content: string) => {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    throw new ApiError(StatusCode.BAD_REQUEST, "Message content is required.");
  }

  if (trimmedContent.length > 5000) {
    throw new ApiError(
      StatusCode.BAD_REQUEST,
      "Message cannot exceed 5000 characters.",
    );
  }

  return trimmedContent;
};

export const communicationService = {
  async createDirectConversation(userId: string, participantId: string) {
    ensureValidObjectId(participantId, "Invalid participant ID.");

    if (userId === participantId) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "You cannot create a conversation with yourself.",
      );
    }

    const participant = await userRepository.findById(participantId);

    if (!participant) {
      throw new ApiError(StatusCode.NOT_FOUND, "User not found.");
    }

    const existingConversation =
      await communicationRepository.findDirectConversation(
        userId,
        participantId,
      );

    if (existingConversation) {
      return existingConversation;
    }

    return communicationRepository.createConversation({
      participants: [
        new Types.ObjectId(userId),
        new Types.ObjectId(participantId),
      ],
      type: "DIRECT",
      name: null,
      createdBy: new Types.ObjectId(userId),
    });
  },

  async createGroupConversation(
    userId: string,
    participantIds: string[],
    name: string,
  ) {
    const uniqueParticipantIds = [...new Set([userId, ...participantIds])];

    if (uniqueParticipantIds.length < 3) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "A group conversation requires at least three participants.",
      );
    }

    if (!name.trim()) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Group name is required.");
    }

    for (const participantId of uniqueParticipantIds) {
      ensureValidObjectId(participantId, "Invalid participant ID.");

      const user = await userRepository.findById(participantId);

      if (!user) {
        throw new ApiError(
          StatusCode.NOT_FOUND,
          "One or more users were not found.",
        );
      }
    }

    return communicationRepository.createConversation({
      participants: uniqueParticipantIds.map(
        (participantId) => new Types.ObjectId(participantId),
      ),
      type: "GROUP",
      name: name.trim(),
      createdBy: new Types.ObjectId(userId),
    });
  },

  async getUserConversations(userId: string) {
    return communicationRepository.findUserConversations(userId);
  },

  async getConversation(conversationId: string, userId: string) {
    ensureValidObjectId(conversationId, "Invalid conversation ID.");

    const conversation =
      await communicationRepository.findConversationById(conversationId);

    if (!conversation) {
      throw new ApiError(StatusCode.NOT_FOUND, "Conversation not found.");
    }

    ensureConversationParticipant(conversation, userId);

    return conversation;
  },

  async getMessages(
    conversationId: string,
    userId: string,
    limit = 50,
    skip = 0,
  ) {
    await this.getConversation(conversationId, userId);

    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const safeSkip = Math.max(skip, 0);

    const messages = await communicationRepository.findMessages(
      conversationId,
      safeLimit,
      safeSkip,
    );

    /*
     * Repository fetches newest messages first for pagination.
     * Return them oldest -> newest so the chat UI displays
     * older messages at the top and the newest message at the bottom.
     */
    return messages.reverse();
  },

  async createMessage(conversationId: string, userId: string, content: string) {
    await this.getConversation(conversationId, userId);

    const trimmedContent = validateMessageContent(content);

    return communicationRepository.createMessage({
      conversationId: new Types.ObjectId(conversationId),
      senderId: new Types.ObjectId(userId),
      content: trimmedContent,
    });
  },

  async updateMessage(messageId: string, userId: string, content: string) {
    ensureValidObjectId(messageId, "Invalid message ID.");

    const message = await communicationRepository.findMessageById(messageId);

    if (!message) {
      throw new ApiError(StatusCode.NOT_FOUND, "Message not found.");
    }

    if (message.senderId.toString() !== userId) {
      throw new ApiError(
        StatusCode.FORBIDDEN,
        "You can only edit your own messages.",
      );
    }

    const trimmedContent = validateMessageContent(content);

    return communicationRepository.updateMessage(messageId, trimmedContent);
  },

  async deleteMessage(messageId: string, userId: string) {
    ensureValidObjectId(messageId, "Invalid message ID.");

    const message = await communicationRepository.findMessageById(messageId);

    if (!message) {
      throw new ApiError(StatusCode.NOT_FOUND, "Message not found.");
    }

    if (message.senderId.toString() !== userId) {
      throw new ApiError(
        StatusCode.FORBIDDEN,
        "You can only delete your own messages.",
      );
    }

    return communicationRepository.deleteMessage(messageId);
  },

  async addGroupParticipant(
    conversationId: string,
    userId: string,
    participantId: string,
  ) {
    ensureValidObjectId(participantId, "Invalid participant ID.");

    const conversation = await this.getConversation(conversationId, userId);

    ensureGroupCreator(conversation, userId);

    const participant = await userRepository.findById(participantId);

    if (!participant) {
      throw new ApiError(StatusCode.NOT_FOUND, "User not found.");
    }

    const alreadyParticipant = conversation.participants.some(
      (existingParticipantId) =>
        existingParticipantId.toString() === participantId,
    );

    if (alreadyParticipant) {
      throw new ApiError(
        StatusCode.CONFLICT,
        "User is already a participant of this group.",
      );
    }

    return communicationRepository.addConversationParticipant(
      conversationId,
      participantId,
    );
  },

  async removeGroupParticipant(
    conversationId: string,
    userId: string,
    participantId: string,
  ) {
    ensureValidObjectId(participantId, "Invalid participant ID.");

    const conversation = await this.getConversation(conversationId, userId);

    ensureGroupCreator(conversation, userId);

    if (participantId === userId) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "The group creator cannot be removed from the group.",
      );
    }

    const isParticipant = conversation.participants.some(
      (existingParticipantId) =>
        existingParticipantId.toString() === participantId,
    );

    if (!isParticipant) {
      throw new ApiError(
        StatusCode.NOT_FOUND,
        "User is not a participant of this group.",
      );
    }

    return communicationRepository.removeConversationParticipant(
      conversationId,
      participantId,
    );
  },

  async searchUsers(userId: string, query: string) {
    return userRepository.searchUsers(query, userId);
  },

  async updateGroupName(conversationId: string, userId: string, name: string) {
    const conversation = await this.getConversation(conversationId, userId);

    ensureGroupCreator(conversation, userId);

    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Group name is required.");
    }

    if (trimmedName.length > 100) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Group name cannot exceed 100 characters.",
      );
    }

    return communicationRepository.updateConversationName(
      conversationId,
      trimmedName,
    );
  },
};
