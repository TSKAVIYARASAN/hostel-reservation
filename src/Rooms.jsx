import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Rooms.css"; // Import the CSS file
import { jwtDecode } from "jwt-decode";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedType, setSelectedType] = useState("all"); // State for selected room type
    const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching rooms...");
    axios.get("http://localhost:5000/rooms")
      .then(res => {
        console.log("Rooms data received:", res.data);
        setRooms(res.data);
      })
      .catch(err => {
        console.error("Error fetching rooms:", err);
      });
  }, []);

    // Get user email from local storage
    const token = localStorage.getItem("token");
    let userEmail = null;
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            userEmail = decodedToken.email; // Assuming email is in the decoded token
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }

    const hasBookedRoom = (room) => {
        // Replace with your actual logic to check if the user has booked the room
        // This is just a placeholder, you'll need to query your backend
        return room.reservations && room.reservations.some(reservation => reservation.email === userEmail);
    };

  // Filter rooms based on selected type
  const filteredRooms = selectedType === "all"
    ? rooms
    : rooms.filter(room => room.type === selectedType);

  if (rooms.length === 0) {
    return <div><h2>Available Rooms</h2><p>No available rooms found.</p></div>;
  }

  return (
    <div>
      <h2>Available Rooms</h2>

      {/* Dropdown for selecting room type */}
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        style={{ marginBottom: "10px" }}
      >
        <option value="all">All Rooms</option>
        <option value="single">Single</option>
        <option value="double">Double</option>
        <option value="4 members">4 Members</option>
      </select>

      <div className="rooms-container">
        {filteredRooms.map(room => (
          <div key={room.id} className="room-card">
            <h3>Room {room.room_number} - {room.type}</h3>
            <p>Price: ${room.price}</p>
+            <img src={`/room${room.id % 2 === 0 ? 1 : 2}.jpg`} alt={`Room ${room.room_number}`} className="room-image" />
            <button
              className="book-now-button"
              onClick={() => navigate(`/reserve/${room.id}`, { state: { price: room.price } })}
            >
              Book Now
            </button>
                        {hasBookedRoom(room) && (
                            <button
                                className="view-reservation-button"
                                onClick={() => navigate(`/view-reservation/${room.id}`, { state: { room: room } })}
                            >
                                View Reservation
                            </button>
                        )}
          </div>
                    ))}
      </div>
    </div>
  );
};

export default Rooms;
