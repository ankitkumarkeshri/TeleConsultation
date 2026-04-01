import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Fetch logged-in user profile
  const fetchUser = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data.user);

      // also store locally (useful for navbar etc.)
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (error) {
      setError("Failed to fetch user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Dashboard</h2>

        {error && <p style={styles.error}>{error}</p>}

        {user ? (
          <>
            {/* USER INFO */}
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>

            {/* ROLE BASED UI */}
            {user.role === "doctor" ? (
              <DoctorSection navigate={navigate} />
            ) : (
              <PatientSection navigate={navigate} />
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
// 🔵 DOCTOR SECTION
//
const DoctorSection = ({ navigate }) => {
  return (
    <div style={styles.section}>
      <h3>🩺 Doctor Panel</h3>

      <ul>
        <li>📋 View incoming appointments</li>
        <li>💬 Join patient chats</li>
        <li>🟢 Manage availability</li>
      </ul>

      <button
        style={styles.buttonSecondary}
        onClick={() => navigate("/appointments")}
      >
        View Appointments
      </button>
    </div>
  );
};

//
// 🟢 PATIENT SECTION
//
const PatientSection = ({ navigate }) => {
  return (
    <div style={styles.section}>
      <h3>🧑‍⚕️ Patient Panel</h3>

      <ul>
        <li>📅 Book appointments</li>
        <li>📋 View my appointments</li>
        <li>💬 Chat with doctors</li>
      </ul>

      <button
        style={styles.buttonSecondary}
        onClick={() => navigate("/")}
      >
        Browse Doctors
      </button>
    </div>
  );
};

//
// 🎨 STYLES
//
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
  card: {
    padding: "25px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    width: "350px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  section: {
    marginTop: "20px",
    padding: "10px",
    borderTop: "1px solid #ddd",
  },
  button: {
    marginTop: "15px",
    padding: "10px",
    background: "#111",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  buttonSecondary: {
    marginTop: "10px",
    padding: "8px",
    background: "#ccc",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
};