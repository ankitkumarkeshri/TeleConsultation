const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const { connectRabbit } = require("./config/rabbitmq");

const socketIO = require("socket.io");
const { setSocketIO } = require("./utils/socket");

// ========================
const app = express();
const server = http.createServer(app);

// ========================
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// ========================
const io = socketIO(server, {
  cors: { origin: "*" },
});

setSocketIO(io);

// ========================
// 🔥 FIXED SOCKET LOGIC
// ========================
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Joined room: ${roomId}`);
  });

  // offer
  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", offer);
  });

  // answer
  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
  });

  // ICE
  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  // session update (IMPORTANT)
  socket.on("session:update", (data) => {
    socket.to(data.roomId).emit("session:update", data.appointment);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ========================
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => {
  res.send("Teleconsultation API Running");
});

// ========================
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    await connectRabbit();

    server.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });
  } catch (err) {
    console.error("❌ Server failed:", err.message);
  }
};

startServer();