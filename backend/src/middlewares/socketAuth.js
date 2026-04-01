import jwt from "jsonwebtoken";

export const authenticateSocket = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user to socket
    socket.user = decoded;

    next();
  } catch (error) {
    console.log("Socket Auth Error:", error.message);
    next(new Error("Authentication error"));
  }
};