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

    // 1. Built-in Demo Admin Account (works on any browser/laptop)
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

    // 2. Built-in Demo Patient Account (works on any browser/laptop)
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

  // Helper to auto-fill demo accounts with 1 click during your review/hackathon
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
        <div className="login-info">
          <h1>HopeCare Hospital</h1>
          <p>Hospital Management System</p>
          <p>
            Manage healthcare services easily and efficiently.
          </p>
        </div>

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

          {/* One-Click Demo Login Helper for Review & Hackathon */}
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