import React, { useState } from "react";
import API from "../api/axios";

const DoctorCard = ({ doctor }) => {
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  const book = async () => {
    try {
      if (!timeSlot) {
        alert("Select time slot");
        return;
      }

      setLoading(true);

      const res = await API.post("/appointments/book", {
        doctorId: doctor._id,
        timeSlot,
      });

      alert(res.data.message);

      setBooked(true);

      window.location.reload();

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={card}>
      <h3>{doctor.name}</h3>
      <p>{doctor.email}</p>


      <label style={{ fontSize: "14px", fontWeight: "bold" }}>
        Select Time:
      </label>

      <input
        type="datetime-local"
        value={timeSlot}
        onChange={(e) => setTimeSlot(e.target.value)}
        style={input}
      />

      <button
        onClick={book}
        disabled={loading || booked}
        style={{
          ...btn,
          background: booked ? "gray" : "#007bff",
        }}
      >
        {loading
          ? "Booking..."
          : booked
          ? "Requested"
          : "Request Appointment"}
      </button>
    </div>
  );
};

const card = {
  border: "1px solid #ccc",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "8px",
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const input = {
  padding: "8px",
  fontSize: "14px",
};

const btn = {
  padding: "10px",
  border: "none",
  color: "#fff",
  cursor: "pointer",
};

export default DoctorCard;