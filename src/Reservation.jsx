import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

const Reservation = () => {
  const { roomId } = useParams(); // Get roomId from URL
  const navigate = useNavigate();
  const location = useLocation();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(""); // State for error messages
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [roomPrice, setRoomPrice] = useState(location.state?.price || 0); // Get price from Rooms page

  // Get user ID from token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id); // Assuming token payload has 'id'
      } catch (err) {
        console.error("Invalid token:", err);
        setError("Invalid session. Please log in again.");
        // Optionally navigate to login
        // navigate('/'); 
      }
    } else {
      setError("You must be logged in to make a reservation.");
      // Optionally navigate to login
        // navigate('/');
    }

    // Check if reservation was confirmed
    if (location.search.includes("confirmed=true")) {
      setConfirmationMessage("Reservation Confirmed!");
    }
  }, [navigate, location.search, location.state?.price]);

  // Handle reservation form submission
  const handleReservation = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!userId) {
      setError("Could not verify user. Please log in again.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
        setError("End date must be after start date.");
        return;
    }

    try {
      const response = await axios.post("http://localhost:5000/reserve", {
        user_id: userId,
        room_id: roomId, // Use roomId from URL params
        start_date: startDate,
        end_date: endDate,
      });
      alert("Room Reserved Successfully!");
      navigate("/payment", { state: { reservation_id: response.data.reservation_id, price: roomPrice, userId: userId } }); // Navigate to payment page with reservation ID and price
    } catch (err) {
      console.error("Reservation error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Reservation Failed. Please try again.");
      alert("Reservation Failed: " + (err.response?.data?.message || err.message)); // Show specific error if available
    }
  };

  return (
    // Using basic inline styles for simplicity, replace with CSS classes if preferred
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '20px' }}>Reserve Room {roomId}</h2>
      <p style={{ marginBottom: '10px' }}>Room Price: ${roomPrice}</p>
      
      {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
      {confirmationMessage && <p style={{ color: 'green', marginBottom: '15px' }}>{confirmationMessage}</p>}

      <form onSubmit={handleReservation}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="startDate" style={{ display: 'block', marginBottom: '5px' }}>Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="endDate" style={{ display: 'block', marginBottom: '5px' }}>End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={!userId} // Disable button if user ID not found
          style={{ width: '100%', padding: '10px', backgroundColor: !userId ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: !userId ? 'not-allowed' : 'pointer' }}
        >
          Confirm Reservation
        </button>
      </form>
    </div>
  );
};

export default Reservation;
