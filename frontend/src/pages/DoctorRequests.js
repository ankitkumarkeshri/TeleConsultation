import React, { useEffect, useState } from "react";
import API from "../api/axios";
import socket from "../socket/socket";

const DoctorRequests = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/doctor");
      console.log("DOCTOR APPOINTMENTS:", res.data);
      setAppointments(res.data || []);
    } catch (err) {
      console.log("Fetch error:", err.message);
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchAppointments();

    // join socket
    if (user?._id) {
      socket.emit("join-user", {
        userId: user._id,
        role: "doctor",
      });
    }

    socket.on("appointment:new", fetchAppointments);
    socket.on("session:update", fetchAppointments);

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      socket.off("appointment:new", fetchAppointments);
      socket.off("session:update", fetchAppointments);
      clearInterval(interval);
    };
  }, []);

  const accept = async (id) => {
    try {
      await API.post(`/appointments/accept/${id}`);
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const startSession = async (id) => {
    try {
      await API.post(`/appointments/start/${id}`);
      fetchAppointments();
    } catch (err) {
      console.log(err.message);
    }
  };


  const pending = appointments.filter(a => a.status === "pending");
  const scheduled = appointments.filter(
    a => a.status === "accepted" || a.status === "scheduled"
  );
  const inCall = appointments.filter(a => a.status === "in-call");

  const renderCard = (appt) => {
    const slotTime = new Date(appt.timeSlot);
    const now = currentTime;

    const canStart = now >= slotTime;
    const minutesLeft = Math.max(
      0,
      Math.floor((slotTime - now) / 60000)
    );

    return (
      <div key={appt._id} style={card}>
        <p><b>Patient:</b> {appt.patientId?.name}</p>
        <p><b>Time:</b> {slotTime.toLocaleString()}</p>
        <p><b>Status:</b> {appt.status}</p>

        
        {appt.status === "pending" && (
          <button onClick={() => accept(appt._id)}>
            Accept
          </button>
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

      
        {appt.status === "in-call" && (
          <p style={{ color: "green" }}>In Call</p>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Doctor Panel</h2>

      
      <h3>🟡 Pending Requests</h3>
      {pending.length === 0 ? (
        <p>No pending</p>
      ) : (
        pending.map(renderCard)
      )}

      
      <h3>🔵 Scheduled</h3>
      {scheduled.length === 0 ? (
        <p>No scheduled</p>
      ) : (
        scheduled.map(renderCard)
      )}

  
      <h3>🟢 In Call</h3>
      {inCall.length === 0 ? (
        <p>No active calls</p>
      ) : (
        inCall.map(renderCard)
      )}
    </div>
  );
};

const card = {
  border: "1px solid #ccc",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  background: "#fff",
};

export default DoctorRequests;