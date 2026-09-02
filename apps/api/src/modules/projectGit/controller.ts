import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { StatusCode } from "../../constants/statusCode.js";

import { projectGitService } from "./service.js";

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
