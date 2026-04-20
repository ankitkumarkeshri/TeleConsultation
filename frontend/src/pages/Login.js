import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data); // 🔥 DEBUG

      const token = res.data?.token;
      const user = res.data?.user;

    
      if (!token || !user) {
        alert("Invalid login response from server");
        return;
      }

    
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful");

      
      if (user.role === "doctor") {
        navigate("/doctor/requests");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
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
          Login
        </h2>

        <input
          placeholder="Email"
          style={inputStyle}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          style={inputStyle}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
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
          Login
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

export default Login;