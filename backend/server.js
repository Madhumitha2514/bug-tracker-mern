import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from './routes/projectRoutes.js';
import ticketRoutes from "./routes/ticketRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from './routes/userRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const app = express();

// ✅ IMPROVED CORS - Allow frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now, will restrict after deployment
    }
  },
  credentials: true
}));

app.use(express.json());

// DB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/projects', projectRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);

// ✅ Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "🐛 Bug Tracker API Running",
    status: "active",
    timestamp: new Date().toISOString()
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});