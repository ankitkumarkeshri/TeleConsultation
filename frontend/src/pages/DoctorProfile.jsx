import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");

  // 🔥 Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await API.get(`/users/${id}`);
        setDoctor(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctor();
  }, [id]);

  // 🔥 Book appointment
  const bookAppointment = async () => {
    try {
      if (!date) {
        alert("Please select date & time");
        return;
      }

      const res = await API.post("/appointments", {
        doctor: id, // ✅ matches backend controller
        date,
      });

      const appointmentId = res.data.appointment._id;

      // 👉 Navigate to chat room
      navigate(`/chat/${appointmentId}`);
    } catch (err) {
      console.log(err);
    }
  };

  if (!doctor) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{doctor.name}</h2>
      <p>Role: {doctor.role}</p>

      <h3>Book Appointment</h3>

      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <br /><br />

      <button onClick={bookAppointment}>
        Book & Start Chat
      </button>
    </div>
  );
}

export default DoctorProfile;