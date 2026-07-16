import { Router} from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/orderController.js";

import {
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
} from "../controllers/admin/orderController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const orderRouter = Router();


/* ================= Admin Routes ================= */

orderRouter.get("/admin/all", protect, adminOnly, getAllOrders);

orderRouter.get("/admin/:orderId", protect, adminOnly, getSingleOrder);

orderRouter.put("/admin/status/:orderId", protect, adminOnly, updateOrderStatus);

/* ================= User Routes ================= */

orderRouter.post("/", protect, createOrder);

orderRouter.get("/", protect, getMyOrders);

orderRouter.get("/:orderId", protect, getOrderById);

orderRouter.put("/cancel/:orderId", protect, cancelOrder);


export default orderRouter;
