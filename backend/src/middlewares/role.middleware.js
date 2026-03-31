export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      // ensure user exists (must come after protect middleware)
      if (!req.user) {
        return res.status(401).json({
          message: "Not authenticated",
        });
      }

      // check role
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied: insufficient permissions",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };
};