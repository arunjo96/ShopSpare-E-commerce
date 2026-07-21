import { Router } from "express";

import upload from "../middleware/uploadMiddleware.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

import {
  createCarousel,
  updateCarousel,
  deleteCarousel,
  getAdminCarousels,
} from "../controllers/admin/carouselController.js";

import { getCarousels } from "../controllers/carouselController.js";

const carouselRouter = Router();

/* ============= USER ROUTES ==================== */

carouselRouter.get("/", getCarousels);

/* ============== ADMIN ROUTES ==================== */

carouselRouter.get("/admin/all", protect, adminOnly, getAdminCarousels);

carouselRouter.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createCarousel,
);

carouselRouter.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateCarousel,
);

carouselRouter.delete("/:id", protect, adminOnly, deleteCarousel);

export default carouselRouter;
