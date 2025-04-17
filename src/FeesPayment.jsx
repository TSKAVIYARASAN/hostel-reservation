import React, { useState } from "react";
import axios from "axios";

import { useLocation, useNavigate } from 'react-router-dom';

const FeesPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reservationId, setReservationId] = useState(location.state?.reservation_id || ""); // Get reservation_id from state
  const [amount, setAmount] = useState(location.state?.price || ""); // Get price from state
  const [status, setStatus] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [receipt, setReceipt] = useState(null);

 /*  if (!location.state?.reservation_id || !location.state?.price) {
    return <div className="container">
             <p>Reservation ID and price are required for payment. Please go back to reservation page.</p>
           </div>;
  } */

  const handlePayment = (e) => {
    e.preventDefault();
    if (!paymentOption) {
      setStatus("Please select a payment option.");
      return;
    }
    axios
      .post("http://localhost:5000/pay", { reservationId, amount, paymentOption })
      .then((res) => {
        console.log("Payment response:", res.data); // Log the response
        if (res.data.success === true) {
          setStatus("Payment successful!");
          setReceipt({
            reservationId: reservationId,
            amount: amount,
            paymentOption: paymentOption,
          transactionId: "1234567890",
          date: new Date().toLocaleDateString(),
        });
        alert("Payment successful! ✅");
        // Navigate back to reservation page with confirmation
        // navigate(`/reserve/${reservationId}?confirmed=true`); 
   } })
      .catch((err) => {
        console.error(err);
        setStatus("Payment failed. Try again.");
      });
  };

  return (
    <div className="container">
      <h2>Pay Hostel Fees</h2>
      <form onSubmit={handlePayment}>
        <div style={{ marginBottom: '10px' }}>
          <span>Reservation ID:</span> <strong>{reservationId}</strong>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <span>Amount:</span> <strong>₹{amount}</strong>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="upi"
              checked={paymentOption === "upi"}
              onChange={(e) => setPaymentOption(e.target.value)}
            />
            UPI
          </label>
          <label>
            <input
              type="radio"
              value="netBanking"
              checked={paymentOption === "netBanking"}
              onChange={(e) => setPaymentOption(e.target.value)}
            />
            Net Banking
          </label>
        </div>
        <button type="submit">Pay</button>
      </form>
      <p>{status}</p>
      {receipt && (
        <div>
          <h3>Payment Receipt</h3>
          <p>Reservation ID: {receipt.reservationId}</p>
          <p>Amount: {receipt.amount}</p>
          <p>Payment Option: {receipt.paymentOption}</p>
          <p>Transaction ID: {receipt.transactionId}</p>
          <p>Date: {receipt.date}</p>
          <button
            type="button"
            onClick={() => navigate(`/view-reservation/${reservationId}`, { state: { reservationId: reservationId, userId: location.state.userId } })}
            style={{ marginTop: "10px" }}
          >
            View Reservation
          </button>
          <button type="button" onClick={() => navigate('/login')} style={{ marginTop: "10px" }}>
            Go Back to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default FeesPayment;
