import { useState, useEffect } from "react";
import API from "../api/axios";
import { X, Loader2 } from "lucide-react";
import toast from 'react-hot-toast';
import TicketComments from './TicketComments';

export default function TicketDetailsModal({ ticket, onClose, refresh }) {
  const [form, setForm] = useState({
    title: ticket.title,
    description: ticket.description || "",
    status: ticket.status,
    priority: ticket.priority,
    assignee: ticket.assignee?._id || "",
  });

  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

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

  const save = async () => {
    try {
      setLoading(true);
      await API.put(`/tickets/${ticket._id}`, {
        ...form,
        assignee: form.assignee || null,
      });
      toast.success('Ticket updated successfully!');
      refresh();
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      toast.error('Failed to update ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-2xl relative shadow-xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-black">
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Ticket</h2>

        <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />

        <Textarea
          label="Description"
          value={form.description}
          onChange={(v) => setForm({ ...form, description: v })}
        />

        <Select
          label="Status"
          value={form.status}
          onChange={(v) => setForm({ ...form, status: v })}
          options={["Todo", "InProgress", "Done"]}
        />

        <Select
          label="Priority"
          value={form.priority}
          onChange={(v) => setForm({ ...form, priority: v })}
          options={["Low", "Medium", "High"]}
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
                  No users available.
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
          onClick={save}
          disabled={loading}
          className={`mt-5 w-full py-2 rounded-xl text-white font-medium flex justify-center gap-2 ${
            loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading && <Loader2 className="animate-spin" />}
          Save Changes
        </button>
        {/* ✅ ADD COMMENTS SECTION */}
<TicketComments ticketId={ticket._id} />
      </div>
    </div>
  );
}

/* ===== INPUTS ===== */
function Input({ label, value, onChange }) {
  return (
    <div className="mb-3">
      <p className="text-sm mb-1 font-medium">{label}</p>
      <input
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
          <option key={o} value={o}>
            {o === "Todo" ? "To Do" : o === "InProgress" ? "In Progress" : o}
          </option>
        ))}
      </select>
    </div>
  );
}