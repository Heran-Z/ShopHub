
import express from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// CUSTOMER: Place an order
router.post("/", protect, createOrder);

// CUSTOMER: View personal orders
router.get("/my-orders", protect, getMyOrders);

// ADMIN: View all orders
router.get("/admin/all", protect, adminOnly, getAllOrders);

// ADMIN: Update order status
router.patch(
  "/admin/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

export default router;
