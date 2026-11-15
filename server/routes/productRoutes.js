
import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// GET all products - Public
router.get("/", getProducts);

// GET one product - Public
router.get("/:id", getProductById);

// CREATE product - Admin only
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createProduct
);

// UPDATE product - Admin only
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateProduct
);

// DELETE product - Admin only
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

export default router;
