import { useEffect, useState, useCallback } from "react";
import API from "../services/api";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    doctor_id: "",
  });

  // ===============================
  // Fetch Patients
  // ===============================
  const fetchPatients = useCallback(async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await API.get(`/patients?page=${pageNumber}&limit=5`);

      setPatients(res.data.patients || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(pageNumber);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      setError("Failed to load patients");
    } finally {
      setLoading(false);
    }
  }, []);

  // ===============================
  // Fetch Doctors
  // ===============================
  const fetchDoctors = useCallback(async () => {
    try {
      const res = await API.get("/doctors");
      setDoctors(res.data || []);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, [fetchPatients, fetchDoctors]);

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
  // Add Patient
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/patients", formData);

      alert("Patient added successfully");

      setFormData({
        name: "",
        age: "",
        gender: "",
        phone: "",
        doctor_id: "",
      });

      fetchPatients(page);
    } catch (error) {
      console.error("Failed to add patient:", error);
      alert("Failed to add patient");
    }
  };

  // ===============================
  // Update Patient
  // ===============================
  // ===============================
  // Update Patient (All Fields)
  // ===============================
  const handleUpdate = async (patient) => {
    const newName = prompt("Enter new name:", patient.name);
    if (!newName) return;

    const newAge = prompt("Enter new age:", patient.age);
    if (!newAge) return;

    const newGender = prompt("Enter new gender (Male/Female):", patient.gender);
    if (!newGender) return;

    const newPhone = prompt("Enter new phone:", patient.phone);
    if (!newPhone) return;

    const newDoctorId = prompt("Enter new doctor ID:", patient.doctor_id);
    if (!newDoctorId) return;

    try {
      await API.put(`/patients/${patient.id}`, {
        name: newName,
        age: newAge,
        gender: newGender,
        phone: newPhone,
        doctor_id: newDoctorId,
      });

      alert("Patient updated successfully");
      fetchPatients(page);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update patient");
    }
  };
  // ===============================
  // Delete Patient
  // ===============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/patients/${id}`);
      fetchPatients(page);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete patient");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Patients Management</h2>

      {/* ================= Form ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Patient Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="doctor_id"
          value={formData.doctor_id}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} ({doctor.department})
            </option>
          ))}
        </select>

        <button type="submit" style={styles.button}>
          Add Patient
        </button>
      </form>

      {/* ================= Table ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Doctor</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.doctor_name || "Not Assigned"}</td>
                  <td>
                    <button
                      onClick={() => handleUpdate(patient)}
                      style={{
                        marginRight: "5px",
                        backgroundColor: "green",
                        color: "#fff",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Update
                    </button>

                    <button
                      onClick={() => handleDelete(patient.id)}
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
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* ================= Pagination ================= */}
      <div style={{ marginTop: "15px" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => fetchPatients(i + 1)}
            disabled={page === i + 1}
            style={{
              marginRight: "5px",
              backgroundColor: page === i + 1 ? "#4e73df" : "#ccc",
              color: page === i + 1 ? "#fff" : "#000",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

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
  button: {
    padding: "8px 15px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#4e73df",
    color: "#fff",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "5px 10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "red",
    color: "#fff",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default Patients;
