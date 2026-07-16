import { Router} from "express";

import {
  createRazorpayOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";

const paymentRouter = Router();

paymentRouter.post("/create-order", protect, createRazorpayOrder);

paymentRouter.post("/verify", protect, verifyPayment);

export default paymentRouter;
