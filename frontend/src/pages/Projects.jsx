import { useEffect, useState } from "react";
import { getUserProjects, createProject, deleteProject } from "../api/axios.js";
import { Link } from "react-router-dom";
import AddMembersModal from '../components/AddMembersModal';
import { UserPlus, Users, Trash2, Eye, FolderPlus, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    summary: "",
    description: "",
    status: "To Do",
    startDate: "",
    dueDate: "",
    file: null,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getUserProjects();
      setProjects(res.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createProject({
        title: form.title,
        description: form.description,
      });

      toast.success('Project created successfully!');
      setShowModal(false);
      setForm({
        title: "",
        summary: "",
        description: "",
        status: "To Do",
        startDate: "",
        dueDate: "",
        file: null,
      });

      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDelete = async (projectId, projectTitle) => {
    if (window.confirm(`Are you sure you want to delete "${projectTitle}"?`)) {
      try {
        await deleteProject(projectId);
        toast.success('Project deleted successfully!');
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleAddMembers = (project) => {
    setSelectedProject(project);
    setShowAddMembersModal(true);
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6">
      {/* Header - RESPONSIVE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Projects</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Manage your projects and teams</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-blue-700 transition font-medium text-sm md:text-base whitespace-nowrap"
        >
          <FolderPlus size={20} />
          <span className="hidden sm:inline">Create Project</span>
          <span className="sm:hidden">New Project</span>
        </button>
      </div>

      {/* Search Bar - RESPONSIVE */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-10 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm md:text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid - RESPONSIVE */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
          <FolderPlus className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-base md:text-lg">
            {search ? 'No projects found matching your search' : 'No projects yet. Create your first project!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all"
            >
              {/* Project Header */}
              <div className="p-4 md:p-6 border-b">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                  {project.title}
                </h2>
                <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                  {project.description || 'No description'}
                </p>
              </div>

              {/* Members Section */}
              <div className="px-4 md:px-6 py-3 md:py-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                    <Users size={16} />
                    <span className="font-medium">
                      {project.members?.length || 0} members
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleAddMembers(project)}
                    className="text-blue-600 hover:text-blue-800 transition text-xs md:text-sm font-medium flex items-center gap-1"
                  >
                    <UserPlus size={14} />
                    Add
                  </button>
                </div>

                {/* Member Avatars */}
                <div className="flex -space-x-2">
                  {project.members?.slice(0, 5).map((member, idx) => (
                    <div
                      key={member._id || idx}
                      className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border-2 border-white text-white text-xs font-bold"
                      title={member.name}
                    >
                      {member.name?.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  
                  {project.members?.length > 5 && (
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-300 rounded-full flex items-center justify-center border-2 border-white text-gray-700 text-xs font-bold">
                      +{project.members.length - 5}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions - RESPONSIVE */}
              <div className="p-3 md:p-4 flex gap-2 md:gap-3 border-t">
                <Link
                  to={`/projects/${project._id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-xs md:text-sm"
                >
                  <Eye size={16} />
                  <span className="hidden sm:inline">View Tickets</span>
                  <span className="sm:hidden">View</span>
                </Link>

                <button
                  onClick={() => handleDelete(project._id, project.title)}
                  className="px-3 md:px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                  title="Delete Project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= CREATE PROJECT MODAL - RESPONSIVE ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-4 md:p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    Create New Project
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    Fill in the details to create a new project
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={submitHandler} className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  name="title"
                  placeholder="Enter project name"
                  className="border rounded-lg px-3 md:px-4 py-2 md:py-2.5 w-full focus:ring-2 focus:ring-blue-400 outline-none text-sm md:text-base"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your project"
                  className="border rounded-lg px-3 md:px-4 py-2 md:py-2.5 w-full focus:ring-2 focus:ring-blue-400 outline-none h-24 md:h-32 resize-none text-sm md:text-base"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    className="border rounded-lg px-3 md:px-4 py-2 md:py-2.5 w-full focus:ring-2 focus:ring-blue-400 outline-none text-sm md:text-base"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>In Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    className="border rounded-lg px-3 md:px-4 py-2 md:py-2.5 w-full focus:ring-2 focus:ring-blue-400 outline-none text-sm md:text-base"
                    value={form.startDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  className="border rounded-lg px-3 md:px-4 py-2 md:py-2.5 w-full focus:ring-2 focus:ring-blue-400 outline-none text-sm md:text-base"
                  value={form.dueDate}
                  onChange={handleChange}
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-sm md:text-base"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm md:text-base"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD MEMBERS MODAL ================= */}
      {showAddMembersModal && selectedProject && (
        <AddMembersModal
          project={selectedProject}
          onClose={() => {
            setShowAddMembersModal(false);
            setSelectedProject(null);
          }}
          onMemberAdded={() => {
            fetchProjects();
            toast.success('Member added successfully!');
          }}
        />
      )}
    </div>
  );
};

export default Projects;