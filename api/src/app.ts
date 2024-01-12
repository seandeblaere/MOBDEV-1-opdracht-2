import express, { Express } from "express";
import { registerRoutes } from "./Routes";
import { registerMiddleware } from "./Middleware";

const app: Express = express();

registerMiddleware(app);

registerRoutes(app);

export default app;
