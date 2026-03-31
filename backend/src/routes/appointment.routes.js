import express from "express";

import {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus,
} from "../controllers/appointment.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// ================= BOOK APPOINTMENT (PATIENT) =================
router.post("/", protect, authorizeRoles("patient"), createAppointment);

// ================= GET MY APPOINTMENTS (PATIENT + DOCTOR) =================
router.get("/my", protect, getMyAppointments);

// ================= UPDATE STATUS (DOCTOR ONLY) =================
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("doctor"),
  updateAppointmentStatus
);

export default router;