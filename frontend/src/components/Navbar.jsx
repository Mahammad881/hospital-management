import { Link, useNavigate } from "react-router-dom";

function Navbar({ setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token & role
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Update React state
    setToken(null);

    // Redirect to login
    navigate("/");
  };

  return (
    <nav className="navbar" style={styles.nav}>
      <h2>Hospital System</h2>

      <div style={styles.links}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/patients">Patients</Link>
        <Link to="/doctors">Doctors</Link>
        <Link to="/appointments">Appointments</Link>
        <Link to="/billing">Billing</Link>
        <Link to="/medical-records">Medical Records</Link>

        {/* Logout Button */}
        <button onClick={handleLogout} style={styles.button}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#4e73df",
    color: "white",
  },
  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  button: {
    padding: "6px 12px",
    border: "none",
    backgroundColor: "white",
    color: "#4e73df",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Navbar;