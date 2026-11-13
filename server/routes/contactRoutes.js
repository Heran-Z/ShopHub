import express from "express";
import {
  submitContact,
  getAllMessages,
  updateMessageStatus,
  deleteMessage,
} from "../controllers/contactController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public — anyone can submit
router.post("/", submitContact);

// Admin only
router.get("/",          protect, adminOnly, getAllMessages);
router.patch("/:id/status", protect, adminOnly, updateMessageStatus);
router.delete("/:id",    protect, adminOnly, deleteMessage);

export default router;
