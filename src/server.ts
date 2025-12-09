import { createServer } from "http";
import { createApp } from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/sequelize";
import { initializeSocket } from "./config/socket";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    const app = createApp();
    const httpServer = createServer(app);

    initializeSocket(httpServer);

    httpServer.listen(env.port, () => {
      console.log(`Server running on ${env.port}`);
      console.log(`Environment: ${env.nodeEnv}`);
      console.log("Socket.io enabled");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
