const Appointment = require("../models/Appointment");
const { redisClient } = require("../config/redis");
const { getIO } = require("../utils/socket");

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, timeSlot } = req.body;
    const patientId = req.user.id;

    if (!doctorId || !timeSlot) {
      return res.status(400).json({ message: "doctorId and timeSlot required" });
    }

    const slotDate = new Date(timeSlot);
    if (isNaN(slotDate.getTime())) {
      return res.status(400).json({ message: "Invalid timeSlot" });
    }

    slotDate.setSeconds(0);
    slotDate.setMilliseconds(0);

    const normalizedSlot = slotDate.toISOString();

    const lockKey = `slot:${doctorId}:${normalizedSlot}`;

    const isLocked = await redisClient.get(lockKey);

    if (isLocked) {
      return res.status(409).json({ message: "Slot already booked" });
    }

    await redisClient.setEx(lockKey, 600, patientId);

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      timeSlot: normalizedSlot,
      status: "pending",
      doctorStarted: false,
      patientStarted: false,
    });

    const io = getIO();
    io.to(`doctor_${doctorId}`).emit("appointment:new", { appointment });

    return res.status(201).json({
      success: true,
      appointment,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const data = await Appointment.find({ doctorId: req.user.id })
      .populate("patientId", "name email")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const data = await Appointment.find({ patientId: req.user.id })
      .populate("doctorId", "name email specialization")
      .sort({ timeSlot: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const acceptAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Not found" });
    }

    appointment.status = "accepted";
    await appointment.save();

    const io = getIO();
    io.to(`patient_${appointment.patientId}`).emit("appointment:accepted", appointment);

    res.json(appointment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const startSession = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    const userId = req.user.id;

    if (appointment.doctorId.toString() === userId) {
      appointment.doctorStarted = true;
    }

    if (appointment.patientId.toString() === userId) {
      appointment.patientStarted = true;
    }

    appointment.status =
      appointment.doctorStarted && appointment.patientStarted
        ? "in-call"
        : "scheduled";

    await appointment.save();

    const io = getIO();
    io.to(`doctor_${appointment.doctorId}`).emit("session:update", appointment);
    io.to(`patient_${appointment.patientId}`).emit("session:update", appointment);

    res.json(appointment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const joinCall = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment.status !== "in-call") {
      return res.status(403).json({ message: "Not ready" });
    }

    appointment.roomId = appointment.roomId || appointment._id.toString();
    await appointment.save();

    res.json({ roomId: appointment.roomId });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  bookAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  acceptAppointment,
  startSession,
  joinCall,
};