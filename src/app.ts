import express, { Express } from "express";
import { configureSecurityMiddlewares } from "./middlewares/security";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import routes from "./routes";

export const createApp = (): Express => {
  const app = express();

  configureSecurityMiddlewares(app);

  app.use(express.json({ limit: "256kb" }));
  app.use(express.urlencoded({ extended: true, limit: "256kb" }));

  app.use("/api", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
