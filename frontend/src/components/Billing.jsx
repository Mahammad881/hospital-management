import { useEffect, useState, useCallback } from "react";
import API from "../services/api";

function Billing() {
  const [billing, setBilling] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    appointment_id: "",
    consultation_fee: "",
    medicine_cost: "",
    payment_method: "Cash",
  });

  // ===============================
  // Fetch Billing
  // ===============================
  const fetchBilling = useCallback(async () => {
    try {
      setLoading(true);

      const res = await API.get("/billing?page=1&limit=5");

      // ✅ Correct extraction from backend response
      setBilling(res.data.billing || []);
    } catch (err) {
      console.error("Billing fetch error:", err);
      setError("Failed to load billing records");
    } finally {
      setLoading(false);
    }
  }, []);

  // ===============================
  // Fetch Appointments
  // ===============================
  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments");
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Appointment fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBilling();
    fetchAppointments();
  }, [fetchBilling]);

  // ===============================
  // Handle Input Change
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // Add Billing
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/billing", formData);

      alert("Billing added successfully");

      setFormData({
        appointment_id: "",
        consultation_fee: "",
        medicine_cost: "",
        payment_method: "Cash",
      });

      fetchBilling(); // ✅ FIXED
    } catch (error) {
      console.error("Billing create error:", error);
      alert("Failed to create billing");
    }
  };

  // ===============================
  // Delete
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bill?")) return;

    try {
      await API.delete(`/billing/${id}`);
      fetchBilling(); // ✅ FIXED
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ===============================
  // Mark Paid
  // ===============================
  const handlePayment = async (id) => {
    try {
      await API.put(`/billing/${id}/pay`);
      fetchBilling(); // ✅ FIXED
    } catch (error) {
      console.error("Payment update error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Billing Management</h2>

      {/* ================= Add Billing ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <select
          name="appointment_id"
          value={formData.appointment_id}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Patient & Doctor</option>
          {appointments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.patient_name} - {a.doctor_name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="consultation_fee"
          placeholder="Consultation Fee"
          value={formData.consultation_fee}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="number"
          name="medicine_cost"
          placeholder="Medicine Cost"
          value={formData.medicine_cost}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="payment_method"
          value={formData.payment_method}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
        </select>

        <button type="submit" style={styles.addButton}>
          Add Bill
        </button>
      </form>

      {/* ================= Billing Table ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Total</th>
              <th>Status</th>
              <th>Method</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {billing.length > 0 ? (
              billing.map((b) => (
                <tr key={b.id}>
                  <td>{b.patient_name}</td>
                  <td>{b.doctor_name}</td>
                  <td>₹ {b.total_amount}</td>
                  <td>
                    <span
                      style={{
                        color:
                          b.payment_status === "Paid" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {b.payment_status}
                    </span>
                  </td>
                  <td>{b.payment_method || "-"}</td>
                  <td>
                    {b.payment_status === "Unpaid" && (
                      <button
                        onClick={() => handlePayment(b.id)}
                        style={styles.payButton}
                      >
                        Mark Paid
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(b.id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No billing records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
// ===============================
const styles = {
  container: { padding: "30px" },
  title: { marginBottom: "20px" },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  addButton: {
    padding: "8px 15px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#4e73df",
    color: "#fff",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  deleteButton: {
    padding: "5px 10px",
    border: "none",
    backgroundColor: "red",
    color: "#fff",
    borderRadius: "4px",
    marginLeft: "5px",
    cursor: "pointer",
  },
  payButton: {
    padding: "5px 10px",
    border: "none",
    backgroundColor: "green",
    color: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
export default Billing;