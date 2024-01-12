import { Router } from "express";
import { authLocal } from "../../Middleware/auth/authMiddleware";
import { login } from "./User.controller";
import { registerUser } from "./User.registration.controller";

const router = Router();
router.post("/login", authLocal, login);
router.post("/register", registerUser);

export default router;
