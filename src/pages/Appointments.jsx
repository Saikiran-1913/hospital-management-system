import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar, { SAMPLE_FAMILY_MEMBERS } from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Appointments() {
  const location = useLocation();

  const [familyMembers, setFamilyMembers] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("familyMembers"));
    return saved && saved.length > 0 ? saved : SAMPLE_FAMILY_MEMBERS;
  });

  const [selectedMemberId, setSelectedMemberId] = useState(() => {
    return localStorage.getItem("activeFamilyMemberId") || "self";
  });

  const [doctor, setDoctor] = useState(
    location.state?.doctor || "Dr. Priya Sharma"
  );
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [appointments, setAppointments] = useState(
    () => JSON.parse(localStorage.getItem("appointments")) || []
  );

  // Sync if user switches family member in the top Navbar while on this page
  useEffect(() => {
    const handleSync = () => {
      setFamilyMembers(
        JSON.parse(localStorage.getItem("familyMembers")) ||
          SAMPLE_FAMILY_MEMBERS
      );
      setSelectedMemberId(
        localStorage.getItem("activeFamilyMemberId") || "self"
      );
    };
    window.addEventListener("familyUpdated", handleSync);
    return () => window.removeEventListener("familyUpdated", handleSync);
  }, []);

  const loggedInUser = localStorage.getItem("loggedInUser");
  const loggedInRole = localStorage.getItem("loggedInRole");
  const role =
    loggedInRole === "admin" ||
    loggedInUser === "admin" ||
    loggedInUser === "admin@hopecare.com"
      ? "admin"
      : "user";

  const selectedMember =
    familyMembers.find((m) => m.id === selectedMemberId) || familyMembers[0];

  const activeAllergies = (selectedMember.allergies || []).filter(
    (a) => a !== "None Reported"
  );

  const bookAppointment = () => {
    if (!selectedMember || !doctor || !date) {
      setMessage("Please select a family member, doctor, and date.");
      return;
    }

    const newAppointment = {
      id: Date.now(),
      patient: selectedMember.name,
      relation: selectedMember.relation,
      doctor: doctor,
      date: date,
      reason: reason || "General Consultation",
      allergies: activeAllergies,
      history: selectedMember.history || [],
      status: "Confirmed",
    };

    const updated = [...appointments, newAppointment];
    localStorage.setItem("appointments", JSON.stringify(updated));
    setAppointments(updated);

    setMessage(
      `Appointment booked for ${selectedMember.name} with ${doctor}! Allergy profile attached.`
    );
    setDate("");
    setReason("");
  };

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <Sidebar role={role} />

        <main className="main-content container-fluid py-4 px-3 px-md-4">
          <h1 className="mb-1">Appointments</h1>
          <p className="welcome mb-4">
            Book for yourself or any family member — allergy & history alerts attach automatically.
          </p>

          <div className="row g-4">
            <div className="col-12 col-lg-5">
              <div className="module p-4 border-0 shadow-sm">
                <h2 className="h5 fw-bold mb-3">Book Appointment</h2>

                <label className="form-label small fw-bold text-muted">
                  Patient (Synced with Top Bar)
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => {
                    setSelectedMemberId(e.target.value);
                    localStorage.setItem("activeFamilyMemberId", e.target.value);
                    window.dispatchEvent(new Event("familyUpdated"));
                  }}
                >
                  {familyMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.relation})
                    </option>
                  ))}
                </select>

                {activeAllergies.length > 0 ? (
                  <div className="alert alert-danger py-2 px-3 small mb-3">
                    <strong>⚠️ Clinical Allergy Alert:</strong>{" "}
                    {activeAllergies.join(", ")} — Flagged automatically for the doctor.
                  </div>
                ) : (
                  <div className="alert alert-success py-2 px-3 small mb-3">
                    <strong>✓ Allergy Check Clear:</strong> No known drug allergies on file for {selectedMember.name}.
                  </div>
                )}

                <label className="form-label small fw-bold text-muted">
                  Select Doctor
                </label>
                <select
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                >
                  <option>Dr. Priya Sharma</option>
                  <option>Dr. Raj Kumar</option>
                  <option>Dr. Ramesh Rao</option>
                  <option>Dr. Anjali Reddy</option>
                </select>

                <label className="form-label small fw-bold text-muted">
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />

                <label className="form-label small fw-bold text-muted">
                  Symptoms / Visit Reason
                </label>
                <input
                  type="text"
                  placeholder="e.g., Fever, Follow-up, Chest checkup"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />

                <button
                  className="primary-btn mt-1"
                  onClick={bookAppointment}
                >
                  Confirm Booking
                </button>

                {message && <p className="success">{message}</p>}
              </div>
            </div>

            <div className="col-12 col-lg-7">
              <div className="module p-4 border-0 shadow-sm">
                <h2 className="h5 fw-bold mb-3">
                  Appointment Records ({appointments.length})
                </h2>

                {appointments.length === 0 ? (
                  <p className="text-muted">No appointments booked yet.</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {appointments.map((appointment, index) => (
                      <div
                        className="card p-3 border shadow-none"
                        key={appointment.id || index}
                      >
                        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                          <div>
                            <h3 className="h6 fw-bold text-dark mb-0">
                              {appointment.patient}{" "}
                              {appointment.relation && (
                                <span className="badge bg-light text-dark border ms-1">
                                  {appointment.relation}
                                </span>
                              )}
                            </h3>
                            <small className="text-muted">
                              {appointment.doctor} • Date: {appointment.date}
                            </small>
                          </div>
                          <span className="badge bg-success">
                            {appointment.status || "Confirmed"}
                          </span>
                        </div>

                        {appointment.reason && (
                          <p className="small text-dark fw-normal fs-6 mb-2">
                            <strong>Reason:</strong> {appointment.reason}
                          </p>
                        )}

                        {appointment.allergies &&
                        appointment.allergies.length > 0 ? (
                          <div className="mt-1">
                            <span className="badge bg-danger">
                              ⚠️ ALLERGY ALERT:{" "}
                              {appointment.allergies.join(", ")}
                            </span>
                          </div>
                        ) : (
                          <div className="mt-1">
                            <span className="badge bg-secondary">
                              No Drug Allergies
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Appointments;