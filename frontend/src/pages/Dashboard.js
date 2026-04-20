import React, { useEffect, useState } from "react";
import API from "../api/axios";
import DoctorCard from "../components/DoctorCard";
import socket from "../socket/socket";

const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const user = JSON.parse(localStorage.getItem("user"));


  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctors");

      console.log("DOCTORS:", res.data);

    
      setDoctors(Array.isArray(res.data) ? res.data : res.data.doctors || []);
    } catch (err) {
      console.log("Doctors error:", err.message);
      setDoctors([]);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/patient");

      console.log("APPOINTMENTS:", res.data);

      setAppointments(res.data || []);
    } catch (err) {
      console.log("Appointments error:", err.message);
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();

    if (user?._id) {
      socket.emit("join-user", {
        userId: user._id,
        role: "patient",
      });
    }

    socket.on("appointment:accepted", fetchAppointments);
    socket.on("session:update", fetchAppointments);

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      socket.off("appointment:accepted", fetchAppointments);
      socket.off("session:update", fetchAppointments);
      clearInterval(interval);
    };
  }, []);


  const startSession = async (id) => {
    try {
      await API.post(`/appointments/start/${id}`);
      fetchAppointments();
    } catch (err) {
      console.log("Start error:", err.message);
    }
  };


  const pending = appointments.filter((a) => a.status === "pending");

  const scheduled = appointments.filter(
    (a) => a.status === "accepted" || a.status === "scheduled"
  );


  const renderAppointment = (appt) => {
    const slotTime = new Date(appt.timeSlot);
    const now = currentTime;

    const canStart = now >= slotTime;

    const minutesLeft = Math.max(
      0,
      Math.floor((slotTime - now) / 60000)
    );

    return (
      <div key={appt._id} style={card}>
        <p><b>Doctor:</b> {appt.doctorId?.name || "N/A"}</p>
        <p><b>Time:</b> {slotTime.toLocaleString()}</p>
        <p><b>Status:</b> {appt.status}</p>

      
        {appt.status === "pending" && (
          <p style={{ color: "orange" }}>
            Waiting for doctor...
          </p>
        )}

      
        {(appt.status === "accepted" || appt.status === "scheduled") && (
          <button
            disabled={!canStart}
            onClick={() => startSession(appt._id)}
          >
            {canStart
              ? "Start Call"
              : `Starts in ${minutesLeft} min`}
          </button>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      
      <div style={left}>
        <h3>Available Doctors</h3>

        {doctors.length === 0 ? (
          <p>No doctors available</p>
        ) : (
          doctors.map((doc) => (
            <DoctorCard key={doc._id} doctor={doc} />
          ))
        )}
      </div>

    
      <div style={right}>
        <h3>Appointments</h3>

    
        <h4>🟡 Pending</h4>
        {pending.length === 0 ? (
          <p>No pending</p>
        ) : (
          pending.map(renderAppointment)
        )}

      
        <h4>🔵 Scheduled</h4>
        {scheduled.length === 0 ? (
          <p>No scheduled</p>
        ) : (
          scheduled.map(renderAppointment)
        )}
      </div>
    </div>
  );
};

const left = {
  width: "30%",
  padding: "20px",
  borderRight: "1px solid #ccc",
};

const right = {
  width: "70%",
  padding: "20px",
  background: "#f5f7fa",
};

const card = {
  border: "1px solid #ccc",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  background: "#fff",
};

export default Dashboard;