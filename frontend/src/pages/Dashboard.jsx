import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/dashboard/stats");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div style={styles.container}>Loading dashboard...</div>;
  }

  if (error) {
    return <div style={styles.container}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Dashboard</h2>

      <p style={styles.role}>
        Logged in as: <strong>{role?.toUpperCase()}</strong>
      </p>

      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h3>Total Patients</h3>
          <p style={styles.number}>{stats.patients}</p>
        </div>

        <div style={styles.card}>
          <h3>Total Doctors</h3>
          <p style={styles.number}>{stats.doctors}</p>
        </div>

        <div style={styles.card}>
          <h3>Total Appointments</h3>
          <p style={styles.number}>{stats.appointments}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
  },
  title: {
    marginBottom: "10px",
  },
  role: {
    marginBottom: "20px",
    color: "#555",
  },
  cardContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  card: {
    flex: "1",
    minWidth: "220px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  number: {
    fontSize: "28px",
    fontWeight: "bold",
    marginTop: "10px",
    color: "#4e73df",
  },
};

export default Dashboard;