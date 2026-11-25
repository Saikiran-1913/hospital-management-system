import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DEFAULT_ADMIN_APPOINTMENTS = [
  {
    id: "demo-1",
    patient: "Lakshmi Devi",
    relation: "Mother",
    doctor: "Dr. Priya Sharma",
    date: "2026-11-28",
    reason: "Diabetes & Thyroid Follow-up",
    allergies: ["Penicillin", "Dust Mites"],
    history: ["Type 2 Diabetes (Managed)"],
    status: "Confirmed",
  },
  {
    id: "demo-2",
    patient: "Suresh Babu",
    relation: "Father",
    doctor: "Dr. Raj Kumar",
    date: "2026-11-30",
    reason: "Blood Pressure & ECG Review",
    allergies: ["Aspirin / Blood Thinners", "Sulfa Drugs"],
    history: ["Mild Hypertension"],
    status: "Confirmed",
  },
  {
    id: "demo-3",
    patient: "Rahul",
    relation: "Self",
    doctor: "Dr. Ramesh Rao",
    date: "2026-12-01",
    reason: "Routine Neurology Check",
    allergies: [],
    history: ["No prior conditions"],
    status: "Pending",
  },
];

function AdminDashboard() {
  const [appointments, setAppointments] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("appointments")) || [];
    return saved.length > 0 ? saved : DEFAULT_ADMIN_APPOINTMENTS;
  });

  const toggleStatus = (index) => {
    const updated = appointments.map((app, i) => {
      if (i !== index) return app;
      return {
        ...app,
        status: app.status === "Confirmed" ? "Completed" : "Confirmed",
      };
    });
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
  };

  const allergyAlertCount = appointments.filter(
    (app) => app.allergies && app.allergies.length > 0
  ).length;

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <Sidebar role="admin" />

        <main className="main-content container-fluid py-4 px-3 px-md-4">
          {/* Doctor & Admin Clinical Hero Banner */}
          <div className="admin-hero-banner mb-4">
            <div className="hero-watermark">🩺</div>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 position-relative">
              <div>
                <span className="badge bg-info text-dark mb-2 px-3 py-1">
                  🩺 Clinical Command Center
                </span>
                <h1 className="h3 fw-bold text-white mb-1">
                  Doctor & Admin Clinical Board
                </h1>
                <p className="text-white-50 small mb-0">
                  Live patient queue with automatic allergy & medical history
                  safety flags.
                </p>
              </div>
              {allergyAlertCount > 0 && (
                <span className="badge bg-danger fs-6 px-3 py-2 align-self-start align-self-md-center">
                  🚨 {allergyAlertCount} Active Allergy Alert(s)
                </span>
              )}
            </div>
          </div>

          {/* Summary Stat Cards */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card h-100 p-3 border-0 shadow-sm">
                <h3 className="h6 text-muted">Patients</h3>
                <p className="fs-4 fw-bold mb-0">120</p>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card h-100 p-3 border-0 shadow-sm">
                <h3 className="h6 text-muted">Doctors</h3>
                <p className="fs-4 fw-bold mb-0">25</p>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card h-100 p-3 border-0 shadow-sm">
                <h3 className="h6 text-muted">Appointments</h3>
                <p className="fs-4 fw-bold mb-0">{appointments.length}</p>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card h-100 p-3 border-0 shadow-sm">
                <h3 className="h6 text-muted">Allergy Flags</h3>
                <p className="fs-4 fw-bold text-danger mb-0">
                  {allergyAlertCount}
                </p>
              </div>
            </div>
          </div>

          {/* Clinical Appointments Table with Allergy Guardrail */}
          <div className="module p-3 p-md-4 border-0 shadow-sm">
            <h2 className="h5 fw-bold mb-3">
              Incoming Patient Appointments & Safety Brief
            </h2>

            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date & Reason</th>
                    <th>Allergy & History Alert (Doctor View)</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((app, index) => {
                    const hasAllergies =
                      app.allergies && app.allergies.length > 0;
                    return (
                      <tr key={app.id || index}>
                        <td>
                          <strong>{app.patient}</strong>
                          {app.relation && (
                            <div className="small text-muted">
                              Family: {app.relation}
                            </div>
                          )}
                        </td>
                        <td>{app.doctor}</td>
                        <td>
                          <div>{app.date}</div>
                          <small className="text-muted">
                            {app.reason || "Consultation"}
                          </small>
                        </td>
                        <td>
                          {hasAllergies ? (
                            <span className="badge bg-danger d-inline-block mb-1">
                              ⚠️ ALLERGIC: {app.allergies.join(", ")}
                            </span>
                          ) : (
                            <span className="badge bg-success d-inline-block mb-1">
                              ✓ No Drug Allergies
                            </span>
                          )}
                          {app.history && app.history.length > 0 && (
                            <div className="small text-muted">
                              History: {app.history[0]}
                            </div>
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              app.status === "Completed"
                                ? "bg-secondary"
                                : "bg-info text-dark"
                            }`}
                          >
                            {app.status || "Confirmed"}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => toggleStatus(index)}
                          >
                            {app.status === "Confirmed"
                              ? "Mark Consulted"
                              : "Reopen"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default AdminDashboard;