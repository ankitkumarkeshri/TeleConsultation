import { Server } from "socket.io";
import Message from "./models/message.model.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join appointment room
    socket.on("joinRoom", (appointmentId) => {
      socket.join(appointmentId);
      console.log("Joined room:", appointmentId);
    });

    // Handle sending message
    socket.on("sendMessage", async (data) => {
      const { appointmentId, sender, message } = data;

      // Save in DB
      const newMessage = await Message.create({
        appointment: appointmentId,
        sender,
        message,
      });

      // Broadcast to room
      io.to(appointmentId).emit("receiveMessage", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};