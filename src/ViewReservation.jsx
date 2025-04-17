import React from 'react';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ViewReservation = () => {
    const location = useLocation();
    const { reservationId, userId } = location.state || {}; // added default value to avoid undefined error
    const [reservationDetails, setReservationDetails] = useState(null);

    useEffect(() => {
        console.log("reservationId:", reservationId, "userId:", userId); // Debugging log
        const fetchReservationDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/bookings/${reservationId}`);
                console.log("Reservation details:", response.data); // Debugging log
                setReservationDetails(response.data);
            } catch (error) {
                console.error("Error fetching reservation details:", error);
            }
        };

        if (reservationId) { // Only fetch if reservationId is available
            fetchReservationDetails();
        }
    }, [reservationId, userId]);

    if (!reservationDetails) {
        return <div><h2>View Reservation</h2><p>No reservation details found.</p></div>;
    }

    return (
        <div className="container">
            <h2>View Reservation</h2>
            <h3>Reservation ID: {reservationDetails.id}</h3>
            <p>Room ID: {reservationDetails.room_id}</p>
            <p>User ID: {reservationDetails.user_id}</p>
            <p>Start Date: {reservationDetails.start_date}</p>
            <p>End Date: {reservationDetails.end_date}</p>
            <p>Status: {reservationDetails.status}</p>

            {/* Display payment details if available */}
            {reservationDetails.transactionId && (
                <div>
                    <h3>Payment Details</h3>
                    <p>Transaction ID: {reservationDetails.transactionId}</p>
                    {/* You might need to format the date properly */}
                    <p>Payment Date: {reservationDetails.paymentDate}</p>
                </div>
            )}

            {/* You can fetch and display room details here as well if needed */}
            {/* <h3>Room Details</h3>
            <p>Room Number: {reservationDetails.room.room_number}</p>
            <p>Room Type: {reservationDetails.room.type}</p> */}
        </div>
    );
};

export default ViewReservation;
