import React, { useState, useEffect } from "react";
import { FaTicketAlt, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import TicketDisplay from "../components/TicketDisplay";
import { getUserTickets } from "../api/tickets";
import { toast } from "react-toastify";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For demo purposes, using user ID 1. In a real app, this would come from auth context
  const userId = 1;

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const userTickets = await getUserTickets(userId);
      setTickets(userTickets);
    } catch (err) {
      setError(err.error || "Failed to fetch tickets");
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchUserTickets();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaTicketAlt className="text-cyan-400 text-3xl" />
            <h1 className="text-3xl font-display font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
              My Tickets
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Manage your event tickets and verify ownership on the XRPL
            blockchain
          </p>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30 hover:border-cyan-400/50 transition-all font-medium disabled:opacity-50"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaTicketAlt />}
            <span>{loading ? "Loading..." : "Refresh Tickets"}</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FaSpinner className="text-cyan-400 text-4xl animate-spin mb-4" />
            <p className="text-gray-400">Loading your tickets...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FaExclamationTriangle className="text-red-400 text-4xl mb-4" />
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-400/50 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FaTicketAlt className="text-gray-500 text-6xl mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">
              No Tickets Yet
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              You haven't purchased any tickets yet. Browse events and buy
              tickets to see them here.
            </p>
          </div>
        ) : (
          <>
            {/* Tickets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map((ticket) => (
                <TicketDisplay key={ticket.id} ticket={ticket} />
              ))}
            </div>

            {/* Stats */}
            <div className="mt-8 bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-medium text-white mb-4">
                Ticket Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">
                    {tickets.length}
                  </div>
                  <div className="text-sm text-gray-400">Total Tickets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {tickets.filter((t) => t.status === "confirmed").length}
                  </div>
                  <div className="text-sm text-gray-400">Confirmed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {tickets
                      .reduce(
                        (sum, ticket) => sum + parseFloat(ticket.price),
                        0
                      )
                      .toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Total Spent (XRP)</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
