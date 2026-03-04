import { useNavigate } from "react-router-dom";

function ReceptionDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "30px" }}>
      <h2>Receptionist Dashboard</h2>
      <p>Welcome Receptionist 🧑‍💼</p>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => navigate("/patients")}
          style={buttonStyle}
        >
          Add / Manage Patients
        </button>

        <button
          onClick={() => navigate("/appointments")}
          style={{ ...buttonStyle, marginLeft: "10px" }}
        >
          Manage Appointments
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#1cc88a",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default ReceptionDashboard;