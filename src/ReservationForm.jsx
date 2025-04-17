import React, { useState } from 'react';
import axios from 'axios';

function ReservationForm({ onReservationAdded }) {
  const [name, setName] = useState('');
  const [roomType, setRoomType] = useState('Single');
  const [checkInDate, setCheckInDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5173/api/reservations', {
        name,
        roomType,
        checkInDate,
      });
      onReservationAdded();
      setName('');
      setRoomType('Single');
      setCheckInDate('');
    } catch (error) {
      console.error('Error making reservation:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label>Room Type:</label>
        <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Suite">Suite</option>
        </select>
      </div>
      <div>
        <label>Check-in Date:</label>
        <input 
          type="date" 
          value={checkInDate} 
          onChange={(e) => setCheckInDate(e.target.value)} 
          required 
        />
      </div>
      <button type="submit">Reserve</button>
    </form>
  );
}

export default ReservationForm;