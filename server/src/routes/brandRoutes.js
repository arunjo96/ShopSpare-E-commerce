import { Router} from "express";

import {
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/admin/brandController.js";

import { getBrands } from "../controllers/brandController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const brandRouter = Router();

/* =================== User Routes ============== */


brandRouter.get("/", getBrands);

/* =================== Admin Routes ============== */

brandRouter.post("/", protect, adminOnly, createBrand);

brandRouter.put("/:id", protect, adminOnly, updateBrand);

brandRouter.delete("/:id", protect, adminOnly, deleteBrand);

export default brandRouter;
