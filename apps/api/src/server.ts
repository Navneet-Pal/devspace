import { createServer } from "http";

import app from "./app.js";
import "dotenv/config";

import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { initializeSocket } from "./socket/index.js";

const startServer = async () => {
  try {
    await connectDB();

    const httpServer = createServer(app);

    initializeSocket(httpServer);

    httpServer.listen(env.PORT, () => {
      console.log(`server started on port ${env.PORT}`);
    });
  } catch (error) {
    console.log("failed to start server");
    process.exit(1);
  }
};

startServer();
