import { useState, useEffect } from "react";
import {
  FaTicketAlt,
  FaWallet,
  FaTrophy,
  FaCalendarCheck,
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
          (sum, ticket) => sum + Number.parseFloat(ticket.price),
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
          <p className="text-gray-400 mb-4">Please log in to view your stats</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30 rounded-xl hover:border-cyan-400/50 transition-all font-medium"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: FaTicketAlt,
      label: "Total Tickets",
      value: stats.totalTickets,
      color: "from-cyan-500/20 to-blue-500/20",
      borderColor: "border-cyan-500/30",
      iconColor: "text-cyan-400",
      textColor: "text-cyan-100",
    },
    {
      icon: FaWallet,
      label: "Total Spent",
      value: `${stats.totalSpent.toFixed(2)} XRP`,
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      iconColor: "text-green-400",
      textColor: "text-green-100",
    },
    {
      icon: FaTrophy,
      label: "Confirmed",
      value: stats.confirmedTickets,
      color: "from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500/30",
      iconColor: "text-yellow-400",
      textColor: "text-yellow-100",
    },
    {
      icon: FaCalendarCheck,
      label: "Upcoming",
      value: stats.upcomingEvents,
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
      textColor: "text-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 border ${stat.borderColor} backdrop-blur-sm hover:scale-105 transition-all duration-300 group`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-xl bg-black/20 ${stat.iconColor}`}>
              <stat.icon className="text-lg" />
            </div>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-white/20 to-white/40 group-hover:scale-150 transition-transform"></div>
          </div>

          <div className="space-y-1">
            <div className={`text-2xl font-bold ${stat.textColor}`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-300 font-medium">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
