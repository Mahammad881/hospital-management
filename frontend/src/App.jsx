import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./components/Patients";
import Doctors from "./components/Doctors";
import Appointments from "./components/Appointments";
import Billing from "./components/Billing";
import MedicalRecords from "./components/MedicalRecords";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      {token && <Navbar setToken={setToken} />}

      <Routes>
        {/* Default Route */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" replace /> : <Login setToken={setToken} />
          }
        />

        {/* Login Route */}
        <Route
          path="/login"
          element={
            token ? <Navigate to="/dashboard" replace /> : <Login setToken={setToken} />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patients"
          element={
            <ProtectedRoute token={token}>
              <Patients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctors"
          element={
            <ProtectedRoute token={token}>
              <Doctors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute token={token}>
              <Appointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/billing"
          element={
            <ProtectedRoute token={token}>
              <Billing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/medical-records"
          element={
            <ProtectedRoute token={token}>
              <MedicalRecords />
            </ProtectedRoute>
          }
        />

        {/* Unknown Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;