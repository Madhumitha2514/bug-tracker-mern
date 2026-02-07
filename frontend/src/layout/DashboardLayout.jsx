import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Breadcrumb from "../components/BreadCrumb";

import {
  LayoutDashboard,
  FolderKanban,
  Ticket,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
    isActive
      ? "bg-blue-600 text-white font-semibold"
      : "text-gray-300 hover:bg-gray-800 hover:text-white"
  }`;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button - FIXED POSITION */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2.5 rounded-lg shadow-lg hover:bg-gray-800 transition"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          bg-gray-900 text-white shadow-xl
          transition-all duration-300 ease-in-out
          ${collapsed ? "md:w-20" : "md:w-64"}
          ${mobileOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0"}
          flex flex-col
        `}
      >
        {/* Logo + Toggle */}
        <div className="p-4 md:p-5 border-b border-gray-800 flex items-center justify-between">
          {(!collapsed || mobileOpen) && (
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                🐛 Bug Tracker
              </h2>
              <p className="text-xs text-gray-400 mt-1">Project Management</p>
            </div>
          )}

          {/* Desktop Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block p-2 hover:bg-gray-800 rounded-lg transition"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          {/* Mobile Close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 md:p-4 space-y-2 overflow-y-auto">
          <NavLink
            to="/dashboard"
            className={navClass}
            onClick={() => setMobileOpen(false)}
          >
            <LayoutDashboard size={20} className="flex-shrink-0" />
            {(!collapsed || mobileOpen) && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/projects"
            className={navClass}
            onClick={() => setMobileOpen(false)}
          >
            <FolderKanban size={20} className="flex-shrink-0" />
            {(!collapsed || mobileOpen) && <span>Projects</span>}
          </NavLink>

          <NavLink
            to="/tickets"
            className={navClass}
            onClick={() => setMobileOpen(false)}
          >
            <Ticket size={20} className="flex-shrink-0" />
            {(!collapsed || mobileOpen) && <span>Tickets</span>}
          </NavLink>

          <NavLink
            to="/members"
            className={navClass}
            onClick={() => setMobileOpen(false)}
          >
            <Users size={20} className="flex-shrink-0" />
            {(!collapsed || mobileOpen) && <span>Members</span>}
          </NavLink>

          <NavLink
            to="/settings"
            className={navClass}
            onClick={() => setMobileOpen(false)}
          >
            <Settings size={20} className="flex-shrink-0" />
            {(!collapsed || mobileOpen) && <span>Settings</span>}
          </NavLink>
        </nav>

        {/* User Section - IMPROVED MOBILE */}
        <div className="p-3 md:p-4 border-t border-gray-800">
          <div className="bg-gray-800 rounded-lg p-3 md:p-4">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs md:text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>

              {(!collapsed || mobileOpen) && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-xs md:text-sm font-medium ${
                collapsed && !mobileOpen ? "px-2" : ""
              }`}
            >
              <LogOut size={16} />
              {(!collapsed || mobileOpen) && "Logout"}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumb - RESPONSIVE PADDING */}
        <div className="bg-white shadow-sm px-4 md:px-6 py-3 md:py-4 border-b">
          <Breadcrumb />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;