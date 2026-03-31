import Message from "../models/message.model.js";

// ================= GET CHAT HISTORY =================
export const getChatMessages = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const messages = await Message.find({
      appointment: appointmentId,
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: 1 }); // oldest first

    res.status(200).json({
      message: "Chat history fetched successfully",
      count: messages.length,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};