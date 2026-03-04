const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

// =============================
// CREATE MEDICAL RECORD
// =============================
router.post("/", verifyToken, async (req, res) => {
  try {
    console.log("BODY:", req.body);   // 👈 ADD THIS

    const { appointment_id, diagnosis, prescription, notes } = req.body;

    await db.query(
      `INSERT INTO medical_records
       (appointment_id, diagnosis, prescription, notes)
       VALUES (?, ?, ?, ?)`,
      [appointment_id, diagnosis, prescription, notes]
    );

    res.json({ message: "Medical record created successfully" });
  } catch (err) {
    console.error("INSERT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// =============================
// GET ALL MEDICAL RECORDS
// =============================
router.get("/", verifyToken, async (req, res) => {
  try {
    const { search = "" } = req.query;

    let query = `
      SELECT
        patients.id AS patient_id,
        patients.name AS patient_name,
        patients.phone,
        appointments.id AS appointment_id,
        doctors.name AS doctor_name,
        appointments.appointment_date,
        medical_records.id AS record_id,
        medical_records.diagnosis,
        medical_records.prescription,
        medical_records.notes
      FROM patients
      LEFT JOIN appointments
        ON appointments.patient_id = patients.id
      LEFT JOIN doctors
        ON appointments.doctor_id = doctors.id
      LEFT JOIN medical_records
        ON medical_records.appointment_id = appointments.id
      WHERE patients.name LIKE ?
    `;

    const params = [`%${search}%`];

    if (req.user && req.user.role === "doctor") {
      query += " AND appointments.doctor_id = ?";
      params.push(req.user.id);
    }

    query += " ORDER BY patients.id DESC";

    const [rows] = await db.query(query, params);

    res.json(rows);

  } catch (err) {
    console.error("Medical Records Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// =============================
// UPDATE
// =============================
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid record ID" });
    }

    const { diagnosis, prescription, notes } = req.body;

    await db.query(
      `UPDATE medical_records
       SET diagnosis = ?, prescription = ?, notes = ?
       WHERE id = ?`,
      [diagnosis, prescription, notes, id]
    );

    res.json({ message: "Medical record updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// =============================
// DELETE
// =============================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await db.query("DELETE FROM medical_records WHERE id = ?", [req.params.id]);

    res.json({ message: "Medical record deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
