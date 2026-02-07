import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProjectTickets,
  createTicket,
} from "../api/axios";

import TicketCard from "../components/TicketCard";
import TicketModal from "../components/TicketModal.jsx";

export default function Tickets() {
  const { id } = useParams();

  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchTickets = async () => {
    const res = await getProjectTickets(id);
    setTickets(res.data.tickets);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div>

      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold">Tickets</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Ticket
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket._id}
            ticket={ticket}
            refresh={fetchTickets}
          />
        ))}
      </div>

      {showModal && (
        <TicketModal
          projectId={id}
          close={() => setShowModal(false)}
          refresh={fetchTickets}
        />
      )}
    </div>
  );
}
