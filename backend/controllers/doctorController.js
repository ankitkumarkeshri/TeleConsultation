const User = require("../models/User");

// 🔥 GET ALL DOCTORS
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select(
      "name email specialization"
    );

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });

  } catch (err) {
    console.error("GET DOCTORS ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
    });
  }
};