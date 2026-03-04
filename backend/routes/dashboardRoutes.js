const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get("/stats", verifyToken, async (req, res) => {
  try {
    const [[patients]] = await db.query(
      "SELECT COUNT(*) as total FROM patients"
    );

    const [[doctors]] = await db.query(
      "SELECT COUNT(*) as total FROM doctors"
    );

    const [[appointments]] = await db.query(
      "SELECT COUNT(*) as total FROM appointments"
    );

    res.json({
      patients: patients.total,
      doctors: doctors.total,
      appointments: appointments.total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;