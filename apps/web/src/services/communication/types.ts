export type CommunicationType = "DIRECT" | "GROUP";

export interface ConversationParticipant {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface Conversation {
  _id: string;
  participants: ConversationParticipant[];
  type: CommunicationType;
  name?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageSender {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: MessageSender;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSearchResult {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface CreateDirectConversationPayload {
  participantId: string;
}

export interface CreateGroupConversationPayload {
  participantIds: string[];
  name: string;
}

export interface CreateMessagePayload {
  content: string;
}

export interface UpdateMessagePayload {
  content: string;
}

export interface AddGroupParticipantPayload {
  participantId: string;
}

export interface UpdateGroupNamePayload {
  name: string;
}
