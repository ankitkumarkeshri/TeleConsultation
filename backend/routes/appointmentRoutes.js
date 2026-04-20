const express = require("express");
const router = express.Router();

const {
  bookAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  acceptAppointment,
  startSession,
  joinCall,
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");

const Appointment = require("../models/Appointment");

router.post("/book", protect, bookAppointment);
router.get("/patient", protect, getPatientAppointments);

router.get("/doctor", protect, getDoctorAppointments);
router.post("/accept/:id", protect, acceptAppointment);


router.post("/start/:id", protect, startSession);
router.get("/join/:id", protect, joinCall);


router.get("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("doctorId", "name email specialization")
      .populate("patientId", "name email");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.json(appointment);
  } catch (err) {
    console.log("GET APPOINTMENT ERROR:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;