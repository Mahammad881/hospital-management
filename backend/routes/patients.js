const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

// =====================================================
// GET PATIENTS (Search + Pagination + Doctor Filter)
// =====================================================
// =====================================================
// GET PATIENTS (With Doctor Name)
// =====================================================
router.get("/", verifyToken, async (req, res) => {
  try {
    const { search = "", page = 1, limit = 5 } = req.query;

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        patients.id,
        patients.name,
        patients.age,
        patients.gender,
        patients.phone,
        patients.doctor_id,
        doctors.name AS doctor_name
      FROM patients
      LEFT JOIN doctors 
        ON patients.doctor_id = doctors.id
      WHERE patients.name LIKE ?
    `;

    let countQuery = `
      SELECT COUNT(*) as total 
      FROM patients
      WHERE name LIKE ?
    `;

    let values = [`%${search}%`];

    if (req.user.role === "doctor") {
      query += " AND patients.doctor_id = ?";
      countQuery += " AND doctor_id = ?";
      values.push(req.user.id);
    }

    query += " LIMIT ? OFFSET ?";
    values.push(Number(limit), Number(offset));

    const [patients] = await db.query(query, values);
    const [countResult] = await db.query(
      countQuery,
      values.slice(0, values.length - 2),
    );

    const totalPages = Math.ceil(countResult[0].total / limit);

    res.json({
      patients,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// =====================================================
// ADD PATIENT (Receptionist Only)
// =====================================================
router.post(
  "/",
  verifyToken,
  authorizeRole(["receptionist"]),
  async (req, res) => {
    try {
      const { name, age, gender, phone, doctor_id } = req.body;

      if (!name || !age || !gender || !phone || !doctor_id) {
        return res.status(400).json({ message: "All fields required" });
      }

      await db.query(
        "INSERT INTO patients (name, age, gender, phone, doctor_id) VALUES (?, ?, ?, ?, ?)",
        [name, age, gender, phone, doctor_id],
      );

      res.status(201).json({ message: "Patient added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
);

// =====================================================
// UPDATE PATIENT (Admin + Receptionist)
// =====================================================
// =====================================================
// UPDATE PATIENT (Admin + Receptionist)
// =====================================================
router.put(
  "/:id",
  verifyToken,
  authorizeRole(["admin", "receptionist"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, age, gender, phone, doctor_id } = req.body;

      await db.query(
        `UPDATE patients 
   SET name='${name}', age='${age}', gender='${gender}', phone='${phone}', doctor_id='${doctor_id}'
   WHERE id='${id}'`,
      );

      res.json({ message: "Patient updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
);

// =====================================================
// DELETE PATIENT (Admin Only)
// =====================================================
router.delete(
  "/:id",
  verifyToken,
  authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const [result] = await db.query("DELETE FROM patients WHERE id = ?", [
        id,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Patient not found" });
      }

      res.json({ message: "Patient deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
);

module.exports = router;
