import Appointment from "../models/appointment.model.js";

// ================= CREATE APPOINTMENT =================
export const createAppointment = async (req, res) => {
  try {
    const { doctor, date } = req.body;

    if (!doctor || !date) {
      return res.status(400).json({
        message: "Doctor and date are required",
      });
    }

    const appointment = await Appointment.create({
      patient: req.user.id, // from JWT middleware
      doctor,
      date,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET MY APPOINTMENTS =================
export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const appointments = await Appointment.find({
      $or: [{ patient: userId }, { doctor: userId }],
    })
      .populate("patient", "name email role")
      .populate("doctor", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Appointments fetched successfully",
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= UPDATE APPOINTMENT STATUS =================
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["pending", "confirmed", "completed", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // optional: only assigned doctor can update
    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this appointment",
      });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      message: "Appointment status updated",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};