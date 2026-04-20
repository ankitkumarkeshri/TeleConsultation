const jwt = require("jsonwebtoken");
const { redisClient } = require("../config/redis");

exports.protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    // ========================
    // 1. TOKEN CHECK
    // ========================
    if (!token) {
      return res.status(401).json({
        message: "No token, access denied",
      });
    }

    // ========================
    // 2. REMOVE BEARER IF PRESENT
    // ========================
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // ========================
    // 3. VERIFY JWT
    // ========================
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    // ========================
    // 4. REDIS SESSION CHECK (SAFE MODE)
    // ========================
    const sessionKey = `session:${decoded.id}`;
    const session = await redisClient.get(sessionKey);

    // ⚠️ FIX: if Redis down → allow JWT fallback
    if (!session) {
      console.log("⚠️ Redis session missing, fallback to JWT only");

      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      return next();
    }

    // ========================
    // 5. SESSION MATCH CHECK
    // ========================
    if (session !== token) {
      return res.status(401).json({
        message: "Invalid session",
      });
    }

    // ========================
    // 6. ATTACH USER
    // ========================
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.log("Auth Error:", err.message);

    return res.status(401).json({
      message: "Unauthorized access",
    });
  }
};