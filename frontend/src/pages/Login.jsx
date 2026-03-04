import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://hospital-backend-4gl5.onrender.com/api/auth";

function Login({ setToken }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/login`, formData);

      const { token, role } = data;

      if (!token || !role) {
        throw new Error("Invalid server response");
      }

      // Save authentication
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setToken(token);

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Hospital Management Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #4e73df, #1cc88a)",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    width: "360px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4e73df",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    textAlign: "center",
  },
};

export default Login;