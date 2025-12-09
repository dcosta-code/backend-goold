import helmet from "helmet";
import compression from "compression";
import hpp from "hpp";
import { Express, Request, Response, NextFunction } from "express";

export const configureSecurityMiddlewares = (app: Express): void => {
  app.use(helmet());

  app.use(compression());

  app.use(hpp());

  app.disable("x-powered-by");

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  });
};
