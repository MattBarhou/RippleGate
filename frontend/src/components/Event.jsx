import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaTicketAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Event({ event }) {
  // Format price to display in XRP with 2 decimal places
  const formattedPrice = parseFloat(event.price).toFixed(2);

  // Format date to be more readable
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Format time with safety checks - backend returns time as "HH:MM:SS"
  let formattedTime = "TBA";
  if (event.time) {
    try {
      // Handle backend format directly (HH:MM:SS)
      console.log("Raw time from backend:", event.time);
      const timeComponents = event.time.split(":");
      if (timeComponents.length >= 2) {
        const hours = parseInt(timeComponents[0]);
        const minutes = timeComponents[1];
        console.log("Parsed hours:", hours, "minutes:", minutes);

        // Ensure proper AM/PM conversion
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
        formattedTime = `${formattedHours}:${minutes} ${ampm}`;
        console.log("Formatted time:", formattedTime);
      }
    } catch (error) {
      console.error("Error formatting time:", error);
    }
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20 hover:border-cyan-400/30 transition-all shadow-lg hover:shadow-cyan-500/10 group">
      <div className="relative h-40 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-3 left-3 flex items-center">
          <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-lg border border-purple-500/20 flex items-center">
            <FaMoneyBillWave className="text-cyan-400 mr-1.5" />
            <span className="text-white font-medium">{formattedPrice} XRP</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-display font-semibold text-white mb-2 line-clamp-1">
          {event.title}
        </h3>

        <div className="mb-3 line-clamp-2 text-gray-300 text-sm">
          {event.description}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-400">
            <FaMapMarkerAlt className="mr-2 text-cyan-400" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          <div className="flex items-center text-gray-400">
            <FaCalendarAlt className="mr-2 text-cyan-400" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center text-gray-400">
            <FaClock className="mr-2 text-cyan-400" />
            <span>{formattedTime}</span>
          </div>

          <div className="flex items-center text-gray-400">
            <FaTicketAlt className="mr-2 text-cyan-400" />
            <span>{event.tickets} tickets available</span>
          </div>
        </div>

        <div className="mt-4">
          <Link
            to={`/event/${event.id}`}
            className="block w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-center text-white border border-purple-500/30 hover:border-cyan-400/50 transition-all font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
