import { Bell, Search, Filter, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../api/axios";
import { formatDistanceToNow } from "date-fns";

export default function Topbar({
  user,
  searchTerm,
  setSearchTerm,
  priorityFilter,
  setPriorityFilter,
  assigneeFilter,
  setAssigneeFilter,
  assignees = [],
}) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openNotify, setOpenNotify] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const notifyRef = useRef();

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!notifyRef.current?.contains(e.target)) {
        setOpenNotify(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      fetchNotifications();
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "ticket_assigned":
        return "🎯";
      case "ticket_comment":
        return "💬";
      case "ticket_status_changed":
        return "📝";
      case "project_member_added":
        return "👥";
      case "ticket_created":
        return "✨";
      default:
        return "🔔";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm mb-4 md:mb-6 px-4 md:px-6 py-3 md:py-4">
      {/* Top Row */}
      <div className="flex items-center justify-between gap-3 mb-3 md:mb-4">
        {/* Greeting - RESPONSIVE TEXT */}
        <h2 className="text-sm md:text-lg font-semibold text-gray-700 truncate">
          Welcome back, <span className="text-blue-600">{user?.name || "User"}</span> 👋
        </h2>

        {/* Right Side - Notifications & Filter */}
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
          {/* Notification Bell */}
          <div ref={notifyRef} className="relative">
            <button
              onClick={() => setOpenNotify(!openNotify)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Notifications"
            >
              <Bell className="text-gray-600" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown - MOBILE RESPONSIVE */}
            {openNotify && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border rounded-xl shadow-lg z-50 max-h-[70vh] sm:max-h-96 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-3 md:p-4 border-b flex items-center justify-between sticky top-0 bg-white">
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="overflow-y-auto flex-1">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="mx-auto text-gray-300 mb-2" size={36} />
                      <p className="text-sm text-gray-500">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {notifications.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => !notif.read && handleMarkAsRead(notif._id)}
                          className={`p-3 md:p-4 hover:bg-gray-50 cursor-pointer transition ${
                            !notif.read ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-2 md:gap-3">
                            <span className="text-xl md:text-2xl flex-shrink-0">
                              {getNotificationIcon(notif.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs md:text-sm text-gray-800 font-medium mb-1 break-words">
                                {notif.message}
                              </p>
                              <p className="text-[10px] md:text-xs text-gray-500">
                                {formatDistanceToNow(new Date(notif.createdAt), {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                            {!notif.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Filter Toggle Button - RESPONSIVE */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-xs md:text-sm font-medium text-gray-700"
          >
            <Filter size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Filters Row (Collapsible) - MOBILE STACKED */}
      {showFilters && (
        <div className="pt-3 md:pt-4 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            {/* Assignee Filter */}
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Assignees</option>
              <option value="Unassigned">Unassigned</option>
              {assignees.map((assignee) => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}