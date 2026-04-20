import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

import VideoCall from "../components/VideoCall";
import PrescriptionForm from "../components/prescriptionForm";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/doctor");
      setAppointments(res.data);
    } catch (err) {
      console.log("Error:", err.response?.data || err.message);
    }
  };

  const joinCall = async (id) => {
    try {
      const res = await API.post(`/appointments/join/${id}`);
      setSelectedRoom(res.data.roomId);
    } catch (err) {
      alert(err.response?.data?.message || "Cannot join call");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Doctor Dashboard</h2>

      {/* NAVIGATION */}
      <button
        onClick={() => navigate("/doctor/requests")}
        style={{
          padding: "10px",
          marginBottom: "20px",
          background: "#28a745",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: 6,
        }}
      >
        View Appointment Requests
      </button>

      
      <div>
        {appointments.length === 0 && <p>No appointments</p>}

        {appointments.map((app) => (
          <div
            key={app._id}
            style={{
              border: "1px solid #ccc",
              margin: 10,
              padding: 12,
              borderRadius: 6,
            }}
          >
            <p><b>Patient:</b> {app.patientId?.name}</p>
            <p><b>Time:</b> {app.timeSlot}</p>
            <p><b>Status:</b> {app.status}</p>

          
            {app.status === "in-call" && (
              <button
                onClick={() => joinCall(app._id)}
                style={{
                  marginTop: 10,
                  padding: "8px 12px",
                  background: "blue",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Join Video Call
              </button>
            )}
          </div>
        ))}
      </div>

    
      {selectedRoom && (
        <VideoCall roomId={selectedRoom} />
      )}

      {/* PRESCRIPTION */}
      {selectedRoom && (
        <PrescriptionForm appointmentId={selectedRoom} />
      )}
    </div>
  );
};

export default DoctorDashboard;