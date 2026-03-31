import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";




dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/appointments", appointmentRoutes);

app.use("/api/messages", messageRoutes);



app.use("/api/users", userRoutes);
// test route
app.get("/", (req, res) => {
  res.send("TeleConsultation API running... ");
});

export default app;