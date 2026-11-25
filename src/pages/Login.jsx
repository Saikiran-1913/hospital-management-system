import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    setMessage("");

    // 1. Built-in Demo Admin Account
    if (
      role === "admin" &&
      email === "admin@hopecare.com" &&
      password === "admin123"
    ) {
      localStorage.setItem("loggedInUser", "admin@hopecare.com");
      localStorage.setItem("loggedInRole", "admin");
      navigate("/admin");
      return;
    }

    // 2. Built-in Demo Patient Account
    if (
      role === "user" &&
      email === "patient@hopecare.com" &&
      password === "patient123"
    ) {
      localStorage.setItem("loggedInUser", "patient@hopecare.com");
      localStorage.setItem("loggedInRole", "user");
      navigate("/user");
      return;
    }

    // 3. Check accounts created via Signup page in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const matchedUser = users.find(
      (u) =>
        u.email === email &&
        u.password === password &&
        (u.role || "user") === role
    );

    if (matchedUser) {
      localStorage.setItem("loggedInUser", matchedUser.email);
      localStorage.setItem("loggedInRole", matchedUser.role || "user");
      navigate(role === "admin" ? "/admin" : "/user");
    } else {
      setMessage("Invalid email, password, or selected role.");
    }
  };

  const fillDemo = (demoRole) => {
    setMessage("");
    setRole(demoRole);
    if (demoRole === "admin") {
      setEmail("admin@hopecare.com");
      setPassword("admin123");
    } else {
      setEmail("patient@hopecare.com");
      setPassword("patient123");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Teal Brand Panel with Stethoscope Watermark & Feature Highlights */}
        <div className="login-info position-relative overflow-hidden">
          {/* Faint Stethoscope / Medical Cross Watermark */}
          <div
            className="position-absolute"
            style={{
              right: "-15px",
              bottom: "-25px",
              fontSize: "11rem",
              opacity: 0.08,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            🩺
          </div>

          <div className="mb-3">
            <span className="badge bg-light text-dark px-3 py-2 fw-semibold">
              🏥 24/7 Smart Care Portal
            </span>
          </div>

          <h1>HopeCare Hospital</h1>
          <p className="fw-medium mb-3">Hospital Management System</p>
          <p className="small opacity-75 mb-4">
            Manage appointments, family profiles, and clinical allergy alerts
            safely from one unified dashboard.
          </p>

          <div className="d-flex flex-column gap-2 small mt-auto">
            <div className="d-flex align-items-center gap-2">
              <span>👨‍👩‍👧‍👦</span>
              <span>One Login for Entire Family</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span>🚨</span>
              <span>Real-Time Doctor Allergy Guardrails</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span>🩺</span>
              <span>Instant Specialist Booking & Billing</span>
            </div>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="login-box">
          <h2>Welcome Back</h2>
          <p className="subtitle">Login to your account</p>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">Patient / User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            className="primary-btn"
            onClick={handleLogin}
          >
            Login
          </button>

          {message && <p className="error">{message}</p>}

          <div className="mt-3 p-2 rounded bg-light border text-dark small">
            <div className="fw-bold mb-1">Quick Demo Accounts:</div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm flex-fill"
                onClick={() => fillDemo("user")}
              >
                Fill Patient
              </button>
              <button
                type="button"
                className="btn btn-outline-dark btn-sm flex-fill"
                onClick={() => fillDemo("admin")}
              >
                Fill Admin
              </button>
            </div>
          </div>

          <p className="account-text mt-3">
            Don't have an account?
            <Link to="/signup"> Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;