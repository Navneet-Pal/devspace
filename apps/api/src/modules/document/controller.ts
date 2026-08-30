import { Request, Response } from "express";

import { StatusCode } from "../../constants/statusCode.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import { documentService } from "./service.js";

export const createDocument = asyncHandler(
  async (req: Request, res: Response) => {
    const document = await documentService.createDocument(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.user._id.toString(),
      req.projectMember?.role,
      req.body,
    );

    return res
      .status(StatusCode.CREATED)
      .json(
        new ApiResponse(
          StatusCode.CREATED,
          document,
          "Document created successfully.",
        ),
      );
  },
);

export const getDocuments = asyncHandler(
  async (req: Request, res: Response) => {
    const documents = await documentService.getDocuments(
      req.params.workspaceId as string,
      req.params.projectId as string,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          documents,
          "Documents fetched successfully.",
        ),
      );
  },
);

export const getDocument = asyncHandler(async (req: Request, res: Response) => {
  const document = await documentService.getDocument(
    req.params.workspaceId as string,
    req.params.projectId as string,
    req.params.documentId as string,
  );

  return res
    .status(StatusCode.OK)
    .json(
      new ApiResponse(
        StatusCode.OK,
        document,
        "Document fetched successfully.",
      ),
    );
});

export const updateDocument = asyncHandler(
  async (req: Request, res: Response) => {
    const document = await documentService.updateDocument(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.params.documentId as string,
      req.user._id.toString(),
      req.projectMember?.role,
      req.body,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          document,
          "Document updated successfully.",
        ),
      );
  },
);

export const deleteDocument = asyncHandler(
  async (req: Request, res: Response) => {
    await documentService.deleteDocument(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.params.documentId as string,
      req.user._id.toString(),
      req.projectMember?.role,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(StatusCode.OK, null, "Document deleted successfully."),
      );
  },
);
