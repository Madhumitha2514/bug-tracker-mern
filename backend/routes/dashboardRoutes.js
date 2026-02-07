import express from "express";
import { getDashboardStats, getDashboardChart } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.get("/chart", protect, getDashboardChart);

export default router;
