import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>TeleConsultation</h2>

      <div style={styles.links}>
        {/* Logged OUT */}
        {!user && (
          <>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}

        {/* Logged IN */}
        {user && (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>

            {/* Role-based UI */}
            {user.role === "doctor" && (
              <span style={styles.badge}>Doctor Mode</span>
            )}

            {user.role === "patient" && (
              <span style={styles.badge}>Patient Mode</span>
            )}

            {/* Profile Dropdown */}
            <div style={styles.profile}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={styles.profileBtn}
              >
                Hi, {user.name} ⬇️
              </button>

              {dropdownOpen && (
                <div style={styles.dropdown}>
                  <p style={styles.dropdownItem}>{user.email}</p>
                  <button onClick={handleLogout} style={styles.logoutBtn}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    background: "#111",
    color: "#fff",
  },
  logo: {
    margin: 0,
    fontSize: "20px",
  },
  links: {
    display: "flex",
    gap: "18px",
    alignItems: "center",
  },
  link: {
    color: "#ccc",
    textDecoration: "none",
  },
  badge: {
    background: "#333",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
  },
  profile: {
    position: "relative",
  },
  profileBtn: {
    background: "#222",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    top: "35px",
    right: "0",
    background: "#fff",
    color: "#000",
    padding: "10px",
    borderRadius: "6px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  dropdownItem: {
    margin: "5px 0",
  },
  logoutBtn: {
    marginTop: "5px",
    padding: "6px 10px",
    background: "red",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default Navbar;