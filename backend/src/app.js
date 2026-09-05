const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const fileRoutes = require("./routes/file.routes");
const folderRoutes = require("./routes/folder.routes");
const searchRoutes = require("./routes/search.routes");
const starRoutes = require("./routes/star.routes");
const shareRoutes = require("./routes/share.routes");
const linkShareRoutes = require("./routes/linkShare.routes");
const ApiError = require("./utils/ApiError");
const activityRoutes = require("./routes/activity.routes");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/stars", starRoutes);
app.use("/api/shares", shareRoutes);
app.use("/api/links", linkShareRoutes);
app.use("/api/activities", activityRoutes);

app.use((req, res, next) => {
  next(new ApiError(404, "Route " + req.originalUrl + " not found"));
});

app.use((err, req, res, next) => {
  console.error("Error:", {
    message: err.message,
    statusCode: err.statusCode || 500,
    path: req.path,
    method: req.method,
  });

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
