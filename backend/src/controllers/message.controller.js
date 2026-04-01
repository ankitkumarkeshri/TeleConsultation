import Message from "../models/message.model.js";

// ================= GET CHAT HISTORY =================
export const getChatMessages = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      return res.status(400).json({
        message: "Appointment ID is required",
      });
    }

    const messages = await Message.find({
      appointment: appointmentId,
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: 1 }); // oldest first

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Get Chat Messages Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching chat history",
    });
  }
};