import User from "../models/user.model.js";

export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");

    res.status(200).json({
      message: "Doctors fetched successfully",
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};