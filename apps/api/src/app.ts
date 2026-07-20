import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoles from "./modules/auth/routes.js";
import { errorHandler } from "./middlewares/error.js";
import verificationRoutes from "./modules/verification/route.js";
import workspaceRoutes from "./modules/workspace/route.js"

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);


app.use("/api/auth",authRoles);
app.use(errorHandler);

app.use("/api/auth",verificationRoutes);
app.use("/api/v1/workspaces",workspaceRoutes);

export default app;