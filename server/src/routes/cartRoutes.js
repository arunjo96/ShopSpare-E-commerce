import { Router} from "express";

import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";

import { protect } from "../middleware/authMiddleware.js";

const cartRouter = Router();

cartRouter.post("/", protect, addToCart);

cartRouter.get("/", protect, getCart);

cartRouter.put("/:productId", protect, updateCartItem);

cartRouter.delete("/:productId", protect, removeCartItem);

cartRouter.delete("/clear/all", protect, clearCart);

export default cartRouter;
