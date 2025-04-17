import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AdminDashboard component mounted");
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    axios.get("http://localhost:5000/bookings")
      .then(res => {
        console.log("Bookings data:", res.data);
        // Fetch room details for each booking
        Promise.all(res.data.map(async booking => {
          try {
            if (!booking.room_id) return booking; // Skip if room_id is invalid
            const room = await fetchRoomDetails(booking.room_id);
            return { ...booking, room: room }; // Add room details to booking object
          } catch (error) {
            console.error(`Error fetching room details for room ID ${booking.room_id}:`, error);
            return booking; // Return booking without room details in case of error
          }
        }))
          .then(bookingsWithRooms => setBookings(bookingsWithRooms))
          .catch(err => console.error("Error processing bookings:", err));
      })
      .catch(err => console.error("Error fetching bookings:", err));
  };

  const fetchRoomDetails = (roomId) => {
    return axios.get(`http://localhost:5000/rooms/${roomId}`)
      .then(res => {
        return res.data;
      })
      .catch(err => console.error(err));
  }

  const handleAction = (id, status) => {
    const newStatus = status === 'approved' ? 'confirmed' : status;
    axios.post(`http://localhost:5000/bookings/${id}`, { status: newStatus })
      .then(() => {
        // Refresh bookings after action
        axios.get("http://localhost:5000/bookings")
          .then(res => {
            setBookings(res.data);
            if (status === 'approved') {
              const approvedBooking = bookings.find(booking => booking.id === id);
              setConfirmedBooking({
                roomId: approvedBooking.room_id,
                userId: approvedBooking.user_id,
                transactionId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
              });
            }
          })
          .catch(err => console.error(err));
      });
  };

  return (
    <>
      <style>
        {`
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .bookings-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
          }

          .room-card {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 10px;
            width: 300px;
            text-align: center;
          }

          .confirmation-message {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 10px;
            margin-top: 20px;
            width: 300px;
            text-align: center;
          }

          button {
            margin: 5px;
          }
        `}
      </style>

      <h2>All Bookings</h2>
      <div className="bookings-container">
        {bookings.map(booking => {
          console.log("Booking:", booking);
          return (
            <div className="room-card" key={booking.id}>
              <h3>Room ID: {booking.room_id}</h3>
              <p>User ID: {booking.user_id}</p>
              <p>Start Date: {booking.start_date}</p>
              <p>End Date: {booking.end_date}</p>
              <p>Status: {booking.status}</p>
              {booking.room && (
                <h4>Room {booking.room.room_number} - {booking.room.type}</h4>
              )}
              <button onClick={() => handleAction(booking.id, 'approved')}>Approve</button>
              <button onClick={() => handleAction(booking.id, 'rejected')}>Reject</button>
              <button onClick={() => navigate(`/view-reservation/${booking.room_id}`, {
                state: { room: booking.room, booking }
              })}>
                View Reservation
              </button>
            </div>
          );
        })}
      </div>

      {confirmedBooking && (
        <div className="confirmation-message">
          <h3>Reservation Confirmed!</h3>
          <p>Room ID: {confirmedBooking.roomId}</p>
          <p>User ID: {confirmedBooking.userId}</p>
          <p>Transaction ID: {confirmedBooking.transactionId}</p>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
