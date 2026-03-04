require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const patientRoutes = require("./routes/patients");
const doctorRoutes = require("./routes/doctors");
const appointmentRoutes = require("./routes/appointments");
const billingRoutes = require("./routes/billing");
const medicalRoutes = require("./routes/medicalRecords");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/medical-records", medicalRoutes);
app.use("/api/dashboard", dashboardRoutes);

// IMPORTANT FOR DEPLOYMENT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});