import { Router} from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
    logout,
  refreshToken
} from "../controllers/authController.js";

import {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
} from "../middleware/rateMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", registerLimiter, register);

authRouter.post("/login", loginLimiter, login);

authRouter.post("/forgot-password", forgotPasswordLimiter, forgotPassword);

authRouter.post("/reset-password/:token", resetPassword);

authRouter.post("/logout", protect, logout);

authRouter.post("/refresh-token", refreshToken);

export default authRouter;
