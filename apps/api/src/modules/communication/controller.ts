import { Request, Response } from "express";

import { communicationService } from "./service.js";
import { StatusCode } from "../../constants/statusCode.js";

export const communicationController = {
  async createDirectConversation(req: Request, res: Response) {
    const { participantId } = req.body;

    const conversation = await communicationService.createDirectConversation(
      req.user._id.toString(),
      participantId,
    );

    res.status(StatusCode.CREATED).json({
      success: true,
      data: conversation,
    });
  },

  async createGroupConversation(req: Request, res: Response) {
    const { participantIds, name } = req.body;

    const conversation = await communicationService.createGroupConversation(
      req.user._id.toString(),
      participantIds,
      name,
    );

    res.status(StatusCode.CREATED).json({
      success: true,
      data: conversation,
    });
  },

  async getConversations(req: Request, res: Response) {
    const conversations = await communicationService.getUserConversations(
      req.user._id.toString(),
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: conversations,
    });
  },

  async getConversation(req: Request, res: Response) {
    const conversation = await communicationService.getConversation(
      req.params.conversationId as string,
      req.user._id.toString(),
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: conversation,
    });
  },

  async getMessages(req: Request, res: Response) {
    const limit = Number(req.query.limit ?? 50);
    const skip = Number(req.query.skip ?? 0);

    const messages = await communicationService.getMessages(
      req.params.conversationId as string,
      req.user._id.toString(),
      limit,
      skip,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: messages,
    });
  },

  async createMessage(req: Request, res: Response) {
    const message = await communicationService.createMessage(
      req.params.conversationId as string,
      req.user._id.toString(),
      req.body.content,
    );

    res.status(StatusCode.CREATED).json({
      success: true,
      data: message,
    });
  },

  async updateMessage(req: Request, res: Response) {
    const message = await communicationService.updateMessage(
      req.params.messageId as string,
      req.user._id.toString(),
      req.body.content,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: message,
    });
  },

  async deleteMessage(req: Request, res: Response) {
    await communicationService.deleteMessage(
      req.params.messageId as string,
      req.user._id.toString(),
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Message deleted successfully.",
    });
  },

  async addGroupParticipant(req: Request, res: Response) {
    const { participantId } = req.body;

    const conversation = await communicationService.addGroupParticipant(
      req.params.conversationId as string,
      req.user._id.toString(),
      participantId,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: conversation,
    });
  },

  async removeGroupParticipant(req: Request, res: Response) {
    const conversation = await communicationService.removeGroupParticipant(
      req.params.conversationId as string,
      req.user._id.toString(),
      req.params.participantId as string,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: conversation,
    });
  },

  async searchUsers(req: Request, res: Response) {
    const query = String(req.query.q ?? "");

    const users = await communicationService.searchUsers(
      req.user._id.toString(),
      query,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: users,
    });
  },

  async updateGroupName(req: Request, res: Response) {
    const { name } = req.body;

    const conversation = await communicationService.updateGroupName(
      req.params.conversationId as string,
      req.user._id.toString(),
      name,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: conversation,
    });
  },
};
