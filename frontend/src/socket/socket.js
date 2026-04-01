import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: false, // ✅ manual control
  auth: {
    token: localStorage.getItem("token"),
  },
});

// ✅ Function to connect socket (call after login)
export const connectSocket = () => {
  const token = localStorage.getItem("token");

  socket.auth = { token };
  socket.connect();
};

// ✅ Function to disconnect socket (on logout)
export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket;