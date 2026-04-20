import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    role: "patient",
  });

  const register = async () => {
    try {
      await API.post("/auth/register", data);

      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Registration failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f7fa",
      }}
    >
      <div
        style={{
          width: "320px",
          padding: "30px",
          borderRadius: "10px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          Register
        </h2>

        <input
          placeholder="Name"
          style={inputStyle}
          onChange={(e) =>
            setData({ ...data, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          style={inputStyle}
          onChange={(e) =>
            setData({ ...data, email: e.target.value })
          }
        />

        <input
          placeholder="Password"
          type="password"
          style={inputStyle}
          onChange={(e) =>
            setData({ ...data, password: e.target.value })
          }
        />

        <select
          style={inputStyle}
          onChange={(e) =>
            setData({ ...data, role: e.target.value })
          }
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <button
          onClick={register}
          style={{
            padding: "10px",
            backgroundColor: "#2c3e50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

export default Register;