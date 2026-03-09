require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db"); 
const authRoutes = require("./routes/auth");
const patientRoutes = require("./routes/patients");
const doctorRoutes = require("./routes/doctors");
const appointmentRoutes = require("./routes/appointments");
const billingRoutes = require("./routes/billing");
const medicalRoutes = require("./routes/medicalRecords");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

/* ✅ FIXED CORS (Handles Preflight Properly) */
app.use(cors());
app.options("*", cors()); // very important for OPTIONS preflight

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/medical-records", medicalRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

db.connect()
  .then(() => console.log("Database connected"))
  .catch(err => console.error("DB connection error:", err));