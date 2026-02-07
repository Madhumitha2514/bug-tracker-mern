import Ticket from "../models/Ticket.js";
import Project from "../models/Project.js";
import mongoose from "mongoose";

// Get stats for a specific project
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.query; // Get projectId from query params

    let query = { createdBy: userId };

    // If projectId is provided, filter by project
    if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
      query.project = projectId;
    }

    const tickets = await Ticket.find(query);

    const stats = {
      totalTickets: tickets.length,
      todoTickets: tickets.filter((t) => t.status === "Todo").length,
      inProgress: tickets.filter((t) => t.status === "InProgress").length,
      completed: tickets.filter((t) => t.status === "Done").length,
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get chart data for trends (last 7 days)
export const getDashboardChart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.query;

    let query = { createdBy: userId };

    if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
      query.project = projectId;
    }

    // Get tickets from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const tickets = await Ticket.find({
      ...query,
      createdAt: { $gte: thirtyDaysAgo },
    }).sort({ createdAt: 1 });

    // Group by date for line chart
    const dateMap = {};
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      dateMap[dateStr] = 0;
      last7Days.push(dateStr);
    }

    tickets.forEach((ticket) => {
      const dateStr = ticket.createdAt.toISOString().split("T")[0];
      if (dateMap[dateStr] !== undefined) {
        dateMap[dateStr]++;
      }
    });

    const lineChartData = last7Days.map((date) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      tickets: dateMap[date],
    }));

    // Status distribution for bar chart
    const allTickets = await Ticket.find(query);

    const barChartData = [
      {
        status: "Todo",
        count: allTickets.filter((t) => t.status === "Todo").length,
      },
      {
        status: "In Progress",
        count: allTickets.filter((t) => t.status === "InProgress").length,
      },
      {
        status: "Done",
        count: allTickets.filter((t) => t.status === "Done").length,
      },
    ];

    res.json({
      lineChart: lineChartData,
      barChart: barChartData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};