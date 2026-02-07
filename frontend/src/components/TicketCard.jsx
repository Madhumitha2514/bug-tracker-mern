import { Trash2, Flag } from "lucide-react";
import { deleteTicket } from "../api/axios";

export default function TicketCard({ ticket, refresh }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">

      <div className="flex justify-between items-start">

        <h3 className="font-semibold text-lg">
          {ticket.title}
        </h3>

        <span
          className={`text-xs px-2 py-1 rounded-full ${
            ticket.priority === "High"
              ? "bg-red-100 text-red-600"
              : ticket.priority === "Medium"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {ticket.priority}
        </span>

      </div>

      <p className="text-sm text-gray-600 mt-2">
        {ticket.description}
      </p>

      <div className="flex justify-between mt-4 text-sm">

        <span className="capitalize">
          Status: <b>{ticket.status}</b>
        </span>

        <button
          onClick={() => deleteTicket(ticket._id).then(refresh)}
          className="text-red-500 hover:text-red-700 flex items-center gap-1"
        >
          <Trash2 size={16} />
          Delete
        </button>

      </div>
    </div>
  );
}
