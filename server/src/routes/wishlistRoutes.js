import { Router} from "express";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";

import { protect } from "../middleware/authMiddleware.js";

const wishlistRouter = Router();

wishlistRouter.post("/", protect, addToWishlist);

wishlistRouter.get("/", protect, getWishlist);

wishlistRouter.delete("/:productId", protect, removeFromWishlist);

wishlistRouter.delete("/clear/all", protect, clearWishlist);

export default wishlistRouter;
