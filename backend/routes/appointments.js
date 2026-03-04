const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

// =====================================================
// 1️⃣ GET ALL APPOINTMENTS (Admin + Receptionist)
// =====================================================
router.get(
  "/",
  verifyToken,
  authorizeRole(["admin", "receptionist"]),
  async (req, res) => {
    try {
      const { doctor_id, date, patient_name, status } = req.query;

      let query = `
        SELECT
          appointments.id,
          patients.name AS patient_name,
          doctors.name AS doctor_name,
          appointment_date,
          appointment_time,
          status
        FROM appointments
        JOIN patients ON appointments.patient_id = patients.id
        JOIN doctors ON appointments.doctor_id = doctors.id
        WHERE 1=1
      `;

      let values = [];

      if (doctor_id) {
        query += " AND appointments.doctor_id = ?";
        values.push(doctor_id);
      }

      if (date) {
        query += " AND appointment_date = ?";
        values.push(date);
      }

      if (patient_name) {
        query += " AND patients.name LIKE ?";
        values.push(`%${patient_name}%`);
      }

      if (status) {
        query += " AND appointments.status = ?";
        values.push(status);
      }

      const [rows] = await db.query(query, values);
      res.json(rows);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// =====================================================
// 2️⃣ DOCTOR DASHBOARD (Only Logged-in Doctor)
// =====================================================
router.get(
  "/doctor",
  verifyToken,
  authorizeRole(["doctor"]),
  async (req, res) => {
    try {
      const doctorId = req.user.id;

      const [rows] = await db.query(`
        SELECT
          appointments.id,
          patients.name AS patient_name,
          appointment_date,
          appointment_time,
          status
        FROM appointments
        JOIN patients ON appointments.patient_id = patients.id
        WHERE appointments.doctor_id = ?
      `, [doctorId]);

      res.json(rows);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// =====================================================
// 3️⃣ CREATE APPOINTMENT (Auto Doctor Assign)
// =====================================================
router.post(
  "/",
  verifyToken,
  authorizeRole(["admin", "receptionist"]),
  async (req, res) => {
    try {
      const { patient_id, department, appointment_date, appointment_time } = req.body;

      if (!patient_id || !department || !appointment_date || !appointment_time) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const today = new Date().toISOString().split("T")[0];
      if (appointment_date < today) {
        return res.status(400).json({ message: "Cannot book past appointments" });
      }

      const [doctor] = await db.query(
        "SELECT * FROM doctors WHERE department = ? AND availability = 'Available' LIMIT 1",
        [department]
      );

      if (doctor.length === 0) {
        return res.status(400).json({ message: "No doctor available" });
      }

      const doctor_id = doctor[0].id;

      await db.query(
        `INSERT INTO appointments
         (patient_id, doctor_id, appointment_date, appointment_time, status)
         VALUES (?, ?, ?, ?, 'Scheduled')`,
        [patient_id, doctor_id, appointment_date, appointment_time]
      );

      await db.query(
        "UPDATE doctors SET availability = 'Busy' WHERE id = ?",
        [doctor_id]
      );

      res.json({ message: "Appointment created & doctor auto-assigned" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// =====================================================
// 4️⃣ UPDATE STATUS (Free Doctor)
// =====================================================
router.put(
  "/:id/status",
  verifyToken,
  authorizeRole(["admin", "doctor"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatus = ["Scheduled", "Completed", "Cancelled"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const [appointment] = await db.query(
        "SELECT doctor_id FROM appointments WHERE id = ?",
        [id]
      );

      if (appointment.length === 0) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      await db.query(
        "UPDATE appointments SET status = ? WHERE id = ?",
        [status, id]
      );

      if (status === "Completed") {
        await db.query(
          "UPDATE doctors SET availability = 'Available' WHERE id = ?",
          [appointment[0].doctor_id]
        );
      }

      res.json({ message: "Appointment updated" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// =====================================================
// 5️⃣ DELETE APPOINTMENT (Admin Only)
// =====================================================
router.delete(
  "/:id",
  verifyToken,
  authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      await db.query(
        "DELETE FROM appointments WHERE id = ?",
        [id]
      );

      res.json({ message: "Appointment deleted successfully" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;