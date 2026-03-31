import http from "http";
import { Server } from "socket.io";

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

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

  // disconnect
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// make io accessible in controllers
app.set("io", io);

const PORT = process.env.PORT || 5000;

// start server using http server (NOT app.listen)
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});