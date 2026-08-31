import { axiosInstance } from "@/lib/axios";
import type {
  AddGroupParticipantPayload,
  Conversation,
  CreateDirectConversationPayload,
  CreateGroupConversationPayload,
  CreateMessagePayload,
  Message,
  UpdateGroupNamePayload,
  UpdateMessagePayload,
  UserSearchResult,
} from "./types";

export const communicationService = {
  async getConversations(): Promise<Conversation[]> {
    const response = await axiosInstance.get("/v1/communications");

    return response.data.data;
  },

  async getConversation(conversationId: string): Promise<Conversation> {
    const response = await axiosInstance.get(
      `/v1/communications/${conversationId}`,
    );

    return response.data.data;
  },

  async createDirectConversation(
    payload: CreateDirectConversationPayload,
  ): Promise<Conversation> {
    const response = await axiosInstance.post(
      "/v1/communications/direct",
      payload,
    );

    return response.data.data;
  },

  async createGroupConversation(
    payload: CreateGroupConversationPayload,
  ): Promise<Conversation> {
    const response = await axiosInstance.post(
      "/v1/communications/group",
      payload,
    );

    return response.data.data;
  },

  async searchUsers(query: string): Promise<UserSearchResult[]> {
    const response = await axiosInstance.get("/v1/communications/users/search", {
      params: {
        q: query,
      },
    });

    return response.data.data;
  },

  async getMessages(
    conversationId: string,
    limit = 50,
    skip = 0,
  ): Promise<Message[]> {
    const response = await axiosInstance.get(
      `/v1/communications/${conversationId}/messages`,
      {
        params: {
          limit,
          skip,
        },
      },
    );

    return response.data.data;
  },

  async createMessage(
    conversationId: string,
    payload: CreateMessagePayload,
  ): Promise<Message> {
    const response = await axiosInstance.post(
      `/v1/communications/${conversationId}/messages`,
      payload,
    );

    return response.data.data;
  },

  async updateMessage(
    messageId: string,
    payload: UpdateMessagePayload,
  ): Promise<Message> {
    const response = await axiosInstance.patch(
      `/v1/communications/messages/${messageId}`,
      payload,
    );

    return response.data.data;
  },

  async deleteMessage(messageId: string) {
    const response = await axiosInstance.delete(
      `/v1/communications/messages/${messageId}`,
    );

    return response.data;
  },

  async addGroupParticipant(
    conversationId: string,
    payload: AddGroupParticipantPayload,
  ): Promise<Conversation> {
    const response = await axiosInstance.post(
      `/v1/communications/${conversationId}/participants`,
      payload,
    );

    return response.data.data;
  },

  async removeGroupParticipant(
    conversationId: string,
    participantId: string,
  ): Promise<Conversation> {
    const response = await axiosInstance.delete(
      `/v1/communications/${conversationId}/participants/${participantId}`,
    );

    return response.data.data;
  },

  async updateGroupName(
    conversationId: string,
    payload: UpdateGroupNamePayload,
  ): Promise<Conversation> {
    const response = await axiosInstance.patch(
      `/v1/communications/${conversationId}/name`,
      payload,
    );

    return response.data.data;
  },
};
