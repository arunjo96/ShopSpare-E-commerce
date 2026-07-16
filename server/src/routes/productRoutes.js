import { Router} from "express";

import {createProduct, updateProduct, deleteProduct,} from "../controllers/admin/productController.js";

import {
  getAllProducts,
  getSingleProduct,
} from "../controllers/productController.js";

import upload from "../middleware/uploadMiddleware.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const productRouter = Router();

/* ========== User Routes ============= */

productRouter.get("/", getAllProducts);

productRouter.get("/:id", getSingleProduct);


/* ========== Admin Routes ============= */

productRouter.post("/", protect, adminOnly, upload.array("images", 5), createProduct);

productRouter.put("/:id", protect,adminOnly,upload.array("images", 5),updateProduct,);

productRouter.delete("/:id", protect, adminOnly, deleteProduct);

export default productRouter;
