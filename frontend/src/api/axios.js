import axios from "axios";
import toast from 'react-hot-toast';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    toast.error(message);
    return Promise.reject(error);
  }
);

// ================= AUTH =================
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

// ================= PROJECT =================
export const createProject = (data) => API.post("/projects", data);
export const getUserProjects = () => API.get("/projects");
export const getProjectById = (id) => API.get(`/projects/${id}`);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);
export const addMember = (id, userId) => API.post(`/projects/${id}/members`, { userId });
export const removeMember = (id, userId) => API.delete(`/projects/${id}/members`, { data: { userId } });

// ================= TICKETS =================
export const createTicket = (data) => API.post("/tickets", data);
export const getProjectTickets = (projectId) => API.get(`/tickets/project/${projectId}`);
export const getAllTickets = () => API.get("/tickets/all"); // NEW
export const updateTicket = (id, data) => API.put(`/tickets/${id}`, data);
export const deleteTicket = (id) => API.delete(`/tickets/${id}`);
export const assignTicket = (ticketId, userId) => API.put(`/tickets/${ticketId}/assign`, { userId });

// ================= USERS =================
export const getAllUsers = () => API.get("/users"); // NEW - for member selection

// ================= COMMENTS =================
export const createComment = (data) => API.post("/comments", data);
export const getTicketComments = (ticketId) => API.get(`/comments/ticket/${ticketId}`);
export const updateComment = (id, data) => API.put(`/comments/${id}`, data);
export const deleteComment = (id) => API.delete(`/comments/${id}`);

// ================= NOTIFICATIONS =================
export const getNotifications = () => API.get("/notifications");
export const markNotificationAsRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllNotificationsAsRead = () => API.put("/notifications/read-all");
export const deleteNotification = (id) => API.delete(`/notifications/${id}`);

export default API;