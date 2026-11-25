import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const SAMPLE_FAMILY_MEMBERS = [
  {
    id: "self",
    name: "Sai Kiran",
    relation: "Self",
    age: "19",
    bloodGroup: "O+",
    allergies: ["None Reported"],
    history: ["Routine Annual Checkup (Oct 2026)", "COVID-19 Vaccinated"],
  },
  {
    id: "mom",
    name: "Lakshmi Devi",
    relation: "Mother",
    age: "46",
    bloodGroup: "B+",
    allergies: ["Penicillin", "Dust Mites"],
    history: ["Type 2 Diabetes (Managed)", "Thyroid Profile - Normal (2026)"],
  },
  {
    id: "dad",
    name: "Suresh Babu",
    relation: "Father",
    age: "51",
    bloodGroup: "O+",
    allergies: ["Aspirin / Blood Thinners", "Sulfa Drugs"],
    history: ["Mild Hypertension", "Cardiac Stress Test (Sep 2026)"],
  },
  {
    id: "sister",
    name: "Ananya",
    relation: "Sister",
    age: "15",
    bloodGroup: "B+",
    allergies: ["Peanuts"],
    history: ["Seasonal Allergic Rhinitis"],
  },
];

function Navbar() {
  const navigate = useNavigate();

  const loggedInUser = localStorage.getItem("loggedInUser") || "";
  const loggedInRole = localStorage.getItem("loggedInRole") || "";
  const isAdmin =
    loggedInRole === "admin" ||
    loggedInUser === "admin" ||
    loggedInUser === "admin@hopecare.com";

  // Seed sample family members if localStorage doesn't have them yet
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

  // Listen for updates when a new family member is added on the Dashboard
  useEffect(() => {
    const syncFamily = () => {
      const latestMembers =
        JSON.parse(localStorage.getItem("familyMembers")) ||
        SAMPLE_FAMILY_MEMBERS;
      const latestId = localStorage.getItem("activeFamilyMemberId") || "self";
      setFamilyMembers(latestMembers);
      setActiveMemberId(latestId);
    };

    window.addEventListener("familyUpdated", syncFamily);
    return () => window.removeEventListener("familyUpdated", syncFamily);
  }, []);

  const handleSwitchMember = (e) => {
    const newId = e.target.value;
    setActiveMemberId(newId);
    localStorage.setItem("activeFamilyMemberId", newId);
    window.dispatchEvent(new Event("familyUpdated"));
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInRole");
    navigate("/login");
  };

  const activeMember =
    familyMembers.find((m) => m.id === activeMemberId) || familyMembers[0];
  const hasAllergy =
    activeMember &&
    activeMember.allergies &&
    activeMember.allergies[0] !== "None Reported";

  return (
    <header className="navbar px-3 px-md-4 py-2 d-flex flex-wrap justify-content-between align-items-center gap-2">
      {/* Brand Title */}
      <div
        className="d-flex align-items-center gap-2"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(isAdmin ? "/admin" : "/user")}
      >
        <span className="fs-4">🏥</span>
        <h2 className="mb-0 fs-5 fw-bold text-white">HopeCare Hospital</h2>
      </div>

      {/* Right Controls: Top-Bar Family Profile Switcher + Logout */}
      <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto">
        {!isAdmin && (
          <div className="d-flex align-items-center gap-2 bg-dark bg-opacity-25 px-2 py-1 rounded border border-light border-opacity-25">
            <span className="small text-white-50 d-none d-sm-inline">
              Viewing:
            </span>
            <select
              aria-label="Switch Family Member"
              value={activeMemberId}
              onChange={handleSwitchMember}
              className="form-select form-select-sm bg-white text-dark fw-semibold border-0 py-1"
              style={{ width: "auto", maxWidth: "185px" }}
            >
              {familyMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.relation})
                </option>
              ))}
            </select>
            {hasAllergy && (
              <span
                className="badge bg-danger"
                title={`Allergy Alert: ${activeMember.allergies.join(", ")}`}
              >
                ⚠️ Allergy
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          className="logout-btn btn-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;