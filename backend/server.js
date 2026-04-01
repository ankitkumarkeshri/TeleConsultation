
import http from "http";
import { Server } from "socket.io";

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import Message from "./src/models/message.model.js";
import { authenticateSocket } from "./src/middlewares/socketAuth.js";

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

// 🔥 Online users store
const onlineUsers = new Map();

// 🔐 Socket auth middleware
io.use(authenticateSocket);

// socket events
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  const user = socket.user;

  // ✅ Add user to online list
  onlineUsers.set(user.id, {
    socketId: socket.id,
    role: user.role,
  });

  // 🔥 Emit online users to all clients
  io.emit("online_users", Array.from(onlineUsers.keys()));

  // join room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  // send message
  socket.on("send_message", async (data) => {
    try {
      const savedMessage = await Message.create({
        roomId: data.roomId,
        sender: user.id, // ✅ from JWT
        receiver: data.receiver,
        message: data.message,
        appointment: data.appointment,
      });

      io.to(data.roomId).emit("receive_message", savedMessage);
    } catch (error) {
      console.log("❌ Message error:", error.message);
    }
  });

  // typing
  socket.on("typing", (roomId) => {
    socket.to(roomId).emit("typing");
  });

  socket.on("stop_typing", (roomId) => {
    socket.to(roomId).emit("stop_typing");
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);

    // remove user from online list
    onlineUsers.delete(user.id);

    // emit updated list
    io.emit("online_users", Array.from(onlineUsers.keys()));
  });
});

// make io accessible globally
app.set("io", io);

const PORT = process.env.PORT || 5000;

// start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


