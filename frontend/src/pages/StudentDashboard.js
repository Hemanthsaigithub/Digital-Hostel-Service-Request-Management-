import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { getStatusColor } from "../utils/statusColor";

function StudentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("general");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchComplaints = async () => {
    const res = await API.get("/complaints/my");
    setComplaints(res.data);
  };

  const addComplaint = async () => {
    if (!title || !desc) return alert("Please fill title and description");
    await API.post("/complaints", { title, description: desc, category });
    setTitle("");
    setDesc("");
    setCategory("general");
    fetchComplaints();
  };

  const markResolved = async (id) => {
    try {
      await API.put(`/complaints/${id}/status`, { status: "resolved" });
      fetchComplaints();
    } catch (err) {
      alert("Failed to update complaint status");
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    fetchComplaints();
    const interval = setInterval(fetchComplaints, 2000);
    return () => clearInterval(interval);
  }, []);

  // const updateStatus = async (id, status) => {
  //   await API.put(`/complaints/${id}/status`, { status });
  //   fetchComplaints();
  // };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-orange-600">Student Dashboard</h2>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Student Info */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">Welcome, {user.name}</h3>
        <p><span className="font-semibold">Roll No:</span> {user.rollNo}</p>
        <p><span className="font-semibold">Hostel:</span> {user.hostelName}</p>
        <p><span className="font-semibold">Room:</span> {user.roomNumber}</p>
      </div>

      {/* Create Complaint */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-xl font-semibold mb-4">Create Complaint</h3>
        <div className="flex flex-col space-y-3">
          <input
            className="p-2 border rounded w-full"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="p-2 border rounded w-full"
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <select
            className="p-2 border rounded w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="general">General</option>
            <option value="electricity">Electricity</option>
            <option value="plumbing">Plumbing</option>
            <option value="carpentry">Carpentry</option>
          </select>
          <button
            onClick={addComplaint}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">My Complaints</h3>
        <div className="space-y-4">
          {complaints.map((c) => {
            const date = new Date(c.createdAt);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            return (
              <div key={c._id} className="p-3 border rounded shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center mb-1">
                  <strong className="text-lg">{c.title}</strong>
                  <span
                    className="text-white px-3 py-1 rounded font-bold text-sm"
                    style={{ backgroundColor: getStatusColor(c.status) }}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="mb-1">
                   <span className="font-semibold">Complaint Date:</span> {formattedDate} at {formattedTime}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Category:</span> {c.category}
                </p>
                <p>
                  <span className="font-semibold">Assigned Staff:</span>{" "}
                  {c.assignedTo
                    ? `${c.assignedTo.name} (${c.assignedTo.staffType})`
                    : "Not assigned yet"}
                </p>
                {c.status === "in-progress" && (
                  <div className="mt-3">
                    <button
                      onClick={() => markResolved(c._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Mark as Resolved
                    </button>
                  </div>
                )}
                {/* <div className="flex space-x-2 mt-2">
        <button
          onClick={() => updateStatus(c._id, "in-progress")}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          In Progress
        </button>
        <button
          onClick={() => updateStatus(c._id, "resolved")}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Resolved
        </button>
      </div> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
