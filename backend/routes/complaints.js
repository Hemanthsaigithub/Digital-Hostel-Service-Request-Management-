import express from "express";
import Complaint from "../models/Complaint.js";
import { authMiddleware, permit } from "../middleware/auth.js";

const router = express.Router();

// Student: create complaint
router.post("/", authMiddleware, permit("student"), async (req, res) => {
  const { title, description, category } = req.body;
  const complaint = await Complaint.create({
    student: req.user._id,
    title,
    description,
    category,
  });
  res.json(complaint);
});
const statusOrder = ["pending", "in-progress", "resolved"];

// Student: get own complaints
router.get("/my", authMiddleware, permit("student"), async (req, res) => {
  const complaints = await Complaint.find({ student: req.user._id }).populate("assignedTo", "name staffType");
  complaints.sort(
  (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
);
  res.json(complaints);
});

// Staff: get assigned complaints
router.get("/assigned", authMiddleware, permit("staff"), async (req, res) => {
  const complaints = await Complaint.find({ assignedTo: req.user._id })
  .populate("student","name email rollNo hostelName roomNumber")
  .populate("assignedTo", "name staffType");
  complaints.sort(
  (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
);
  res.json(complaints);
});

// Admin: get all complaints

router.get("/all", authMiddleware, permit("admin"), async (req, res) => {
  const complaints = await Complaint.find()
  .populate("student","name email rollNo hostelName roomNumber")
  .populate("assignedTo", "name staffType");
  complaints.sort(
  (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
);
  res.json(complaints);
});

// Staff/Admin: update status
router.put("/:id/status", authMiddleware, permit("student","staff","admin"), async (req, res) => {
  const { status } = req.body;
  const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(complaint);
});

// Admin: assign staff
router.put("/:id/assign/:staffId", authMiddleware, permit("admin"), async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(req.params.id, { assignedTo: req.params.staffId }, { new: true });
  res.json(complaint);
});

export default router;
