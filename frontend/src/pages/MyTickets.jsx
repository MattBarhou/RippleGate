import React, { useState, useEffect } from "react";
import {
  FaTicketAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TicketDisplay from "../components/TicketDisplay";
import { getUserTickets } from "../api/tickets";
import { fetchCurrentUser } from "../api/auth";
import { toast } from "react-toastify";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  console.log(user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserLoading(true);
        setAuthError(null);
        const response = await fetchCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.error("Authentication error:", error);
        setAuthError(error.message || "Authentication failed");
        toast.error("Please login to view your tickets");
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user.user_id) {
      fetchUserTickets();
    } else if (!userLoading && !authError) {
      setLoading(false);
    }
  }, [user, userLoading, authError]);

  const fetchUserTickets = async () => {
    if (!user || !user.user_id) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userTickets = await getUserTickets(user.user_id);
      setTickets(userTickets);
    } catch (err) {
      setError(err.error || "Failed to fetch tickets");
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (user && user.user_id) {
      fetchUserTickets();
    }
  };

  const handleBackToDashboard = () => {
    navigate("/main-dashboard");
  };

  // Show authentication error
  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={handleBackToDashboard}
            className="flex items-center cursor-pointer gap-2 mb-6 px-3 py-2 rounded-lg bg-black/20 text-gray-300 hover:text-white hover:bg-black/30 transition-all border border-gray-600/30 hover:border-gray-500/50"
          >
            <FaArrowLeft className="text-sm" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex flex-col items-center justify-center py-12">
            <FaExclamationTriangle className="text-red-400 text-4xl mb-4" />
            <h3 className="text-xl font-medium text-red-400 mb-2">
              Authentication Required
            </h3>
            <p className="text-gray-400 text-center max-w-md mb-4">
              Please login to view your tickets.
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:border-purple-400/50 transition-all"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while fetching user
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={handleBackToDashboard}
            className="flex items-center cursor-pointer gap-2 mb-6 px-3 py-2 rounded-lg bg-black/20 text-gray-300 hover:text-white hover:bg-black/30 transition-all border border-gray-600/30 hover:border-gray-500/50"
          >
            <FaArrowLeft className="text-sm" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex flex-col items-center justify-center py-12">
            <FaSpinner className="text-cyan-400 text-4xl animate-spin mb-4" />
            <p className="text-gray-400">Authenticating...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleBackToDashboard}
          className="flex items-center cursor-pointer gap-2 mb-6 px-3 py-2 rounded-lg bg-black/20 text-gray-300 hover:text-white hover:bg-black/30 transition-all border border-gray-600/30 hover:border-gray-500/50"
        >
          <FaArrowLeft className="text-sm" />
          <span>Back to Dashboard</span>
        </button>

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
            disabled={loading || !user}
            className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30 hover:border-cyan-400/50 transition-all font-medium disabled:opacity-50"
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
