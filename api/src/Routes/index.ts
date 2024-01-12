import { Express, Router } from "express";
import tripRoutes from "../Modules/Trip/Trip.routes";
import activityRoutes from "../Modules/Activity/Activity.routes";
import noteRoutes from "../Modules/Note/Note.routes";
import expenseRoutes from "../Modules/Expense/Expense.routes";
import { errorHandler } from "../Middleware/error/errorHandlerMiddleware";
import userPublicRoutes from "../Modules/User/User.public.routes";
import userPrivateRoutes from "../Modules/User/User.private.routes";
import { authJwt } from "../Middleware/auth/authMiddleware";

const registerRoutes = (app: Express) => {
  app.use("/", userPublicRoutes);

  const authRoutes = Router();
  authRoutes.use("/", userPrivateRoutes);
  authRoutes.use("/", tripRoutes);
  authRoutes.use("/", activityRoutes);
  authRoutes.use("/", noteRoutes);
  authRoutes.use("/", expenseRoutes);

  app.use(authJwt, authRoutes);

  // plaat error middleware na alle andere routes!
  app.use(errorHandler);
};

export { registerRoutes };
