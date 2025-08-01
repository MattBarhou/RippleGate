import React, { useState, useEffect } from "react";
import {
  FaTicketAlt,
  FaWallet,
  FaTrophy,
  FaCalendarCheck,
  FaChartLine,
} from "react-icons/fa";
import { fetchCurrentUser } from "../api/auth";
import { getUserTickets } from "../api/tickets";

export default function QuickStats() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalTickets: 0,
    totalSpent: 0,
    confirmedTickets: 0,
    upcomingEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userResponse = await fetchCurrentUser();
      const userData = userResponse.data;
      setUser(userData);

      if (userData?.user_id) {
        const userTickets = await getUserTickets(userData.user_id);

        // Calculate stats
        const totalSpent = userTickets.reduce(
          (sum, ticket) => sum + parseFloat(ticket.price),
          0
        );
        const confirmedTickets = userTickets.filter(
          (t) => t.status === "confirmed"
        ).length;
        const upcomingEvents = userTickets.filter((t) => {
          if (!t.event?.date) return false;
          const eventDate = new Date(t.event.date);
          return eventDate > new Date();
        }).length;

        setStats({
          totalTickets: userTickets.length,
          totalSpent: totalSpent,
          confirmedTickets: confirmedTickets,
          upcomingEvents: upcomingEvents,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-3xl p-6 border border-purple-500/20 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <FaChartLine className="text-xl text-cyan-400" />
        <h2 className="text-xl font-display text-white">Quick Stats</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        </div>
      ) : user ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <FaTicketAlt className="text-cyan-400" />
              <span className="text-sm text-gray-400">Total Tickets</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.totalTickets}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <FaWallet className="text-green-400" />
              <span className="text-sm text-gray-400">Total Spent</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.totalSpent.toFixed(2)}
            </div>
            <div className="text-xs text-green-400">XRP</div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
            <div className="flex items-center gap-2 mb-2">
              <FaTrophy className="text-yellow-400" />
              <span className="text-sm text-gray-400">Confirmed</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.confirmedTickets}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <FaCalendarCheck className="text-blue-400" />
              <span className="text-sm text-gray-400">Upcoming</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.upcomingEvents}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">Please log in to view your stats</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30 rounded-xl hover:border-cyan-400/50 transition-all"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}
