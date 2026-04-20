import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100%",
        padding: "15px 30px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      
      <h2
        onClick={() => navigate("/")}
        style={{
          margin: 0,
          cursor: "pointer",
          color: "#2c3e50",
          fontWeight: "bold",
          letterSpacing: "1px",
        }}
      >
        🩺 Teleconsultation
      </h2>
    </div>
  );
};

export default Navbar;