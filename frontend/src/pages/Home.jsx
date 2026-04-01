import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import socket, { useSocket } from "../socket/useSocket";

function Home() {
    // Dummy doctors (later API se aayega)
    const doctors = [
        { id: "1", name: "Dr. Sharma", specialty: "Cardiologist" },
        { id: "2", name: "Dr. Gupta", specialty: "Dermatologist" },
        { id: "3", name: "Dr. Khan", specialty: "General Physician" },
    ];

    const [onlineUsers, setOnlineUsers] = useState([]);

    // 🔥 Listen online users from socket
    useSocket("online_users", (users) => {
        setOnlineUsers(users);
    });

    // 🔥 Ensure socket joins (optional safety)
    useEffect(() => {
        socket.connect();
    }, []);

    return (
        <div style={styles.container}>

            {/* HERO SECTION */}
            <section style={styles.hero}>
                <h1>TeleConsultation Platform</h1>
                <p>
                    Connect with verified doctors online. Book appointments and chat in real-time.
                </p>

                <div style={styles.heroButtons}>
                    <Link to="/register" style={styles.primaryBtn}>
                        Get Started
                    </Link>
                    <Link to="/login" style={styles.secondaryBtn}>
                        Login
                    </Link>
                </div>
            </section>

            {/* FEATURES */}
            <section style={styles.features}>
                <h2>Features</h2>
                <ul>
                    <li>📅 Book appointments easily</li>
                    <li>💬 Real-time chat with doctors</li>
                    <li>📞 Video consultation (coming soon)</li>
                    <li>🔒 Secure authentication</li>
                </ul>
            </section>

            {/* DOCTORS LIST */}
            <section style={styles.doctors}>
                <h2>Available Doctors</h2>

                <div style={styles.cardContainer}>
                    {doctors.map((doc) => {
                        const isOnline = onlineUsers.includes(doc.id);

                        return (
                            <div key={doc.id} style={styles.card}>

                                <h3>{doc.name}</h3>
                                <p>{doc.specialty}</p>

                                {/* 🔥 Online Status Badge */}
                                <p>
                                    Status:{" "}
                                    <span style={{ color: isOnline ? "green" : "red" }}>
                                        {isOnline ? "Online 🟢" : "Offline 🔴"}
                                    </span>
                                </p>

                                <Link to={`/doctor/${doc.id}`}>
                                    <button style={styles.cardBtn}>
                                        View Profile
                                    </button>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

const styles = {
    container: {
        padding: "20px",
    },
    hero: {
        textAlign: "center",
        marginBottom: "40px",
    },
    heroButtons: {
        marginTop: "15px",
        display: "flex",
        justifyContent: "center",
        gap: "15px",
    },
    primaryBtn: {
        padding: "10px 15px",
        background: "#111",
        color: "#fff",
        textDecoration: "none",
        borderRadius: "5px",
    },
    secondaryBtn: {
        padding: "10px 15px",
        background: "#ccc",
        color: "#000",
        textDecoration: "none",
        borderRadius: "5px",
    },
    features: {
        marginBottom: "40px",
    },
    doctors: {},
    cardContainer: {
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
    },
    card: {
        border: "1px solid #ccc",
        padding: "15px",
        borderRadius: "8px",
        width: "200px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },
    cardBtn: {
        marginTop: "10px",
        padding: "8px",
        background: "#111",
        color: "#fff",
        border: "none",
        cursor: "pointer",
    },
};

export default Home;