
import express from "express";

import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";

const router = express.Router();

// Customer registration
router.post("/register", registerUser);

// Customer login
router.post("/login", loginUser);

export default router;
