import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { communicationKeys } from "@/services/communication/keys";
import { communicationService } from "@/services/communication/service";

import type {
  AddGroupParticipantPayload,
  CreateDirectConversationPayload,
  CreateGroupConversationPayload,
  CreateMessagePayload,
  UpdateGroupNamePayload,
  UpdateMessagePayload,
} from "@/services/communication/types";

export const useCommunication = (conversationId: string | null = null) => {
  const queryClient = useQueryClient();

  /*
   * Conversations
   */

  const conversationsQuery = useQuery({
    queryKey: communicationKeys.conversations(),
    queryFn: communicationService.getConversations,
  });

  /*
   * Selected conversation
   */

  const conversationQuery = useQuery({
    queryKey: conversationId
      ? communicationKeys.conversation(conversationId)
      : communicationKeys.all,

    queryFn: () => communicationService.getConversation(conversationId!),

    enabled: Boolean(conversationId),
  });

  /*
   * Messages
   */

  const messagesQuery = useQuery({
    queryKey: conversationId
      ? communicationKeys.messages(conversationId)
      : communicationKeys.all,

    queryFn: () => communicationService.getMessages(conversationId!),

    enabled: Boolean(conversationId),
  });

  /*
   * Create direct conversation
   */

  const createDirectConversationMutation = useMutation({
    mutationFn: (payload: CreateDirectConversationPayload) =>
      communicationService.createDirectConversation(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: communicationKeys.conversations(),
      });
    },
  });

  /*
   * Create group conversation
   */

  const createGroupConversationMutation = useMutation({
    mutationFn: (payload: CreateGroupConversationPayload) =>
      communicationService.createGroupConversation(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: communicationKeys.conversations(),
      });
    },
  });

  /*
   * Send message
   */

  const createMessageMutation = useMutation({
    mutationFn: (payload: CreateMessagePayload) => {
      if (!conversationId) {
        throw new Error("Conversation ID is required.");
      }

      return communicationService.createMessage(conversationId, payload);
    },

    onSuccess: () => {
      if (!conversationId) return;

      queryClient.invalidateQueries({
        queryKey: communicationKeys.messages(conversationId),
      });

      queryClient.invalidateQueries({
        queryKey: communicationKeys.conversations(),
      });
    },
  });

  /*
   * Update message
   */

  const updateMessageMutation = useMutation({
    mutationFn: ({
      messageId,
      payload,
    }: {
      messageId: string;
      payload: UpdateMessagePayload;
    }) => communicationService.updateMessage(messageId, payload),

    onSuccess: () => {
      if (!conversationId) return;

      queryClient.invalidateQueries({
        queryKey: communicationKeys.messages(conversationId),
      });
    },
  });

  /*
   * Delete message
   */

  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: string) =>
      communicationService.deleteMessage(messageId),

    onSuccess: () => {
      if (!conversationId) return;

      queryClient.invalidateQueries({
        queryKey: communicationKeys.messages(conversationId),
      });
    },
  });

  /*
   * Add group participant
   */

  const addGroupParticipantMutation = useMutation({
    mutationFn: (payload: AddGroupParticipantPayload) => {
      if (!conversationId) {
        throw new Error("Conversation ID is required.");
      }

      return communicationService.addGroupParticipant(conversationId, payload);
    },

    onSuccess: (conversation) => {
      queryClient.setQueryData(
        communicationKeys.conversation(conversation._id),
        conversation,
      );

      queryClient.invalidateQueries({
        queryKey: communicationKeys.conversations(),
      });
    },
  });

  /*
   * Remove group participant
   */

  const removeGroupParticipantMutation = useMutation({
    mutationFn: (participantId: string) => {
      if (!conversationId) {
        throw new Error("Conversation ID is required.");
      }

      return communicationService.removeGroupParticipant(
        conversationId,
        participantId,
      );
    },

    onSuccess: (conversation) => {
      queryClient.setQueryData(
        communicationKeys.conversation(conversation._id),
        conversation,
      );

      queryClient.invalidateQueries({
        queryKey: communicationKeys.conversations(),
      });
    },
  });

  /*
   * Update group name
   */

  const updateGroupNameMutation = useMutation({
    mutationFn: (payload: UpdateGroupNamePayload) => {
      if (!conversationId) {
        throw new Error("Conversation ID is required.");
      }

      return communicationService.updateGroupName(conversationId, payload);
    },

    onSuccess: (conversation) => {
      queryClient.setQueryData(
        communicationKeys.conversation(conversation._id),
        conversation,
      );

      queryClient.invalidateQueries({
        queryKey: communicationKeys.conversations(),
      });
    },
  });

  return {
    /*
     * Queries
     */

    conversations: conversationsQuery.data ?? [],
    conversationsQuery,

    conversation: conversationQuery.data ?? null,
    conversationQuery,

    messages: messagesQuery.data ?? [],
    messagesQuery,

    /*
     * Mutations
     */

    createDirectConversation: createDirectConversationMutation.mutateAsync,

    isCreatingDirectConversation: createDirectConversationMutation.isPending,

    createGroupConversation: createGroupConversationMutation.mutateAsync,

    isCreatingGroupConversation: createGroupConversationMutation.isPending,

    sendMessage: createMessageMutation.mutateAsync,

    isSendingMessage: createMessageMutation.isPending,

    updateMessage: updateMessageMutation.mutateAsync,

    isUpdatingMessage: updateMessageMutation.isPending,

    deleteMessage: deleteMessageMutation.mutateAsync,

    isDeletingMessage: deleteMessageMutation.isPending,

    addGroupParticipant: addGroupParticipantMutation.mutateAsync,

    isAddingGroupParticipant: addGroupParticipantMutation.isPending,

    removeGroupParticipant: removeGroupParticipantMutation.mutateAsync,

    isRemovingGroupParticipant: removeGroupParticipantMutation.isPending,

    updateGroupName: updateGroupNameMutation.mutateAsync,

    isUpdatingGroupName: updateGroupNameMutation.isPending,
  };
};
