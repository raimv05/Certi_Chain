const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(",") || "*" }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "certificate-registry-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/certificates", certificateRoutes);

app.use((err, _req, res, _next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
    errors: err.errors || undefined,
  });
});

module.exports = app;
