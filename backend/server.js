import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import complaintRoutes from "./routes/complaints.js";
import User from "./models/User.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    seedAdminStaff(); // seed default accounts
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));

// --------------------
// Seed Function
// --------------------
async function seedAdminStaff() {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      const hash = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Hostel Admin",
        email: "admin@hostel.com",
        passwordHash: hash,
        role: "admin",
      });
      console.log("✅ Default admin created (admin@hostel.com / admin123)");
    }

    const staffTypes = [
      { name: "Electrician Staff", email: "electrician@hostel.com", staffType: "electrician" },
      { name: "Plumber Staff", email: "plumber@hostel.com", staffType: "plumber" },
      { name: "Carpenter Staff", email: "carpenter@hostel.com", staffType: "carpenter" },
    ];

    for (let staff of staffTypes) {
      const exists = await User.findOne({ email: staff.email });
      if (!exists) {
        const hash = await bcrypt.hash("staff123", 10);
        await User.create({
          name: staff.name,
          email: staff.email,
          passwordHash: hash,
          role: "staff",
          staffType: staff.staffType,
        });
        console.log(`✅ Default staff created (${staff.email} / staff123)`);
      }
    }
  } catch (err) {
    console.error("Error seeding default users:", err);
  }
}
