import { Server } from "socket.io";
import Message from "../models/message.model.js";
import { authenticateSocket } from "../middlewares/socketAuth.js";

export const initSocket = (server, app) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // 🔐 Apply auth middleware
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);
    console.log("👤 Auth user:", socket.user);

    // join room
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    // send message
    socket.on("send_message", async (data) => {
      try {
        const senderId = socket.user.id; // ✅ from JWT

        const savedMessage = await Message.create({
          roomId: data.roomId,
          sender: senderId,
          receiver: data.receiver,
          message: data.message,
          appointment: data.appointment,
        });

        io.to(data.roomId).emit("receive_message", savedMessage);
      } catch (error) {
        console.log("❌ Message error:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  app.set("io", io);
  return io;
};