import express from "express";
import {
  createTicket,
  getProjectTickets,
  getAllUserTickets,
  updateTicket,
  deleteTicket,
  assignTicket,
  getKanbanTickets,
  updateTicketStatus
} from "../controllers/ticketController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createTicket);

router.get("/all", getAllUserTickets);

router.get("/project/:projectId", getProjectTickets);

router.put("/:id", updateTicket);

router.put("/:id/assign", assignTicket);

router.delete("/:id", deleteTicket);

router.get("/kanban", protect, getKanbanTickets);

router.put("/:id/status", protect, updateTicketStatus);


export default router;
