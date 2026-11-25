import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Doctors() {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState("All");

  const loggedInUser = localStorage.getItem("loggedInUser");
  const loggedInRole = localStorage.getItem("loggedInRole");

  const role =
    loggedInRole === "admin" ||
    loggedInUser === "admin" ||
    loggedInUser === "admin@hopecare.com"
      ? "admin"
      : "user";

  const doctors = [
    {
      name: "Dr. Priya Sharma",
      department: "General Physician",
      experience: "15 Years",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Dr. Raj Kumar",
      department: "Cardiologist",
      experience: "19 Years",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Dr. Ramesh Rao",
      department: "Neurologist",
      experience: "20 Years",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Dr. Anjali Reddy",
      department: "Dermatologist",
      experience: "7 Years",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=500&q=80",
    },
  ];

  const departments = [
    "All",
    "General Physician",
    "Cardiologist",
    "Neurologist",
    "Dermatologist",
  ];

  const filteredDoctors =
    selectedDept === "All"
      ? doctors
      : doctors.filter((doc) => doc.department === selectedDept);

  const handleBookAppointment = (doctorName) => {
    navigate("/appointments", {
      state: {
        doctor: doctorName,
      },
    });
  };

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <Sidebar role={role} />

        <main className="main-content container-fluid py-4 px-3 px-md-4">
          {/* Page Header & Department Filter */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <h1 className="mb-1">Our Doctors</h1>
              <p className="welcome mb-0">
                Meet our experienced medical professionals.
              </p>
            </div>

            <div className="d-flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  className={`btn btn-sm ${
                    selectedDept === dept
                      ? "btn-dark"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => setSelectedDept(dept)}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Bootstrap Responsive Doctor Cards Grid */}
          <div className="row g-4">
            {filteredDoctors.map((doctor, index) => (
              <div className="col-12 col-sm-6 col-lg-3" key={index}>
                <div className="card h-100 border-0 shadow-sm overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="card-img-top"
                    style={{
                      height: "230px",
                      objectFit: "cover",
                      objectPosition: "top",
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        doctor.name
                      )}&background=0f6b73&color=fff&size=300`;
                    }}
                  />

                  <div className="card-body d-flex flex-column">
                    <div className="mb-2">
                      <span className="badge bg-info text-dark">
                        {doctor.department}
                      </span>
                    </div>

                    <h2 className="h5 fw-bold mb-1">{doctor.name}</h2>

                    <p className="text-muted fs-6 fw-normal mb-3">
                      <strong>Experience:</strong> {doctor.experience}
                    </p>

                    <button
                      className="primary-btn mt-auto"
                      onClick={() => handleBookAppointment(doctor.name)}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default Doctors;