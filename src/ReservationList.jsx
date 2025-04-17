import React from 'react';

function ReservationList({ reservations }) {
  return (
    <div>
      <h2>Reservation List</h2>
      <ul>
        {reservations.map((reservation) => (
          <li key={reservation.id}>
            {reservation.name} - {reservation.roomType} - {reservation.checkInDate}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReservationList;