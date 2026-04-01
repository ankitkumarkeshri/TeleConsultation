import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Fetch user
  const fetchUser = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (error) {
      setError("Failed to fetch user");
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/my");
      setAppointments(res.data.appointments);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchAppointments();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Dashboard</h2>

        {error && <p style={styles.error}>{error}</p>}

        {user ? (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>

            <h3>📋 Appointments</h3>

            {appointments.length === 0 ? (
              <p>No appointments found</p>
            ) : (
              appointments.map((appt) => (
                <div key={appt._id} style={styles.cardItem}>
                  
                  {/* Doctor view */}
                  {user.role === "doctor" ? (
                    <p>
                      <strong>Patient:</strong> {appt.patient?.name}
                    </p>
                  ) : (
                    <p>
                      <strong>Doctor:</strong> {appt.doctor?.name}
                    </p>
                  )}

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(appt.date).toLocaleString()}
                  </p>

                  <p>
                    <strong>Status:</strong> {appt.status}
                  </p>

                  <button
                    style={styles.smallBtn}
                    onClick={() => navigate(`/chat/${appt._id}`)}
                  >
                    Join Chat
                  </button>
                </div>
              ))
            )}

            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <p>Loading user...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

//
// 🎨 STYLES
//
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
  },
  card: {
    padding: "25px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    width: "400px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  cardItem: {
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "6px",
    marginTop: "10px",
  },
  button: {
    marginTop: "15px",
    padding: "10px",
    background: "#111",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  smallBtn: {
    marginTop: "8px",
    padding: "6px",
    background: "#333",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
};