const Prescription = require("../models/Prescription");
const { sendToQueue } = require("../config/rabbitmq");

exports.createPrescription = async (req, res) => {
  try {
    const { appointmentId, notes, medicines, patientId } = req.body;

    const prescription = await Prescription.create({
      appointmentId,
      doctorId: req.user.id,
      patientId,
      notes,
      medicines,
    });

    
    sendToQueue({
      prescriptionId: prescription._id,
      appointmentId,
    });

    res.json({
      message: "Prescription created successfully",
      prescription,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};