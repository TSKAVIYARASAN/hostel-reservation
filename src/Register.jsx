// src/Register.js
// src/Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState(""); // Add state for name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Move useNavigate hook inside the component

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Include name in the POST request body
    const res = await axios.post("http://localhost:5000/register", { name, email, password }) 
      .then(res => {
        alert("Registered Successfully");
        // Optionally redirect or clear form here
        setName(""); 
        setEmail("");
        setPassword("");
        navigate("/login"); // Navigate to login after successful registration
      })
      .catch(err => {
        console.error("Registration error:", err); // Log error for debugging
        alert("Error during registration");
      });
  };

  return (
    <form className="container" onSubmit={handleSubmit} style={{ textAlign: "center", marginTop: "50px" }}> {/* Added basic styling */}
      <h2>Register</h2>
      {/* Add Name input field */}
      <input 
        type="text" 
        placeholder="Name" 
        value={name} // Bind value to state
        onChange={e => setName(e.target.value)} 
        required 
        style={{ padding: "8px", margin: "5px", display: 'block', marginLeft: 'auto', marginRight: 'auto' }} // Basic styling
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={email} // Bind value to state
        onChange={e => setEmail(e.target.value)} 
        required 
        style={{ padding: "8px", margin: "5px", display: 'block', marginLeft: 'auto', marginRight: 'auto' }} // Basic styling
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} // Bind value to state
        onChange={e => setPassword(e.target.value)} 
        required 
        style={{ padding: "8px", margin: "5px", display: 'block', marginLeft: 'auto', marginRight: 'auto' }} // Basic styling
      />
      <button type="submit" style={{ padding: "10px 20px", marginTop: "10px" }}> {/* Basic styling */}
        Register
      </button>
    </form>
  );
};

export default Register;
