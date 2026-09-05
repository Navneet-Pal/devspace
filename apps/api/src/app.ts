import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoles from "./modules/auth/routes.js";
import { errorHandler } from "./middlewares/error.js";
import verificationRoutes from "./modules/verification/route.js";
import workspaceRoutes from "./modules/workspace/route.js";
import workspaceInvitationRoutes from "./modules/workspaceInvitation/routes.js";
import workspaceMemberRoutes from "./modules/workspaceMember/route.js";
import projectRoutes from "./modules/project/route.js";
import projectMemberRoutes from "./modules/projectMember/route.js";
import taskRoutes from "./modules/task/route.js";
import commentRoutes from "./modules/comment/route.js";
import activityRoutes from "./modules/activity/route.js";
import documentRoutes from "./modules/document/route.js";
import fileRoutes from "./modules/file/route.js";
import dashboardRoutes from "./modules/dashboard/route.js";
import communicationRoutes from "./modules/communication/route.js";
import projectGitRoutes from "./modules/projectGit/route.js";

const app = express();

app.use(
  express.json({
    verify: (req, _res, buffer) => {
      const request = req as express.Request & {
        rawBody?: Buffer;
      };

      if (
        request.originalUrl?.startsWith("/api/v1/project-git/github/webhook")
      ) {
        request.rawBody = Buffer.from(buffer);
      }
    },
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/api/auth", authRoles);
app.use(errorHandler);

app.use("/api/auth", verificationRoutes);
app.use("/api/v1/workspaces", workspaceRoutes);

app.use("/api/v1", workspaceInvitationRoutes);

app.use("/api/v1", workspaceMemberRoutes);
app.use("/api/v1", projectRoutes);
app.use("/api/v1", projectMemberRoutes);
app.use("/api/v1", taskRoutes);
app.use("/api/v1", commentRoutes);
app.use("/api/v1", activityRoutes);
app.use("/api/v1", documentRoutes);
app.use("/api/v1", fileRoutes);
app.use("/api/v1", dashboardRoutes);
app.use("/api/v1/communications", communicationRoutes);
app.use("/api/v1", projectGitRoutes);

export default app;
