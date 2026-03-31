import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// protected route (doctor only)
router.get(
  "/doctor-dashboard",
  protect,
  authorizeRoles("doctor"),
  (req, res) => {
    res.json({
      message: "Welcome Doctor 👨‍⚕️",
    });
  }
);

export default router;