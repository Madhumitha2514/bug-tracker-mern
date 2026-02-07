import { useEffect, useState } from "react";
import API from "../api/axios";
import Topbar from "../components/Topbar";

import { Ticket, Loader2, CheckCircle, Plus, Pencil } from "lucide-react";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import TicketDetailsModal from "../components/TicketDetailsModal";
import CreateTicketModal from "../components/CreateTicketModal";
import ProjectSelector from "../components/ProjectSelector";
import TicketLineChart from "../components/LineChart";
import TicketBarChart from "../components/BarChart";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTickets: 0,
    todoTickets: 0,
    inProgress: 0,
    completed: 0,
  });

  const [chartData, setChartData] = useState({
    lineChart: [],
    barChart: [],
  });

  const [kanban, setKanban] = useState({
    Todo: [],
    InProgress: [],
    Done: [],
  });

  const [filteredKanban, setFilteredKanban] = useState({
    Todo: [],
    InProgress: [],
    Done: [],
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");

  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(null);

  const STATUS_LABEL = {
    Todo: "To Do",
    InProgress: "In Progress",
    Done: "Done",
  };

  const [loadingKanban, setLoadingKanban] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingCharts, setLoadingCharts] = useState(true);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [createStatus, setCreateStatus] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (currentProjectId) {
      fetchStats();
      fetchKanban();
      fetchChartData();
    }
  }, [currentProjectId]);

  useEffect(() => {
    applyFilters();
  }, [kanban, searchTerm, priorityFilter, assigneeFilter]);

  /* ================= FILTERS ================= */
  const applyFilters = () => {
    let filtered = { ...kanban };

    if (searchTerm) {
      Object.keys(filtered).forEach((status) => {
        filtered[status] = filtered[status].filter((ticket) =>
          ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (priorityFilter !== "All") {
      Object.keys(filtered).forEach((status) => {
        filtered[status] = filtered[status].filter(
          (ticket) => ticket.priority === priorityFilter
        );
      });
    }

    if (assigneeFilter !== "All") {
      Object.keys(filtered).forEach((status) => {
        filtered[status] = filtered[status].filter((ticket) => {
          if (assigneeFilter === "Unassigned") {
            return !ticket.assignee;
          }
          return ticket.assignee?._id === assigneeFilter;
        });
      });
    }

    setFilteredKanban(filtered);
  };

  const getUniqueAssignees = () => {
    const assignees = new Set();
    Object.values(kanban).forEach((tickets) => {
      tickets.forEach((ticket) => {
        if (ticket.assignee) {
          assignees.add(
            JSON.stringify({
              id: ticket.assignee._id,
              name: ticket.assignee.name,
            })
          );
        }
      });
    });
    return Array.from(assignees).map((a) => JSON.parse(a));
  };

  /* ================= API ================= */

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await API.get("/projects");
      setProjects(res.data.projects);

      if (res.data.projects.length > 0) {
        setCurrentProjectId(res.data.projects[0]._id);

        const updatedUser = {
          ...user,
          projectId: res.data.projects[0]._id,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setLoadingProjects(false);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setLoadingProjects(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get(`/dashboard/stats?projectId=${currentProjectId}`);
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchKanban = async () => {
    try {
      setLoadingKanban(true);
      const res = await API.get(`/tickets/kanban?projectId=${currentProjectId}`);
      setKanban(res.data);
      setLoadingKanban(false);
    } catch (err) {
      console.error("Error fetching kanban:", err);
      setLoadingKanban(false);
    }
  };

  const fetchChartData = async () => {
    try {
      setLoadingCharts(true);
      const res = await API.get(`/dashboard/chart?projectId=${currentProjectId}`);
      setChartData(res.data);
      setLoadingCharts(false);
    } catch (err) {
      console.error("Error fetching chart data:", err);
      setLoadingCharts(false);
    }
  };

  /* ================= PROJECT CHANGE ================= */

  const handleProjectChange = (projectId) => {
    setCurrentProjectId(projectId);
    setSearchTerm("");
    setPriorityFilter("All");
    setAssigneeFilter("All");

    const updatedUser = { ...user, projectId };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  /* ================= DRAG ================= */

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;

    const STATUS_MAP = {
      Todo: "Todo",
      InProgress: "InProgress",
      Done: "Done",
    };

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const newStatus = STATUS_MAP[destCol];

    const sourceItems = [...kanban[sourceCol]];
    const destItems = sourceCol === destCol ? sourceItems : [...kanban[destCol]];

    const [moved] = sourceItems.splice(source.index, 1);
    moved.status = newStatus;

    destItems.splice(destination.index, 0, moved);

    setKanban({
      ...kanban,
      [sourceCol]: sourceItems,
      [destCol]: destItems,
    });

    try {
      await API.put(`/tickets/${draggableId}/status`, {
        status: newStatus,
      });

      fetchStats();
      fetchChartData();
    } catch (err) {
      console.error(err);
      fetchKanban();
    }
  };

  /* ===================================================== */

  if (loadingProjects) {
    return (
      <div>
        <Topbar
          user={user}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          assigneeFilter={assigneeFilter}
          setAssigneeFilter={setAssigneeFilter}
          assignees={getUniqueAssignees()}
        />
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin text-gray-400" size={40} />
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div>
        <Topbar
          user={user}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          assigneeFilter={assigneeFilter}
          setAssigneeFilter={setAssigneeFilter}
          assignees={[]}
        />
        <div className="flex flex-col items-center justify-center h-screen px-4">
          <p className="text-lg md:text-xl text-gray-600 mb-4 text-center">
            No projects found. Create your first project!
          </p>
          <button
            onClick={() => (window.location.href = "/projects")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Go to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6 md:pb-8">
      <Topbar
        user={user}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
        assignees={getUniqueAssignees()}
      />

      {/* ================= PROJECT SELECTOR ================= */}
      <div className="mt-4 md:mt-6 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-0 mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Dashboard</h2>

          <ProjectSelector
            projects={projects}
            currentProjectId={currentProjectId}
            onChange={handleProjectChange}
          />
        </div>
      </div>

      {/* ================= 1. KPI CARDS (TOP) - RESPONSIVE GRID ================= */}
      <div className="px-4 md:px-6 mb-6 md:mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <ColoredStat
            title="Total Tickets"
            value={stats.totalTickets}
            icon={<Ticket />}
            color="bg-indigo-500"
          />

          <ColoredStat
            title="To Do"
            value={stats.todoTickets}
            icon={<Ticket />}
            color="bg-yellow-500"
          />

          <ColoredStat
            title="In Progress"
            value={stats.inProgress}
            icon={<Loader2 />}
            color="bg-blue-500"
          />

          <ColoredStat
            title="Completed"
            value={stats.completed}
            icon={<CheckCircle />}
            color="bg-green-500"
          />
        </div>
      </div>

      {/* ================= 2. KANBAN BOARD (MIDDLE) - HORIZONTAL SCROLL ON MOBILE ================= */}
      <div className="px-4 md:px-6 mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Kanban Board</h2>

        {loadingKanban ? (
          <Loader />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            {/* MOBILE: Horizontal scroll container */}
            <div className="md:grid md:grid-cols-3 md:gap-6 flex gap-4 overflow-x-auto pb-4 md:pb-0">
              {Object.entries(filteredKanban).map(([status, items]) => (
                <Droppable droppableId={status} key={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-gray-50 p-3 md:p-4 rounded-xl md:rounded-2xl shadow min-h-[400px] flex flex-col min-w-[280px] md:min-w-0"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-base md:text-lg">{STATUS_LABEL[status]}</h3>
                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                          {items.length}
                        </span>
                      </div>

                      <div className="space-y-3 flex-1">
                        {items.map((t, index) => (
                          <Draggable key={t._id} draggableId={t._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setSelectedTicket(t)}
                                className={`bg-white p-3 rounded-xl border shadow-sm hover:shadow-md cursor-pointer transition-all ${
                                  snapshot.isDragging ? "shadow-lg rotate-2" : ""
                                }`}
                              >
                                <KanbanCard ticket={t} />
                              </div>
                            )}
                          </Draggable>
                        ))}

                        {items.length === 0 && (
                          <p className="text-sm text-gray-400 text-center py-8">
                            No tickets here
                          </p>
                        )}

                        {provided.placeholder}
                      </div>

                      <button
                        onClick={() => setCreateStatus(status)}
                        className="mt-4 flex items-center justify-center gap-2 text-xs md:text-sm text-blue-600 hover:text-blue-800 font-medium py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition"
                      >
                        <Plus size={16} />
                        Add Ticket
                      </button>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>

      {/* ================= 3. CHARTS (BOTTOM) - RESPONSIVE ================= */}
      <div className="px-4 md:px-6">
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Analytics</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {loadingCharts ? (
            <>
              <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow h-[300px] md:h-[350px] flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={32} />
              </div>
              <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow h-[300px] md:h-[350px] flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={32} />
              </div>
            </>
          ) : (
            <>
              <TicketLineChart data={chartData.lineChart} />
              <TicketBarChart data={chartData.barChart} />
            </>
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          refresh={() => {
            fetchKanban();
            fetchStats();
            fetchChartData();
          }}
        />
      )}

      {createStatus && currentProjectId && (
        <CreateTicketModal
          status={createStatus}
          projectId={currentProjectId}
          onClose={() => setCreateStatus(null)}
          refresh={() => {
            fetchKanban();
            fetchStats();
            fetchChartData();
          }}
        />
      )}
    </div>
  );
}

/* ===================================================== */

function KanbanCard({ ticket }) {
  const priorityColors = {
    Low: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-2">
        <p className="font-medium text-sm md:text-base text-gray-800 line-clamp-2">{ticket.title}</p>
        <Pencil size={14} className="text-gray-400 flex-shrink-0 ml-2" />
      </div>

      {ticket.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{ticket.description}</p>
      )}

      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${priorityColors[ticket.priority]}`}>
          {ticket.priority}
        </span>

        {ticket.assignee && (
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {ticket.assignee.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ColoredStat({ title, value, icon, color }) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition flex items-center gap-3 md:gap-4 h-[90px] md:h-[110px] border border-gray-100">
      <div className={`p-3 md:p-4 rounded-xl text-white ${color}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs md:text-sm text-gray-500 font-medium truncate">{title}</p>
        <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex justify-center py-10">
      <Loader2 className="animate-spin text-gray-400" size={32} />
    </div>
  );
}