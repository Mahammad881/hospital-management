import { useEffect, useState } from "react";
import API from "../services/api";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    patient_id: "",
    department: "",
    appointment_date: "",
    appointment_time: "",
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/appointments");
      setAppointments(
        Array.isArray(res.data)
          ? res.data
          : res.data.appointments || []
      );
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await API.get("/patients");
      setPatients(
        Array.isArray(res.data)
          ? res.data
          : res.data.patients || []
      );
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctors");
      const doctorsData = Array.isArray(res.data)
        ? res.data
        : res.data.doctors || [];
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const departments = [
    ...new Set(doctors.map((doc) => doc.department)),
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/appointments", formData);

      alert("Appointment created successfully");

      setFormData({
        patient_id: "",
        department: "",
        appointment_date: "",
        appointment_time: "",
      });

      fetchAppointments();
    } catch (error) {
      console.error("Failed to create appointment:", error);
      alert(error.response?.data?.message || "Error creating appointment");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Appointments Management</h2>

      {/* ================= Add Appointment Form ================= */}
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Patient */}
        <select
          name="patient_id"
          value={formData.patient_id}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Department */}
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">Select Department</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Date */}
        <input
          type="date"
          name="appointment_date"
          value={formData.appointment_date}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {/* Time */}
        <input
          type="time"
          name="appointment_time"
          value={formData.appointment_time}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Add Appointment
        </button>
      </form>

      {/* ================= Appointments Table ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="10" style={styles.table}>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.patient_name}</td>
                  <td>{a.doctor_name}</td>
                  <td>
                    {new Date(a.appointment_date).toLocaleDateString()}
                  </td>
                  <td>{a.appointment_time}</td>
                  <td>{a.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" align="center">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

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

export default Appointments;