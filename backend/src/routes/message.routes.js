import express from "express";
import { getChatMessages } from "../controllers/message.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// get chat history for an appointment
router.get("/:appointmentId", protect, getChatMessages);

export default router;