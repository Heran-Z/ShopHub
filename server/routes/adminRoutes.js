
import express from "express";

import {
  getDashboardStats,
} from "../controllers/adminController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin dashboard statistics
router.get(
  "/stats",
  protect,
  adminOnly,
  getDashboardStats
);

export default router;
