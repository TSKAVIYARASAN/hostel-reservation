import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [adminButtonMessage, setAdminButtonMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
        isAdmin,
      });

      localStorage.setItem("token", res.data.token);
      alert("Login Successful");

      // Decode the token to get the user's role
      const decodedToken = jwtDecode(res.data.token);
      const userRole = decodedToken.role;

      // Redirect based on user role
      if (isAdmin && userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/rooms");
      }
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  const goToAdminDashboard = () => {
    if (!isAdmin) {
      setAdminButtonMessage("Please click the admin login");
      return;
    }
    navigate("/admin");
    setAdminButtonMessage("");
  };

  const toggleContactDetails = () => {
    setShowContactDetails(!showContactDetails);
  };

  return (
    <div style={{ 
      textAlign: "center",
      margin: 0,
      minHeight: "100vh",
      backgroundImage: "url('/room1.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: "auto"
    }}>
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: "30px",
        borderRadius: "10px",
        marginTop: "50px"
      }}>
        <h1>HOSTEL RESERVATION MANAGEMENT</h1>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "8px", margin: "5px" }}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "8px", margin: "5px" }}
          />
          <br />
          <label>
            Admin Login:
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              style={{ margin: "5px" }}
            />
          </label>
          <br />
          <button type="submit" style={{ padding: "10px 20px", marginTop: "10px" }}>
            Login
          </button>
          <button type="button" onClick={() => navigate('/register')} className="register-button">
            Register
          </button>
        </form>
        <button
          type="button"
          onClick={goToAdminDashboard}
          disabled={!isAdmin}
          style={{
            padding: "10px 20px",
            marginTop: "10px",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer"
          }}
        >
          Admin
        </button>
        <button type="button" onClick={toggleContactDetails} style={{ padding: "10px 20px", marginTop: "10px" }}>
          Contact Us
        </button>
        {adminButtonMessage && <p style={{ color: "red" }}>{adminButtonMessage}</p>}

        {showContactDetails && (
          <div>
            <h3>Contact Us</h3>
            <p>Email: hostel@gmail.com</p>
            <p>Mobile: 9443685042</p>
          </div>
        )}
      </div>
      <footer style={{ marginTop: "20px" }}>
        &copy; 2025 Hostel Reservation Management
      </footer>
    </div>
  );
};

export default Login;
