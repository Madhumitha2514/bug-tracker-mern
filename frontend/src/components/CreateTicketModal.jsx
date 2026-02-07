import { useState, useEffect } from "react";
import API from "../api/axios";
import { X, Loader2 } from "lucide-react";
import toast from 'react-hot-toast';

export default function CreateTicketModal({ status, projectId, onClose, refresh }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    assignee: "",
  });
  
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  /* ================= FETCH ALL USERS ================= */
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await API.get('/users');
      console.log("👥 All users fetched:", response.data.users);
      setAllUsers(response.data.users || []);
      setLoadingUsers(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users");
      setLoadingUsers(false);
    }
  };

  /* ================= CREATE ================= */
  const create = async () => {
    if (!form.title.trim()) {
      return setError("Title is required");
    }

    const finalProjectId = projectId || user?.projectId;

    if (!finalProjectId) {
      return setError("Project ID is missing");
    }

    try {
      setLoading(true);
      setError("");

      await API.post("/tickets", {
        ...form,
        status,
        projectId: finalProjectId,
        assignee: form.assignee || null,
      });

      toast.success('Ticket created successfully!');
      refresh();
      onClose();
    } catch (err) {
      console.error("❌ Create error:", err.response || err);
      setError(err?.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-lg relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">
          Create Ticket — {status === "Todo" ? "To Do" : status === "InProgress" ? "In Progress" : "Done"}
        </h2>

        {error && (
          <p className="bg-red-100 text-red-600 text-sm p-2 rounded mb-3">
            {error}
          </p>
        )}

        <Input
          label="Title *"
          value={form.title}
          onChange={(v) => setForm({ ...form, title: v })}
        />

        <Textarea
          label="Description"
          value={form.description}
          onChange={(v) => setForm({ ...form, description: v })}
        />

        <Select
          label="Priority"
          value={form.priority}
          onChange={(v) => setForm({ ...form, priority: v })}
          options={["Low", "Medium", "High"]}
        />

        <Input
          type="date"
          label="Due Date"
          value={form.dueDate}
          onChange={(v) => setForm({ ...form, dueDate: v })}
        />

        {/* ✅ ASSIGN TO - ALL USERS */}
        <div className="mb-3">
          <p className="text-sm mb-1 font-medium">Assign To</p>
          {loadingUsers ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
              <Loader2 className="animate-spin" size={16} />
              Loading users...
            </div>
          ) : (
            <>
              <select
                value={form.assignee}
                onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Unassigned</option>
                {allUsers.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              
              {allUsers.length === 0 && (
                <p className="text-xs text-red-600 mt-1">
                  No users available. Please register users first.
                </p>
              )}
              
              {allUsers.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {allUsers.length} user(s) available
                </p>
              )}
            </>
          )}
        </div>

        <button
          disabled={loading}
          onClick={create}
          className={`mt-5 w-full py-2 rounded-xl text-white font-medium flex justify-center gap-2 ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading && <Loader2 className="animate-spin" />}
          Create Ticket
        </button>
      </div>
    </div>
  );
}

/* ================= FIELDS ================= */
function Input({ label, value, onChange, type = "text" }) {
  return (
    <div className="mb-3">
      <p className="text-sm mb-1 font-medium">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div className="mb-3">
      <p className="text-sm mb-1 font-medium">{label}</p>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="mb-3">
      <p className="text-sm mb-1 font-medium">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}