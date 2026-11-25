import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar, { SAMPLE_FAMILY_MEMBERS } from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const SAMPLE_APPOINTMENTS = [
  {
    id: "sample-1",
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
    id: "sample-2",
    patient: "Suresh Babu",
    relation: "Father",
    doctor: "Dr. Raj Kumar",
    date: "2026-11-30",
    reason: "Blood Pressure & ECG Review",
    allergies: ["Aspirin / Blood Thinners", "Sulfa Drugs"],
    history: ["Mild Hypertension"],
    status: "Confirmed",
  },
];

function UserDashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("loggedInUser") || "Sai Kiran";

  const [familyMembers, setFamilyMembers] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("familyMembers"));
    if (saved && saved.length > 0) return saved;
    localStorage.setItem(
      "familyMembers",
      JSON.stringify(SAMPLE_FAMILY_MEMBERS)
    );
    return SAMPLE_FAMILY_MEMBERS;
  });

  const [activeMemberId, setActiveMemberId] = useState(() => {
    return localStorage.getItem("activeFamilyMemberId") || "self";
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("appointments"));
    if (saved && saved.length > 0) return saved;
    localStorage.setItem("appointments", JSON.stringify(SAMPLE_APPOINTMENTS));
    return SAMPLE_APPOINTMENTS;
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRelation, setNewRelation] = useState("Mother");
  const [newAge, setNewAge] = useState("");
  const [newBlood, setNewBlood] = useState("O+");
  const [newAllergy, setNewAllergy] = useState("");
  const [newHistory, setNewHistory] = useState("");

  const [quickAllergy, setQuickAllergy] = useState("");
  const [quickHistory, setQuickHistory] = useState("");

  useEffect(() => {
    const handleSync = () => {
      setFamilyMembers(
        JSON.parse(localStorage.getItem("familyMembers")) ||
          SAMPLE_FAMILY_MEMBERS
      );
      setActiveMemberId(localStorage.getItem("activeFamilyMemberId") || "self");
      setAppointments(
        JSON.parse(localStorage.getItem("appointments")) || SAMPLE_APPOINTMENTS
      );
    };

    window.addEventListener("familyUpdated", handleSync);
    return () => window.removeEventListener("familyUpdated", handleSync);
  }, []);

  const saveAndBroadcast = (updatedMembers, nextActiveId = activeMemberId) => {
    setFamilyMembers(updatedMembers);
    setActiveMemberId(nextActiveId);
    localStorage.setItem("familyMembers", JSON.stringify(updatedMembers));
    localStorage.setItem("activeFamilyMemberId", nextActiveId);
    window.dispatchEvent(new Event("familyUpdated"));
  };

  const activeMember =
    familyMembers.find((m) => m.id === activeMemberId) || familyMembers[0];

  const handleAddFamilyMember = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newAge.trim()) return;

    const newMember = {
      id: "fam_" + Date.now(),
      name: newName.trim(),
      relation: newRelation,
      age: newAge.trim(),
      bloodGroup: newBlood,
      allergies: newAllergy.trim()
        ? newAllergy.split(",").map((item) => item.trim())
        : ["None Reported"],
      history: newHistory.trim()
        ? [newHistory.trim()]
        : ["Initial Profile Created"],
    };

    const updated = [...familyMembers, newMember];
    saveAndBroadcast(updated, newMember.id);

    setNewName("");
    setNewAge("");
    setNewAllergy("");
    setNewHistory("");
    setShowAddForm(false);
  };

  const handleAddAllergy = () => {
    if (!quickAllergy.trim()) return;
    const updated = familyMembers.map((m) => {
      if (m.id !== activeMember.id) return m;
      const cleaned = m.allergies.filter((a) => a !== "None Reported");
      return { ...m, allergies: [...cleaned, quickAllergy.trim()] };
    });
    saveAndBroadcast(updated);
    setQuickAllergy("");
  };

  const handleAddHistory = () => {
    if (!quickHistory.trim()) return;
    const updated = familyMembers.map((m) => {
      if (m.id !== activeMember.id) return m;
      return { ...m, history: [quickHistory.trim(), ...m.history] };
    });
    saveAndBroadcast(updated);
    setQuickHistory("");
  };

  const memberAppointments = appointments.filter(
    (app) => app.patient === activeMember.name
  );
  const latestAppointment =
    memberAppointments.length > 0
      ? `${memberAppointments[memberAppointments.length - 1].doctor} (${
          memberAppointments[memberAppointments.length - 1].date
        })`
      : "No Upcoming Visit";

  const savedBills = JSON.parse(localStorage.getItem("bills")) || [];
  const pendingTotal =
    savedBills.length > 0
      ? savedBills
          .filter((bill) => bill.status !== "Paid")
          .reduce((sum, bill) => sum + Number(bill.amount || 0), 0)
      : activeMember.id === "mom"
      ? 1800
      : activeMember.id === "dad"
      ? 2500
      : 600;

  const hasCriticalAllergy =
    activeMember.allergies.length > 0 &&
    activeMember.allergies[0] !== "None Reported";

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <Sidebar role="user" />

        <main className="main-content container-fluid py-4 px-3 px-md-4">
          {/* Hospital Hero Welcome Banner with Stethoscope Watermark */}
          <div className="dashboard-hero-banner mb-4">
            <div className="hero-watermark">🩺</div>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 position-relative">
              <div>
                <span className="badge bg-light text-dark mb-2 px-3 py-1">
                  🏥 Family Caregiver Portal
                </span>
                <h1 className="h3 fw-bold text-white mb-1">
                  {activeMember.name}'s Health Profile{" "}
                  <span className="badge bg-warning text-dark fs-6 align-middle ms-1">
                    {activeMember.relation}
                  </span>
                </h1>
                <p className="text-white-50 small mb-0">
                  Caregiver Account:{" "}
                  <strong className="text-white">{userEmail}</strong> • Switch
                  family members anytime from the top bar.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-light fw-semibold align-self-start align-self-md-center"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? "✕ Close Form" : "+ Add Family Member"}
              </button>
            </div>
          </div>

          {/* Collapsible Add Family Member Form */}
          {showAddForm && (
            <div className="module p-3 p-md-4 mb-4 border-0 shadow-sm">
              <form onSubmit={handleAddFamilyMember}>
                <h3 className="h6 fw-bold mb-3">
                  Register New Family Member (Syncs to Top Bar)
                </h3>
                <div className="row g-2">
                  <div className="col-12 col-md-3">
                    <input
                      type="text"
                      className="form-control mb-0"
                      placeholder="Full Name (e.g., Grandma)"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6 col-md-2">
                    <select
                      className="form-select mb-0"
                      value={newRelation}
                      onChange={(e) => setNewRelation(e.target.value)}
                    >
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Sister">Sister</option>
                      <option value="Brother">Brother</option>
                      <option value="Child">Child</option>
                      <option value="Grandparent">Grandparent</option>
                    </select>
                  </div>
                  <div className="col-6 col-md-2">
                    <input
                      type="number"
                      className="form-control mb-0"
                      placeholder="Age"
                      value={newAge}
                      onChange={(e) => setNewAge(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6 col-md-2">
                    <select
                      className="form-select mb-0"
                      value={newBlood}
                      onChange={(e) => setNewBlood(e.target.value)}
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div className="col-6 col-md-3">
                    <input
                      type="text"
                      className="form-control mb-0"
                      placeholder="Allergies (comma separated)"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-9 mt-2">
                    <input
                      type="text"
                      className="form-control mb-0"
                      placeholder="Past Medical History (e.g., Asthma, Diabetes, Surgery)"
                      value={newHistory}
                      onChange={(e) => setNewHistory(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-3 mt-2">
                    <button type="submit" className="primary-btn py-2">
                      Save Member
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Allergy Guardrail & Medical History Cards */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-lg-6">
              <div
                className={`card h-100 p-3 p-md-4 border-2 ${
                  hasCriticalAllergy ? "border-danger" : "border-success"
                }`}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="h5 fw-bold text-dark mb-0">
                    🚨 Allergy & Drug Safety Profile
                  </h3>
                  <span
                    className={`badge ${
                      hasCriticalAllergy ? "bg-danger" : "bg-success"
                    }`}
                  >
                    {hasCriticalAllergy
                      ? "Doctor Alert Active"
                      : "No Known Allergies"}
                  </span>
                </div>
                <p className="text-muted small mb-3">
                  Patient: <strong>{activeMember.name}</strong> (
                  {activeMember.age} yrs, Blood:{" "}
                  <strong>{activeMember.bloodGroup}</strong>) — automatically
                  shared with doctors upon booking.
                </p>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  {activeMember.allergies.map((item, idx) => (
                    <span
                      key={idx}
                      className={`badge fs-6 px-3 py-2 ${
                        item === "None Reported"
                          ? "bg-secondary"
                          : "bg-danger"
                      }`}
                    >
                      {item === "None Reported" ? item : `⚠️ ${item}`}
                    </span>
                  ))}
                </div>

                <div className="input-group mt-auto">
                  <input
                    type="text"
                    className="form-control mb-0"
                    placeholder="Add allergy (e.g., Sulfa, Peanuts)..."
                    value={quickAllergy}
                    onChange={(e) => setQuickAllergy(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleAddAllergy}
                  >
                    + Flag Allergy
                  </button>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="card h-100 p-3 p-md-4 border-0 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="h5 fw-bold text-dark mb-0">
                    📋 Past Medical History & Timeline
                  </h3>
                  <span className="badge bg-primary">
                    {activeMember.history.length} Entries
                  </span>
                </div>
                <p className="text-muted small mb-3">
                  Chronic conditions and prior clinical notes for{" "}
                  <strong>{activeMember.name}</strong>:
                </p>

                <ul className="list-group list-group-flush mb-3">
                  {activeMember.history.map((entry, idx) => (
                    <li
                      key={idx}
                      className="list-group-item px-0 py-2 d-flex align-items-center gap-2"
                    >
                      <span className="badge bg-info text-dark">✓</span>
                      <span className="small fw-medium text-dark">{entry}</span>
                    </li>
                  ))}
                </ul>

                <div className="input-group mt-auto">
                  <input
                    type="text"
                    className="form-control mb-0"
                    placeholder="Add medical note (e.g., Asthma, BP)..."
                    value={quickHistory}
                    onChange={(e) => setQuickHistory(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={handleAddHistory}
                  >
                    + Add Record
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <div className="card h-100 p-3 shadow-sm border-0">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="h5 mb-0">Upcoming Visit</h3>
                  <span className="badge bg-info text-dark">Scheduled</span>
                </div>
                <p className="fs-5 fw-bold mb-0">{latestAppointment}</p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card h-100 p-3 shadow-sm border-0">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="h5 mb-0">Vitals & Blood Group</h3>
                  <span className="badge bg-primary">
                    {activeMember.age} Yrs
                  </span>
                </div>
                <p className="fs-5 fw-bold mb-0">
                  Blood Type: {activeMember.bloodGroup}
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card h-100 p-3 shadow-sm border-0">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="h5 mb-0">Estimated Bill</h3>
                  <span className="badge bg-warning text-dark">Due</span>
                </div>
                <p className="fs-5 fw-bold mb-0">
                  ₹{pendingTotal.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="module p-3 p-md-4 rounded shadow-sm">
            <h2 className="h4 mb-3">Quick Actions for {activeMember.name}</h2>

            <div className="row g-3">
              <div className="col-12 col-md-4">
                <div
                  className="service-card service-card-hover h-100 p-4 text-center rounded"
                  onClick={() => navigate("/doctors")}
                  role="button"
                  tabIndex={0}
                >
                  <span className="service-icon d-block fs-1 mb-2">🩺</span>
                  <h3 className="h5">Doctors</h3>
                  <p className="mb-2">Find specialists & book</p>
                  <button className="btn btn-outline-light btn-sm mt-1">
                    Explore Doctors →
                  </button>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div
                  className="service-card service-card-hover h-100 p-4 text-center rounded"
                  onClick={() => navigate("/appointments")}
                  role="button"
                  tabIndex={0}
                >
                  <span className="service-icon d-block fs-1 mb-2">📅</span>
                  <h3 className="h5">Book Appointment</h3>
                  <p className="mb-2">Auto-attaches allergy alerts</p>
                  <button className="btn btn-outline-light btn-sm mt-1">
                    Book for {activeMember.name} →
                  </button>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div
                  className="service-card service-card-hover h-100 p-4 text-center rounded"
                  onClick={() => navigate("/billing")}
                  role="button"
                  tabIndex={0}
                >
                  <span className="service-icon d-block fs-1 mb-2">💳</span>
                  <h3 className="h5">Billing</h3>
                  <p className="mb-2">View & pay family bills</p>
                  <button className="btn btn-outline-light btn-sm mt-1">
                    View Bills →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default UserDashboard;