# 🐛 Bug Tracker - Enterprise Project Management System

<div align="center">

![Bug Tracker Banner](https://via.placeholder.com/1200x300/4F46E5/ffffff?text=Bug+Tracker+-+MERN+Stack+Project)

**A full-stack project management and issue tracking system built with the MERN stack**

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://bug-tracker-mern-sooty.vercel.app/)
[![Backend](https://img.shields.io/badge/backend-render-blue)](https://bug-tracker-mern-7t50.onrender.com)
[![MongoDB](https://img.shields.io/badge/database-mongodb-green)](https://mongodb.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Live Demo](https://bug-tracker-mern-sooty.vercel.app/) • [Video Demo](https://www.loom.com/share/ec85a85f637f452eb09b461133de657c) • [Report Bug](https://github.com/Madhumitha2514/bug-tracker-mern/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Live Demo](#-live-demo)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Development Timeline](#-development-timeline)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 Overview

Bug Tracker is a modern, full-stack project management application designed to streamline team collaboration and issue tracking. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), it provides a comprehensive solution for managing projects, tracking bugs, and facilitating team communication.

**Why Bug Tracker?**
- 🚀 **Production-Ready**: Deployed on industry-standard platforms (Vercel + Render)
- 🎨 **Modern UI/UX**: Clean, intuitive interface built with Tailwind CSS
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- 🔒 **Secure**: JWT authentication with bcrypt password hashing
- ⚡ **Real-time Updates**: Instant notifications for team activities

---

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication**: Secure user registration and login
- **Protected Routes**: Middleware-based route protection
- **Password Security**: bcrypt hashing for password storage
- **Session Management**: Token-based session handling

### 📊 Dashboard & Analytics
- **Real-time KPIs**: Total tickets, To Do, In Progress, Completed
- **Interactive Charts**: 
  - Line chart showing 7-day ticket creation trend (Recharts)
  - Bar chart displaying status distribution
- **Project Overview**: Quick access to active projects
- **Dynamic Filters**: Search and filter tickets by multiple criteria

### 🎯 Kanban Board
- **Drag-and-Drop**: Smooth ticket movement between columns using @hello-pangea/dnd
- **Three Columns**: To Do, In Progress, Done
- **Real-time Updates**: Status changes reflect immediately
- **Visual Indicators**: Priority badges, assignee avatars
- **Quick Actions**: Add tickets directly from board

### 🎫 Ticket Management
- **Full CRUD Operations**: Create, Read, Update, Delete tickets
- **Rich Metadata**:
  - Title and description
  - Priority levels (Low, Medium, High)
  - Status tracking (Todo, InProgress, Done)
  - Assignee selection
  - Due dates
  - Created/Updated timestamps
- **Advanced Filtering**: By status, priority, assignee, or keyword search
- **Bulk Operations**: Multi-ticket management

### 💬 Collaboration Features
- **Comments System**: 
  - Add, edit, delete comments
  - User attribution with avatars
  - Timestamps with "time ago" formatting (date-fns)
  - Threaded discussions
- **Real-time Notifications**:
  - Ticket assignments
  - New comments
  - Status changes
  - Project updates
  - Unread count badge
  - Mark as read/unread

### 👥 Team Management
- **Project Creation**: Organize work into projects
- **Member Management**: Add/remove team members
- **User Directory**: Browse all registered users
- **Role Tracking**: Track project ownership

### 🔍 Search & Filter
- **Global Search**: Search across all tickets
- **Multi-criteria Filters**:
  - Filter by priority
  - Filter by assignee
  - Filter by status
  - Keyword search in titles/descriptions
- **Real-time Results**: Instant filter application

### 📱 Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Perfect layout for tablets (768px - 1024px)
- **Desktop Experience**: Full-featured desktop interface
- **Touch-Friendly**: Large tap targets for mobile users
- **Horizontal Scroll**: Mobile Kanban board with snap scrolling

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with hooks |
| **Tailwind CSS** | Utility-first styling |
| **React Router DOM** | Client-side routing |
| **@hello-pangea/dnd** | Drag-and-drop functionality |
| **Recharts** | Data visualization charts |
| **Axios** | HTTP client for API calls |
| **React Hot Toast** | Toast notifications |
| **Lucide React** | Icon library |
| **date-fns** | Date formatting utilities |
| **Vite** | Build tool and dev server |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication tokens |
| **bcrypt.js** | Password hashing |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |

### DevOps & Deployment
| Platform | Purpose |
|----------|---------|
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting |
| **MongoDB Atlas** | Cloud database |
| **GitHub** | Version control |
| **GitHub Desktop** | Git GUI client |

---

## 🌐 Live Demo

**🔗 Application URL**: [https://bug-tracker-mern-sooty.vercel.app/](https://bug-tracker-mern-sooty.vercel.app/)

**🎥 Video Demonstration**: [Watch on Loom](https://www.loom.com/share/ec85a85f637f452eb09b461133de657c)

**Test Credentials** :
```
Email: demo@bugtracker.com
Password: demo123
```

**Backend API**: [https://bug-tracker-mern-7t50.onrender.com](https://bug-tracker-mern-7t50.onrender.com)

---

## 📸 Screenshots

### 🔐 Authentication
<img src="screenshots/login.png" alt="Login Page" width="800"/>

*Modern login interface with gradient background*

### 📊 Dashboard
<img src="screenshots/dashboard.png" alt="Dashboard" width="800"/>

*Real-time KPIs, Kanban board, and analytics charts*

### 🎯 Kanban Board
<img src="screenshots/kanban.png" alt="Kanban Board" width="800"/>

*Drag-and-drop ticket management with visual indicators*

### 📁 Projects Management
<img src="screenshots/projects.png" alt="Projects" width="800"/>

*Project cards with member avatars and quick actions*

### 🎫 Ticket Details
<img src="screenshots/ticket-modal.png" alt="Ticket Details" width="800"/>

*Comprehensive ticket view with comments section*

### 📱 Mobile Responsive
<img src="screenshots/mobile.png" alt="Mobile View" width="400"/>

*Fully optimized mobile experience*

---

## 🚀 Installation

### Prerequisites
Before you begin, ensure you have:
- **Node.js** >= 18.0.0 ([Download](https://nodejs.org))
- **npm** >= 9.0.0 (comes with Node.js)
- **MongoDB Atlas** account ([Sign up](https://mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com))

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Madhumitha2514/bug-tracker-mern.git
cd bug-tracker-mern
```

### 2️⃣ Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

**Create `.env` file in backend directory:**
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bugtracker?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Start backend server:**
```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

✅ **Test backend**: Visit `http://localhost:5000` - you should see API status

### 3️⃣ Frontend Setup

**Open new terminal:**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

**Create `.env` file in frontend directory:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Start frontend development server:**
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

✅ **Open browser**: Navigate to `http://localhost:5173`

### 4️⃣ MongoDB Atlas Setup

1. **Create Cluster**:
   - Sign up at [MongoDB Atlas](https://mongodb.com/cloud/atlas)
   - Create a free M0 cluster
   - Choose your closest region

2. **Create Database User**:
   - Database Access → Add New Database User
   - Username: `your_username`
   - Password: `your_password`
   - Role: Read and Write to any database

3. **Whitelist IP**:
   - Network Access → Add IP Address
   - Select "Allow Access from Anywhere" (0.0.0.0/0)

4. **Get Connection String**:
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your database user password
   - Add database name: `/bugtracker`

---

## 📡 API Documentation

### Base URL
```
Local: http://localhost:5000/api
Production: https://bug-tracker-mern-7t50.onrender.com/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Project Endpoints

#### Get All Projects
```http
GET /api/projects
Authorization: Bearer {token}
```

#### Create Project
```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Website Redesign",
  "description": "Redesign company website"
}
```

### Ticket Endpoints

#### Get Kanban Board
```http
GET /api/tickets/kanban?projectId={projectId}
Authorization: Bearer {token}
```

#### Create Ticket
```http
POST /api/tickets
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Fix login bug",
  "description": "Users can't login with special characters",
  "priority": "High",
  "status": "Todo",
  "projectId": "507f1f77bcf86cd799439011",
  "assignee": "507f1f77bcf86cd799439012"
}
```

#### Update Ticket Status (Drag & Drop)
```http
PUT /api/tickets/{ticketId}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "InProgress"
}
```

### Notification Endpoints

#### Get User Notifications
```http
GET /api/notifications
Authorization: Bearer {token}
```

#### Mark Notification as Read
```http
PUT /api/notifications/{notificationId}/read
Authorization: Bearer {token}
```

---

## 📁 Project Structure
```
bug-tracker-mern/
│
├── backend/
│   ├── controllers/           # Request handlers
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── ticketController.js
│   │   ├── commentController.js
│   │   ├── notificationController.js
│   │   └── dashboardController.js
│   │
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Ticket.js
│   │   ├── Comment.js
│   │   └── Notification.js
│   │
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── ticketRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── dashboardRoutes.js
│   │
│   ├── middleware/            # Custom middleware
│   │   └── authMiddleware.js  # JWT verification
│   │
│   ├── .env                   # Environment variables
│   ├── server.js              # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/               # API client
│   │   │   └── axios.js       # Axios configuration
│   │   │
│   │   ├── components/        # Reusable components
│   │   │   ├── Topbar.jsx
│   │   │   ├── ProjectSelector.jsx
│   │   │   ├── CreateTicketModal.jsx
│   │   │   ├── TicketDetailsModal.jsx
│   │   │   ├── AddMembersModal.jsx
│   │   │   ├── TicketComments.jsx
│   │   │   ├── LineChart.jsx
│   │   │   ├── BarChart.jsx
│   │   │   ├── BreadCrumb.jsx
│   │   │   └── ToastProvider.jsx
│   │   │
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── AllTickets.jsx
│   │   │   ├── Members.jsx
│   │   │   └── Settings.jsx
│   │   │
│   │   ├── context/           # React Context
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   │
│   ├── .env                   # Environment variables
│   ├── index.html
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind configuration
│   └── package.json
│
├── screenshots/               # Application screenshots
├── README.md                  # This file
└── .gitignore
```

---

## ⏱️ Development Timeline

**Total Duration**: 14 days (2 weeks)

### Week 1: Core Development
| Day | Focus | Status |
|-----|-------|--------|
| **Day 1** | Project setup, folder structure, dependencies | ✅ Complete |
| **Day 2** | Authentication system (JWT + bcrypt) | ✅ Complete |
| **Day 3** | Project management (CRUD + members) | ✅ Complete |
| **Day 4** | Ticket backend APIs | ✅ Complete |
| **Day 5** | Ticket frontend forms and display | ✅ Complete |
| **Day 6** | Dashboard layout with KPIs and charts | ✅ Complete |
| **Day 7** | Testing with Postman, bug fixes | ✅ Complete |

### Week 2: Advanced Features & Deployment
| Day | Focus | Status |
|-----|-------|--------|
| **Day 8** | Kanban drag-and-drop (@hello-pangea/dnd) | ✅ Complete |
| **Day 9** | Comments system with edit/delete | ✅ Complete |
| **Day 10** | Filtering, search, notifications | ✅ Complete |
| **Day 11** | Edit/delete tickets, permissions | ✅ Complete |
| **Day 12** | **Deployment** (Render + Vercel + MongoDB Atlas) | ✅ Complete |
| **Day 13** | Mobile responsive design + README | ✅ Complete |
| **Day 14** | Testing + demo video + documentation | ✅ Complete |

---

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create Render Account**: [render.com](https://render.com)
2. **New Web Service**: Connect GitHub repository
3. **Configuration**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Environment Variables**: Add all variables from `.env`
5. **Deploy**: Auto-deploys on git push

### Frontend Deployment (Vercel)

1. **Create Vercel Account**: [vercel.com](https://vercel.com)
2. **Import Project**: Connect GitHub repository
3. **Configuration**:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**: Add `VITE_API_URL`
5. **Deploy**: Auto-deploys on git push

### Database (MongoDB Atlas)

1. **Create Cluster**: Free M0 tier
2. **Network Access**: Whitelist 0.0.0.0/0 (allow all)
3. **Database User**: Create with read/write permissions
4. **Connection String**: Use in `MONGO_URI` environment variable

---

## 🔮 Future Enhancements

### Planned Features
- [ ] **File Attachments**: Upload screenshots and documents to tickets
- [ ] **Activity Timeline**: View complete project history
- [ ] **Email Notifications**: Send email alerts for important activities
- [ ] **Advanced Permissions**: Role-based access control (Admin, Manager, Developer, Viewer)
- [ ] **Sprint Planning**: Agile sprint management
- [ ] **Time Tracking**: Log hours spent on tickets
- [ ] **Custom Fields**: User-defined ticket fields
- [ ] **Reports**: Generate PDF reports
- [ ] **Integrations**: Slack, GitHub, Jira import
- [ ] **Dark Mode**: Theme toggle
- [ ] **Multi-language**: i18n support
- [ ] **Real-time Collaboration**: WebSocket integration
- [ ] **API Rate Limiting**: Prevent abuse
- [ ] **Automated Testing**: Jest + React Testing Library

### Performance Optimizations
- [ ] Redis caching layer
- [ ] CDN for static assets
- [ ] Image optimization
- [ ] Code splitting
- [ ] Service workers (PWA)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to branch**: `git push origin feature/AmazingFeature`
5. **Open Pull Request**

### Contribution Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Keep commits atomic and well-described

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
```
MIT License

Copyright (c) 2024 Madhumitha G

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

---

## 👨‍💻 Author

<div align="center">

**Madhumitha G**

Full Stack Developer | MERN Stack Specialist

[![GitHub](https://img.shields.io/badge/GitHub-Madhumitha2514-black?style=flat&logo=github)](https://github.com/Madhumitha2514)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://linkedin.com/in/yourprofile)
[![Email](https://img.shields.io/badge/Email-Contact-red?style=flat&logo=gmail)](mailto:your.email@example.com)

</div>

---

## 🙏 Acknowledgments

- **Inspiration**: Jira, Linear, Asana
- **Icons**: [Lucide Icons](https://lucide.dev)
- **UI Components**: Custom Tailwind CSS
- **Charts**: [Recharts](https://recharts.org)
- **Drag & Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)

---

## 📞 Support

If you encounter any issues or have questions:

1. **Check Existing Issues**: [GitHub Issues](https://github.com/Madhumitha2514/bug-tracker-mern/issues)
2.2. **Create New Issue**: Provide detailed description with screenshots
```

---

## **COMMIT THE CHANGES:**

1. **Scroll to bottom**
2. **Commit message:** `Add Loom video demo link and update contact info`
3. **Click "Commit changes"**

---

# 🎉 **CONGRATULATIONS! YOUR PROJECT IS COMPLETE!**

---

## ✅ **FINAL CHECKLIST:**

### **Deployment:**
- [x] ✅ Backend deployed on Render: https://bug-tracker-mern-7t50.onrender.com
- [x] ✅ Frontend deployed on Vercel: https://bug-tracker-mern-sooty.vercel.app
- [x] ✅ MongoDB Atlas configured
- [x] ✅ All features tested and working

### **Documentation:**
- [x] ✅ Comprehensive README on GitHub
- [x] ✅ Video demo recorded and linked
- [x] ✅ API documentation included
- [x] ✅ Installation instructions clear

### **Code Quality:**
- [x] ✅ Clean code structure
- [x] ✅ Comments where needed
- [x] ✅ Environment variables secured
- [x] ✅ Error handling implemented

---

## 📊 **YOUR FINAL PROJECT URLS:**
```
🌐 Live Application:
https://bug-tracker-mern-sooty.vercel.app/

🔗 Backend API:
https://bug-tracker-mern-7t50.onrender.com

📹 Video Demo:
https://www.loom.com/share/ec85a85f637f452eb09b461133de657c

💻 GitHub Repository:
https://github.com/Madhumitha2514/bug-tracker-mern

📧 Contact:
madhumithag2514@gmail.com
```

---

## 🎯 **WHAT YOU'VE ACCOMPLISHED:**

✅ **Built a full-stack MERN application** with:
- JWT Authentication
- Real-time Dashboard with KPIs
- Drag-and-drop Kanban Board
- Comments & Notifications
- Advanced Filtering
- Team Collaboration
- Fully Responsive Design

✅ **Deployed to production** on:
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

✅ **Created professional documentation:**
- Comprehensive README
- Video demonstration
- API documentation

---

## 🚀 **NEXT STEPS (OPTIONAL):**

### **1. Share Your Project:**

**LinkedIn Post (if you create account later):**
```
🎉 Excited to share my latest project: Bug Tracker!

A full-stack MERN project management system with:
✅ Real-time dashboards
✅ Drag-and-drop Kanban boards
✅ Team collaboration features
✅ Notifications system

Built with React, Node.js, Express, MongoDB
Deployed on Vercel & Render

🔗 Live Demo: https://bug-tracker-mern-sooty.vercel.app
📹 Video: https://www.loom.com/share/ec85a85f637f452eb09b461133de657c
💻 GitHub: https://github.com/Madhumitha2514/bug-tracker-mern

#MERN #WebDevelopment #FullStack #React #NodeJS
3. **Email**: madhumithag2514@gmail.com

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ and ☕ by Madhumitha G

[⬆ Back to Top](#-bug-tracker---enterprise-project-management-system)

</div>
