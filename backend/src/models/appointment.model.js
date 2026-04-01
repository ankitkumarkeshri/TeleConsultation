import Appointment from "../models/appointment.model.js";

export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
    });

    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};