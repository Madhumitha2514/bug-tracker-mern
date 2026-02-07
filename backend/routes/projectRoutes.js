import express from 'express';
import {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js'; // Your auth middleware

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/', createProject);
router.get('/', getUserProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/members', addMember);
router.delete('/:id/members', removeMember);

export default router;