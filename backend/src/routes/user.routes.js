import express from "express";
import { getDoctors } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// get all doctors (protected)
router.get("/doctors", protect, getDoctors);

export default router;