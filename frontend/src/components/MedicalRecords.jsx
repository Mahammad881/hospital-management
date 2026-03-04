import { useEffect, useState } from "react";
import API from "../services/api";

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [creatingAppointmentId, setCreatingAppointmentId] = useState(null);

  const [editData, setEditData] = useState({
    diagnosis: "",
    prescription: "",
    notes: "",
  });

  const [createData, setCreateData] = useState({});

  // ==============================
  // FETCH RECORDS
  // ==============================
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const res = await API.get(`/medical-records?search=${search}`);
        if (!ignore) {
          setRecords(res.data || []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [search]);

  // ==============================
  // DELETE (Optimistic)
  // ==============================
  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Delete this record?")) return;

    setRecords((prev) => prev.filter((r) => r.record_id !== id));

    try {
      await API.delete(`/medical-records/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  // ==============================
  // START EDIT
  // ==============================
  const handleEdit = (record) => {
    if (!record.record_id) return;

    setEditingId(record.record_id);
    setEditData({
      diagnosis: record.diagnosis || "",
      prescription: record.prescription || "",
      notes: record.notes || "",
    });
  };

  // ==============================
  // UPDATE (Optimistic)
  // ==============================
  const handleUpdate = async () => {
    if (!editingId) return;

    setRecords((prev) =>
      prev.map((r) =>
        r.record_id === editingId ? { ...r, ...editData } : r
      )
    );

    try {
      await API.put(`/medical-records/${editingId}`, editData);
    } catch (error) {
      console.error(error);
    }

    setEditingId(null);
    setEditData({
      diagnosis: "",
      prescription: "",
      notes: "",
    });
  };

  // ==============================
  // CREATE (Optimistic)
  // ==============================
  const handleCreate = async (appointment_id) => {
    if (!appointment_id) return;

    const newRecord = {
      appointment_id,
      diagnosis: createData[appointment_id]?.diagnosis || "",
      prescription: createData[appointment_id]?.prescription || "",
      notes: "",
    };

    try {
      const res = await API.post("/medical-records", newRecord);
      setRecords((prev) => [...prev, res.data]);
    } catch (error) {
      console.error(error);
    }

    setCreatingAppointmentId(null);
    setCreateData({});
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Medical Records</h2>

      <input
        type="text"
        placeholder="Search by patient name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", marginBottom: "15px", width: "250px" }}
      />

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Phone</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Diagnosis</th>
            <th>Prescription</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {records.length > 0 ? (
            records.map((r) => (
              <tr key={r.record_id || r.appointment_id || r.patient_id}>
                <td>{r.patient_name}</td>
                <td>{r.phone}</td>
                <td>{r.doctor_name || "No Appointment"}</td>
                <td>{r.appointment_date || "No Date"}</td>

                <td>
                  {r.record_id && editingId === r.record_id ? (
                    <input
                      value={editData.diagnosis}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          diagnosis: e.target.value,
                        })
                      }
                    />
                  ) : (
                    r.diagnosis || "—"
                  )}
                </td>

                <td>
                  {r.record_id && editingId === r.record_id ? (
                    <input
                      value={editData.prescription}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          prescription: e.target.value,
                        })
                      }
                    />
                  ) : (
                    r.prescription || "—"
                  )}
                </td>

                <td>
                  {r.record_id ? (
                    editingId === r.record_id ? (
                      <button onClick={handleUpdate}>Save</button>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(r)}>Edit</button>
                        <button
                          onClick={() => handleDelete(r.record_id)}
                          style={{ marginLeft: "5px", color: "red" }}
                        >
                          Delete
                        </button>
                      </>
                    )
                  ) : r.appointment_id ? (
                    creatingAppointmentId === r.appointment_id ? (
                      <>
                        <input
                          placeholder="Diagnosis"
                          value={createData[r.appointment_id]?.diagnosis || ""}
                          onChange={(e) =>
                            setCreateData({
                              ...createData,
                              [r.appointment_id]: {
                                ...createData[r.appointment_id],
                                diagnosis: e.target.value,
                              },
                            })
                          }
                        />

                        <input
                          placeholder="Prescription"
                          value={
                            createData[r.appointment_id]?.prescription || ""
                          }
                          onChange={(e) =>
                            setCreateData({
                              ...createData,
                              [r.appointment_id]: {
                                ...createData[r.appointment_id],
                                prescription: e.target.value,
                              },
                            })
                          }
                        />

                        <button
                          onClick={() => handleCreate(r.appointment_id)}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          setCreatingAppointmentId(r.appointment_id)
                        }
                      >
                        Create Record
                      </button>
                    )
                  ) : (
                    <span>No Appointment</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" align="center">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MedicalRecords;