const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

// =====================================================
// 1️⃣ GET ALL DOCTORS (Admin + Receptionist)
// =====================================================
router.get(
  "/",
  verifyToken,
authorizeRole(["admin", "receptionist", "doctor"]),
  async (req, res) => {
    try {
      const [rows] = await db.query(
        "SELECT id, name, department, availability FROM doctors"
      );

      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// =====================================================
// 2️⃣ GET SINGLE DOCTOR (Admin Only)
// =====================================================
router.get(
  "/:id",
  verifyToken,
  authorizeRole(["admin", "receptionist", "doctor"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await db.query(
        "SELECT id, name, department, availability FROM doctors WHERE id = ?",
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// =====================================================
// 3️⃣ ADD DOCTOR (Admin Only)
// =====================================================
router.post(
  "/",
  verifyToken,
  authorizeRole(["admin", "receptionist", "doctor"]),
  async (req, res) => {
    try {
      const { name, department } = req.body;

      if (!name || !department) {
        return res.status(400).json({ message: "Name and department are required" });
      }

      await db.query(
        "INSERT INTO doctors (name, department, availability) VALUES (?, ?, 'Available')",
        [name, department]
      );

      res.json({ message: "Doctor added successfully" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// =====================================================
// 4️⃣ UPDATE DOCTOR (Admin Only)
// =====================================================
router.put(
  "/:id",
  verifyToken,
  authorizeRole(["admin", "receptionist", "doctor"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, department, availability } = req.body;

      await db.query(
        "UPDATE doctors SET name = ?, department = ?, availability = ? WHERE id = ?",
        [name, department, availability, id]
      );

      res.json({ message: "Doctor updated successfully" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// =====================================================
// 5️⃣ DELETE DOCTOR (Admin Only)
// =====================================================
router.delete(
  "/:id",
  verifyToken,
  authorizeRole(["admin", "receptionist", "doctor"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      await db.query(
        "DELETE FROM doctors WHERE id = ?",
        [id]
      );

      res.json({ message: "Doctor deleted successfully" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// =====================================================
// 6️⃣ DOCTOR UPDATE OWN AVAILABILITY
// =====================================================
router.put(
  "/availability",
  verifyToken,
  authorizeRole(["admin", "receptionist", "doctor"]),
  async (req, res) => {
    try {
      const { availability } = req.body;
      const doctorId = req.user.id;

      if (!["Available", "Busy"].includes(availability)) {
        return res.status(400).json({ message: "Invalid availability value" });
      }

      await db.query(
        "UPDATE doctors SET availability = ? WHERE id = ?",
        [availability, doctorId]
      );

      res.json({ message: "Availability updated successfully" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;