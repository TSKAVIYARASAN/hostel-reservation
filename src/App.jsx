import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Rooms from "./Rooms";
import Reservation from "./Reservation"; // This will be our reservation form component
import './App.css';
import AdminDashboard from './AdminDashboard';
import FeesPayment from "./FeesPayment";
import ViewReservation from "./ViewReservation"; // Import ViewReservation
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rooms" element={<Rooms />} />
        {/* Add route for specific room reservation */}
        <Route path="/reserve/:roomId" element={<Reservation />} /> 
        {/* Keep or remove the old /reservations route depending on if it's used elsewhere */}
        {/* <Route path="/reservations" element={<Reservation />} />  */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/payment" element={<FeesPayment />} /> {/* <-- New route */}
        <Route path="/view-reservation/:reservationId" element={<ViewReservation />} /> {/* Add ViewReservation route */}
      </Routes>
    </Router>
  );
}
export default App;
