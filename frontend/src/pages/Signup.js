import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [hostelName, setHostelName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const navigate = useNavigate();
  const hostels = [
    "Azad Hall",
    "Bose Hall",
    "Ambedkar Hall",
    "Babha Hall",
    "Ramappa Hall",
    "Kakatiya Hall",
    "Priyadarshini Hall",
    "Sarojini Hall",
    "New LH-A",
    "New LH-B",
    "New LH-C",
  ];
  const handleSignup = async () => {
    try {
      await API.post("/auth/signup", { name, email, password, rollNo, hostelName, roomNumber });
      alert("Signup successful! Please login.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">Student Signup</h2>
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-3 p-2 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Roll No"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
        />
        <select
          className="w-full mb-3 p-2 border rounded"
          value={hostelName}
          onChange={(e) => setHostelName(e.target.value)}
        >
          <option value="">Select Hostel</option>
          {hostels.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Room Number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
        />
        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Signup
        </button>
      </div>
    </div>
  );
}
