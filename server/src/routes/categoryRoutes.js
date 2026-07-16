import { Router} from "express";

import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/admin/categoryController.js";

import { getCategories } from "../controllers/categoryController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const categoryRouter = Router();

/* =================== User Routes================= */

categoryRouter.get("/", getCategories);

/* =================== Admin Routes ================= */

categoryRouter.post("/", protect, adminOnly, createCategory);

categoryRouter.put("/:id", protect, adminOnly, updateCategory);

categoryRouter.delete("/:id", protect, adminOnly, deleteCategory);

export default categoryRouter;
