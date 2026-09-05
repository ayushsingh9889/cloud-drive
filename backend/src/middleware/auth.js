const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "No token provided. Please login.");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "No token provided. Please login.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(new ApiError(401, "Invalid token. Please login again."));
    } else if (error.name === "TokenExpiredError") {
      next(new ApiError(401, "Token expired. Please login again."));
    } else {
      next(error);
    }
  }
};

module.exports = authMiddleware;
