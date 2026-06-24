import React, { useState } from "react";
import axiosInstance from '../instant/axios';

const PayHistory = () => {
  const [adhar, setAdhar] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleAdharChange = (e) => {
    const value = e.target.value;

    // Allow only numbers
    if (/^\d{0,12}$/.test(value)) {
      setAdhar(value);
      setValidationError(""); // Clear error when valid
    } else {
      setValidationError("Aadhaar must be numeric and 12 digits.");
    }
  };

  const fetchHistory = async () => {
    setError("");
    setHistory([]);

    // Validate Aadhaar before sending request
    if (adhar.length !== 12) {
      setValidationError("Aadhaar must be exactly 12 digits.");
      return;
    }

    try {
      const res = await axiosInstance.post("/razorpay/payHistory", { adhar });
      if (res.data.length === 0) {
        setError("❌ No payment history found.");
      } else {
        setHistory(res.data);
      }
    } catch {
      setError("❌ Server error or invalid Aadhaar.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-28 mb-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-[#335288] mb-4 text-center">Check Payment History</h2>

      <input
        type="text"
        value={adhar}
        onChange={handleAdharChange}
        placeholder="Enter Aadhaar Number"
        maxLength={12}
        className="w-full border px-4 py-2 rounded mb-2"
      />
      {validationError && <p className="text-red-600 text-sm mb-2">{validationError}</p>}

      <button
        onClick={fetchHistory}
        className="w-full bg-[#335288] text-white py-2 rounded hover:bg-[#223b60]"
      >
        View History
      </button>

      {error && <p className="text-red-600 mt-3">{error}</p>}

      {history.length > 0 && (
        <div className="mt-6 space-y-4">
          {history.map((payment, index) => (
            <div key={index} className="border p-4 rounded text-sm">
              <p><b>Name:</b> {payment.name || 'N/A'}</p>
              <p><b>Email:</b> {payment.email || 'N/A'}</p>
              <p><b>Amount:</b> ₹{payment.amount ?? 'N/A'}</p>
              <p><b>Payment ID:</b> {payment.paymentId || 'N/A'}</p>
              <p><b>Date:</b> {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PayHistory;
