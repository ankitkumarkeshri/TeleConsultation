import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h1 style={{ fontSize: "36px" }}>
          🩺 Teleconsultation Platform
        </h1>

        <p style={{ fontSize: "18px", color: "#555" }}>
          Book doctors, consult in real-time, and manage prescriptions — all in one place.
        </p>

        <div style={{ marginTop: "30px" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </div>
      </div>

      
      <div
        style={{
          marginTop: "80px",
          display: "flex",
          justifyContent: "space-around",
          padding: "20px",
        }}
      >
        <div>
          <h3>⚡ Real-time Consultation</h3>
          <p>Connect instantly with doctors using live video.</p>
        </div>

        <div>
          <h3>📅 Easy Booking</h3>
          <p>Schedule appointments with your preferred doctors.</p>
        </div>

        <div>
          <h3>💊 Digital Prescription</h3>
          <p>Get prescriptions directly after consultation.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;