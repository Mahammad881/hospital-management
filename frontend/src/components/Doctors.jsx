import { useEffect, useState, useCallback } from "react";
import API from "../services/api";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // Fetch Doctors
  // ===============================
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      setError("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

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
  // Add Doctor
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/doctors", formData);

      // Add new doctor directly to state (no refetch needed)
      setDoctors((prev) => [...prev, res.data]);

      // Reset form
      setFormData({
        name: "",
        department: "",
      });

      alert("Doctor added successfully");
    } catch (error) {
      console.error("Failed to add doctor:", error);
      alert("Only admin can add doctors");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Doctors Management</h2>

      {/* Add Doctor Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Doctor Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Add Doctor
        </button>
      </form>

      {/* Loading / Error */}
      {loading && <p>Loading doctors...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Doctors Table */}
      {!loading && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.department}</td>
                  <td>{doctor.availability || "Available"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No doctors found
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
// Simple Professional Styling
// ===============================
const styles = {
  container: {
    padding: "30px",
  },
  title: {
    marginBottom: "20px",
  },
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
  button: {
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
};

export default Doctors;