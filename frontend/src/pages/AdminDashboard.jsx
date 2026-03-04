import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "30px" }}>
      <h2>Admin Dashboard</h2>
      <p>Welcome Admin 👨‍💼</p>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => navigate("/doctors")}
          style={buttonStyle}
        >
          Manage Doctors
        </button>

        <button
          onClick={() => navigate("/patients")}
          style={{ ...buttonStyle, marginLeft: "10px" }}
        >
          Manage Patients
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#4e73df",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default AdminDashboard;