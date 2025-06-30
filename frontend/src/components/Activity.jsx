import React, { useState, useEffect } from "react";
import {
  FaTicketAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaClock,
  FaUser,
} from "react-icons/fa";
import { getRecentActivity } from "../api/tickets";
import { toast } from "react-toastify";

// Function to format relative time
const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now - activityTime) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }
};

// Function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case "confirmed":
      return "text-green-400";
    case "pending":
      return "text-yellow-400";
    case "failed":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
};

export default function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRecentActivity();

      if (response.success) {
        setActivities(response.activity);
      } else {
        setError(response.error || "Failed to fetch activity");
      }
    } catch (err) {
      setError(err.error || "Failed to fetch activity");
      toast.error("Failed to load recent activity");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-32">
        <FaSpinner className="text-cyan-400 text-2xl animate-spin mb-2" />
        <p className="text-gray-400 text-sm">Loading activity...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-32">
        <FaExclamationTriangle className="text-red-400 text-2xl mb-2" />
        <p className="text-red-400 text-sm text-center">{error}</p>
        <button
          onClick={fetchActivity}
          className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32">
        <FaTicketAlt className="text-gray-500 text-2xl mb-2" />
        <p className="text-gray-400 text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-3 rounded-xl bg-black/20 backdrop-blur-sm border border-purple-500/10 hover:border-purple-500/20 transition-all"
        >
          {/* User Icon */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 flex items-center justify-center border border-purple-500/30">
              <FaUser className="text-cyan-400 text-sm" />
            </div>
          </div>

          {/* Activity Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-white leading-relaxed">
                  <span className="font-medium text-cyan-400">
                    {activity.user_name}
                  </span>{" "}
                  just purchased a ticket to{" "}
                  <span className="font-medium text-purple-400">
                    {activity.event_name}
                  </span>
                </p>

                {/* Price and Status */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">
                    {activity.ticket_price} XRP
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span
                    className={`text-xs font-medium ${getStatusColor(
                      activity.status
                    )}`}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex-shrink-0 ml-2">
                {activity.status === "confirmed" && activity.nft_id && (
                  <div
                    className="w-2 h-2 rounded-full bg-green-400"
                    title="NFT Minted"
                  ></div>
                )}
                {activity.status === "pending" && (
                  <div
                    className="w-2 h-2 rounded-full bg-yellow-400"
                    title="Processing"
                  ></div>
                )}
                {activity.status === "failed" && (
                  <div
                    className="w-2 h-2 rounded-full bg-red-400"
                    title="Failed"
                  ></div>
                )}
              </div>
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-1 mt-2">
              <FaClock className="text-gray-500 text-xs" />
              <span className="text-xs text-gray-500">
                {formatRelativeTime(activity.created_at)}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Refresh Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={fetchActivity}
          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors opacity-70 hover:opacity-100"
        >
          Refresh Activity
        </button>
      </div>
    </div>
  );
}
