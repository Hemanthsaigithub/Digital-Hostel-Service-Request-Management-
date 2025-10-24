import React, { useState, useEffect } from "react";
import API from "../api";
import { getStatusColor } from "../utils/statusColor";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [staffList, setStaffList] = useState({});
  const [selectedStaff, setSelectedStaff] = useState({});

  // const fetchComplaints = async () => {
  //   const res = await API.get("/complaints/all");
  //   setComplaints(res.data);

  //   res.data.forEach(async (c) => {
  //     let type = null;
  //     if (c.category === "electricity") type = "electrician";
  //     else if (c.category === "plumbing") type = "plumber";
  //     else if (c.category === "carpentry") type = "carpenter";

  //     const staffRes = await API.get(`/auth/staff${type ? `?staffType=${type}` : ""}`);
  //     setStaffList((prev) => ({ ...prev, [c._id]: staffRes.data }));
  //   });
  // };
  const fetchComplaints = async () => {
  const res = await API.get("/complaints/all");
  let data = res.data;

  // Sort by status and assignment
  const statusOrder = { "pending": 0, "in-progress": 1, "resolved": 2 };
  data.sort((a, b) => {
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status]; // pending → in-progress → resolved
    }
    if (!a.assignedTo && b.assignedTo) return -1; // unassigned first
    if (a.assignedTo && !b.assignedTo) return 1;
    return 0; // same status & same assignment
  });

  setComplaints(data);

  // Fetch staff for each complaint
  data.forEach(async (c) => {
    let type = null;
    if (c.category === "electricity") type = "electrician";
    else if (c.category === "plumbing") type = "plumber";
    else if (c.category === "carpentry") type = "carpenter";

    const staffRes = await API.get(`/auth/staff${type ? `?staffType=${type}` : ""}`);
    setStaffList((prev) => ({ ...prev, [c._id]: staffRes.data }));
  });
};


  const assignComplaint = async (id) => {
    if (!selectedStaff[id]) return alert("Select staff to assign");
    await API.put(`/complaints/${id}/assign/${selectedStaff[id]}`);
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">Admin Dashboard</h2>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

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

      {/* 🧑‍🎓 Student Email */}
      <p className="mb-2">
        <span className="font-semibold">Student Email:</span>{" "}
        {c.student.email}
      </p>

      {/* 🕒 Complaint Time */}
      <p className="mb-2">
        <span className="font-semibold">Submitted On:</span>{" "}
        {new Date(c.createdAt).toLocaleString()}
      </p>

      <div className="flex items-center space-x-2 mt-3">
  {!c.assignedTo && (
    <>
      <select
        value={selectedStaff[c._id] || ""}
        onChange={(e) =>
          setSelectedStaff((prev) => ({
            ...prev,
            [c._id]: e.target.value,
          }))
        }
        className="p-2 border rounded flex-1"
      >
        <option value="">Select Staff</option>
        {staffList[c._id]?.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name} ({s.staffType})
          </option>
        ))}
      </select>
      <button
        onClick={() => assignComplaint(c._id)}
        className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Assign
      </button>
    </>
  )}
</div>

    </div>
  ))}
</div>

    </div>
  );
}

export default AdminDashboard;
