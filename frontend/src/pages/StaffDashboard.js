import React, { useState, useEffect } from "react";
import API from "../api";
import { getStatusColor } from "../utils/statusColor";

function StaffDashboard() {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    const res = await API.get("/complaints/assigned");
    setComplaints(res.data);
  };

  const updateStatus = async (id, status) => {
    await API.put(`/complaints/${id}/status`, { status });
    fetchComplaints();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  useEffect(() => {
    fetchComplaints();
    const interval = setInterval(fetchComplaints, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-green-700">Staff Dashboard</h2>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Complaints List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {complaints.map((c) => (
    <div
      key={c._id}
      className="bg-white p-4 rounded shadow hover:shadow-lg transition"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">{c.title}</h3>
        <span
          className="text-white px-3 py-1 rounded font-bold text-sm"
          style={{ backgroundColor: getStatusColor(c.status) }}
        >
          {c.status}
        </span>
      </div>

      <p className="mb-2">
        <span className="font-semibold">Category:</span> {c.category}
      </p>

      <p className="mb-2">
        <span className="font-semibold">Assigned To:</span>{" "}
        {c.assignedTo
          ? `${c.assignedTo.name} (${c.assignedTo.staffType})`
          : "None"}
      </p>

      {/* Student Info */}
      <p className="mb-1">
        <span className="font-semibold">Student Email:</span>{" "}
        {c.student?.email || "N/A"}
      </p>
      <p className="mb-1">
        <span className="font-semibold">Hostel:</span>{" "}
        {c.student?.hostelName || "N/A"}
      </p>
      <p className="mb-1">
        <span className="font-semibold">Room Number:</span>{" "}
        {c.student?.roomNumber || "N/A"}
      </p>

      {/* Status Buttons */}
      <div className="flex space-x-2 mt-2">
        <button
          onClick={() => updateStatus(c._id, "in-progress")}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          In Progress
        </button>
        {/* <button
          onClick={() => updateStatus(c._id, "resolved")}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Resolved
        </button> */}
      </div>
    </div>
  ))}
</div>

    </div>
  );
}

export default StaffDashboard;
