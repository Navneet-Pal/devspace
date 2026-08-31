import { Router } from "express";

import { authenticate } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";

import {
  createDirectConversationSchema,
  createGroupConversationSchema,
  addGroupParticipantSchema,
  updateGroupNameSchema,
  createMessageSchema,
  updateMessageSchema,
} from "./validation.js";

import { communicationController } from "./controller.js";

const router = Router();

/*
 * Conversations
 */

router.post(
  "/direct",
  authenticate,
  validate(createDirectConversationSchema),
  communicationController.createDirectConversation,
);

router.post(
  "/group",
  authenticate,
  validate(createGroupConversationSchema),
  communicationController.createGroupConversation,
);

router.get("/", authenticate, communicationController.getConversations);

router.get(
  "/:conversationId",
  authenticate,
  communicationController.getConversation,
);

/*
 * Messages
 */

router.get(
  "/:conversationId/messages",
  authenticate,
  communicationController.getMessages,
);

router.post(
  "/:conversationId/messages",
  authenticate,
  validate(createMessageSchema),
  communicationController.createMessage,
);

router.patch(
  "/messages/:messageId",
  authenticate,
  validate(updateMessageSchema),
  communicationController.updateMessage,
);

router.delete(
  "/messages/:messageId",
  authenticate,
  communicationController.deleteMessage,
);

/*
 * Group management
 */

router.post(
  "/:conversationId/participants",
  authenticate,
  validate(addGroupParticipantSchema),
  communicationController.addGroupParticipant,
);

router.delete(
  "/:conversationId/participants/:participantId",
  authenticate,
  communicationController.removeGroupParticipant,
);

router.get("/users/search", authenticate, communicationController.searchUsers);

router.patch(
  "/:conversationId/name",
  authenticate,
  validate(updateGroupNameSchema),
  communicationController.updateGroupName,
);

export default router;
