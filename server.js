import express from "express";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import doctorRoutes from "./src/routes/doctorRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import consultationRoutes from "./src/routes/consultationRoutes.js";
import logger from "./src/config/logger.js";
import metricsClient from "./src/config/metrics.js";
import morgan from "morgan";


import "./src/models/user.js";

const app = express();
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/consultation", consultationRoutes);

app.use(morgan("combined"));


app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", metricsClient.register.contentType);
  res.end(await metricsClient.register.metrics());
});

connectDB();

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
