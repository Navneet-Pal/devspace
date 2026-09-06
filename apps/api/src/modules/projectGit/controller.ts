import crypto from "crypto";
import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { StatusCode } from "../../constants/statusCode.js";

import { projectGitService } from "./service.js";

const getWebhookSecret = () => {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error("GITHUB_WEBHOOK_SECRET is not configured.");
  }

  return secret;
};

const verifyGitHubSignature = (
  rawBody: Buffer,
  signature: string | undefined,
) => {
  if (!signature) {
    return false;
  }

  const expectedSignature = `sha256=${crypto
    .createHmac("sha256", getWebhookSecret())
    .update(rawBody)
    .digest("hex")}`;

  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const receivedBuffer = Buffer.from(signature, "utf8");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
};

export const getProjectGit = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await projectGitService.getIntegration(
      req.params.workspaceId as string,
      req.params.projectId as string,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          data,
          "Git integration fetched successfully.",
        ),
      );
  },
);

export const createGitHubInstallUrl = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await projectGitService.createGitHubInstallUrl(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.user._id.toString(),
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          data,
          "GitHub installation URL created successfully.",
        ),
      );
  },
);

export const githubSetup = asyncHandler(async (req: Request, res: Response) => {
  const installationId = Number(req.query.installation_id);
  const state = String(req.query.state ?? "");

  const result = await projectGitService.handleGitHubSetup(
    installationId,
    state,
  );

  return res.redirect(result.redirectUrl);
});

export const githubWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    const signature = req.header("x-hub-signature-256");
    const event = req.header("x-github-event");
    const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;

    if (!rawBody) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json(
          new ApiResponse(
            StatusCode.BAD_REQUEST,
            null,
            "GitHub webhook raw body is missing.",
          ),
        );
    }

    if (!verifyGitHubSignature(rawBody, signature)) {
      return res
        .status(StatusCode.UNAUTHORIZED)
        .json(
          new ApiResponse(
            StatusCode.UNAUTHORIZED,
            null,
            "Invalid GitHub webhook signature.",
          ),
        );
    }

    if (!event) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json(
          new ApiResponse(
            StatusCode.BAD_REQUEST,
            null,
            "GitHub webhook event is missing.",
          ),
        );
    }

    let payload: Record<string, unknown>;

    try {
      payload = JSON.parse(rawBody.toString("utf8")) as Record<string, unknown>;
    } catch {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json(
          new ApiResponse(
            StatusCode.BAD_REQUEST,
            null,
            "Invalid GitHub webhook payload.",
          ),
        );
    }

    await projectGitService.handleGitHubWebhook(event, payload);

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          null,
          "GitHub webhook processed successfully.",
        ),
      );
  },
);

export const getRepositories = asyncHandler(
  async (req: Request, res: Response) => {
    const repositories = await projectGitService.getRepositories(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.user._id.toString(),
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          repositories,
          "GitHub repositories fetched successfully.",
        ),
      );
  },
);

export const connectRepository = asyncHandler(
  async (req: Request, res: Response) => {
    const integration = await projectGitService.connectRepository(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.user._id.toString(),
      req.body,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          integration,
          "GitHub repository connected successfully.",
        ),
      );
  },
);

export const disconnectGitHub = asyncHandler(
  async (req: Request, res: Response) => {
    await projectGitService.disconnect(
      req.params.workspaceId as string,
      req.params.projectId as string,
      req.user._id.toString(),
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          null,
          "GitHub disconnected successfully.",
        ),
      );
  },
);

export const getBranches = asyncHandler(async (req: Request, res: Response) => {
  const branches = await projectGitService.getBranches(
    req.params.workspaceId as string,
    req.params.projectId as string,
  );

  return res
    .status(StatusCode.OK)
    .json(
      new ApiResponse(
        StatusCode.OK,
        branches,
        "Branches fetched successfully.",
      ),
    );
});

export const getCommits = asyncHandler(async (req: Request, res: Response) => {
  const commits = await projectGitService.getCommits(
    req.params.workspaceId as string,
    req.params.projectId as string,
  );

  return res
    .status(StatusCode.OK)
    .json(
      new ApiResponse(StatusCode.OK, commits, "Commits fetched successfully."),
    );
});

export const getPullRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const pullRequests = await projectGitService.getPullRequests(
      req.params.workspaceId as string,
      req.params.projectId as string,
    );

    return res
      .status(StatusCode.OK)
      .json(
        new ApiResponse(
          StatusCode.OK,
          pullRequests,
          "Pull requests fetched successfully.",
        ),
      );
  },
);
