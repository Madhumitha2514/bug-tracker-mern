import { useState } from "react";
import { createTicket } from "../api/axios";

export default function TicketModal({
  projectId,
  close,
  refresh,
}) {

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    await createTicket({
      ...form,
      projectId,
    });

    refresh();
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <form
        onSubmit={submit}
        className="bg-white p-6 w-full max-w-md rounded-xl shadow-lg"
      >

        <h2 className="text-xl font-bold mb-4">
          Create Ticket
        </h2>

        <input
          name="title"
          placeholder="Title"
          className="border rounded-lg px-3 py-2 w-full mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          className="border rounded-lg px-3 py-2 w-full mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          onChange={handleChange}
        />

        <select
          name="priority"
          className="border rounded-lg px-3 py-2 w-full mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          onChange={handleChange}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <div className="flex justify-end gap-2">

          <button
            type="button"
            onClick={close}
            className="border px-3 py-1"
          >
            Cancel
          </button>

          <button className="bg-blue-600 text-white px-3 py-1">
            Create
          </button>

        </div>
      </form>
    </div>
  );
}
