export const communicationKeys = {
  all: ["communication"] as const,

  conversations: () => [...communicationKeys.all, "conversations"] as const,

  conversation: (conversationId: string) =>
    [...communicationKeys.conversations(), conversationId] as const,

  messages: (conversationId: string) =>
    [...communicationKeys.conversation(conversationId), "messages"] as const,
};
