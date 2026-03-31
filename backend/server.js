import http from "http";
import { Server } from "socket.io";

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import Message from "./src/models/message.model.js";

// connect DB
connectDB();

// create HTTP server
const server = http.createServer(app);

// setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// socket events
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // join room (doctor-patient room)
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // send message
  socket.on("send_message", async (data) => {
    try {
      // data = { roomId, sender, receiver, message, appointment }

      console.log("📩 Message received:", data);

      // save message in DB
      const savedMessage = await Message.create({
        roomId: data.roomId,
        sender: data.sender,
        receiver: data.receiver,
        message: data.message,
        appointment: data.appointment,
      });

      // emit saved message to room
      io.to(data.roomId).emit("receive_message", savedMessage);
    } catch (error) {
      console.log("❌ Message error:", error.message);
    }
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// make io accessible globally (optional for controllers)
app.set("io", io);

const PORT = process.env.PORT || 5000;

// start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});