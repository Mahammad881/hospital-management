const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

// GET Billing
router.get("/", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const [countResult] = await db.query(
      "SELECT COUNT(*) AS total FROM billing"
    );

    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    const [rows] = await db.query(
      `
      SELECT
        billing.id,
        patients.name AS patient_name,
        doctors.name AS doctor_name,
        consultation_fee,
        medicine_cost,
        total_amount,
        billing.payment_status,
        billing.payment_method,
        billing.paid_at,
        billing.created_at
      FROM billing
      JOIN appointments ON billing.appointment_id = appointments.id
      JOIN patients ON appointments.patient_id = patients.id
      JOIN doctors ON appointments.doctor_id = doctors.id
      ORDER BY billing.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    res.json({
      billing: rows,
      totalPages,
      currentPage: page,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE Billing
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      appointment_id,
      consultation_fee,
      medicine_cost,
      payment_method
    } = req.body;

    const total_amount =
      parseFloat(consultation_fee) + parseFloat(medicine_cost);

    await db.query(
      `INSERT INTO billing
      (appointment_id, consultation_fee, medicine_cost, total_amount, payment_status, payment_method)
      VALUES (?, ?, ?, ?, 'Unpaid', ?)`,
      [appointment_id, consultation_fee, medicine_cost, total_amount, payment_method]
    );

    res.json({ message: "Billing created successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// MARK PAID
router.put("/:id/pay", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `UPDATE billing
       SET payment_status = 'Paid',
           paid_at = NOW()
       WHERE id = ?`,
      [id]
    );

    res.json({ message: "Payment marked as Paid" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;