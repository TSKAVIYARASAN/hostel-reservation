const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // Correctly placed JSON parsing middleware
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kavi@1805",
  database: "hostel_management",
  port:'3306',
});

db.connect(err => {
  if (err) console.error("Database connection failed", err);
  else console.log("Connected to MySQL");
});

// User Registration
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Register attempt:", { email, password });
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "User registered successfully!" });
  });
});

// User Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email, password }); // Log received credentials
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Database query error during login:", err);
      return res.status(500).send("Server error during login");
    }
    
    console.log("Database query result:", results); // Log DB query result
    if (results.length === 0) {
      console.log("User not found for email:", email);
      return res.status(401).send("User not found");
    }
    
    const user = results[0];
    console.log("User found:", user); // Log the found user data (excluding password hash for security in real logs)
    
    const validPass = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", validPass); // Log password comparison result
    if (!validPass) {
      console.log("Invalid password for email:", email);
      return res.status(401).send("Invalid credentials");
    }

    console.log("Login successful for email:", email);
    const token = jwt.sign({ id: user.id, role: user.role }, "secret", { expiresIn: "1h" });
    res.send({ token });
  });
});

// Fetch Available Rooms (Temporarily fetching ALL rooms for debugging)
app.get("/rooms", (req, res) => {
  console.log("Fetching all rooms (debug)..."); // Add log
  db.query("SELECT * FROM rooms", (err, results) => { // Temporarily remove WHERE clause
    if (err) {
      console.error("Error fetching all rooms:", err);
      return res.status(500).send(err);
    }
    console.log("All rooms data:", results); // Log results
    res.send(results);
  });
});

// Create Reservation
app.post("/reserve", (req, res) => {
  try {
    console.log("Reserve route hit");
    const { user_id, room_id, start_date, end_date } = req.body;
    console.log("Reserve data:", { user_id, room_id, start_date, end_date });
    const sql = "INSERT INTO reservations (user_id, room_id, start_date, end_date, status) VALUES (?, ?, ?, ?, 'Pending')";
    db.query(sql, [user_id, room_id, start_date, end_date], err => {
      if (err) {
        console.error("Error creating reservation:", err);
        return res.status(500).send(err);
      }
      db.query("UPDATE rooms SET is_booked = 1 WHERE id = ?", [room_id]);
      console.log("Reservation created successfully");
      // Get the reservation ID of the last inserted row
      db.query("SELECT LAST_INSERT_ID() as reservation_id", (err, result) => {
        if (err) return res.status(500).send(err);
        const reservation_id = result[0].reservation_id;
        res.send({ message: "Reservation created!", reservation_id: reservation_id }); // Send reservation_id in response
      });
    });
  } catch (error) {
    console.error("Error in reserve route:", error);
    res.status(500).send("Server error");
  }
});

// Admin: Fetch All Reservations
app.get("/bookings", (req, res) => {
  const sql = `
    SELECT reservations.*, rooms.room_number, rooms.type, rooms.price
    FROM reservations JOIN rooms ON reservations.room_id = rooms.id
  `;
  db.query("SELECT * FROM reservations", (err, results) => {
    if (err) return res.status(500).send(err);
    console.log("Admin: Fetch All Reservations - Data:", results);
    res.send(results);
  });
});

// Admin: Fetch Pending Bookings
app.get("/bookings/pending", (req, res) => {
  console.log("Admin: Fetch Pending Bookings - Route hit");
  console.log("Fetching pending bookings...");
  const sql = "SELECT * FROM reservations WHERE status = 'Pending'";
  db.query("SELECT * FROM reservations WHERE status = 'Pending'", (err, results) => {
    if (err) {
      console.error("Error fetching pending bookings:", err);
      return res.status(500).send(err);
    }
    console.log("Admin: Fetch Pending Bookings - Data:", results);
    res.send(results);
  });
});

// Admin: Update Booking Status
app.post("/bookings/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sql = "UPDATE reservations SET status = ? WHERE id = ?";
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("Error updating booking status:", err);
      return res.status(500).send(err);
    }
    console.log("Booking status updated successfully:", id, status);
    res.send({ message: "Booking status updated successfully!" });
  });
});
app.post("/pay", (req, res) => {
  const { reservationId, amount } = req.body;
  const sql = "INSERT INTO payments (reservation_id, amount) VALUES (?, ?)";
  db.query(sql, [reservationId, amount], (err, result) => {
    if (err) {
      console.error("Payment error:", err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true, message: "Payment successful" });
  });
});

// Fetch Reservation Details by ID
app.get("/bookings/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM reservations WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching reservation details:", err);
      return res.status(500).send(err);
    }
    if (results.length === 0) return res.status(404).send("Reservation not found");
    console.log("Reservation details fetched successfully:", results[0]);
    res.send(results[0]);
  });
});

app.listen(5000, () => console.log("Server running on port 5000")); // Corrected log message
