import { useState, useEffect } from "react";
import { getEvents } from "../api/events";
import Event from "./Event";
import { FaCalendarAlt } from "react-icons/fa";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await getEvents();
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        setError("Failed to load events");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <FaCalendarAlt className="text-xl text-cyan-400" />
        <h2 className="text-xl font-display text-white">Upcoming Events</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-56">
          <div className="animate-pulse flex space-x-2">
            <div className="h-2 w-2 bg-cyan-400 rounded-full"></div>
            <div className="h-2 w-2 bg-cyan-400 rounded-full"></div>
            <div className="h-2 w-2 bg-cyan-400 rounded-full"></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-red-400 text-center py-8">{error}</div>
      ) : events.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          No upcoming events found
        </div>
      ) : (
        <div
          className="overflow-y-auto pr-2 custom-scrollbar scroll-smooth flex-grow"
          style={{ maxHeight: "500px" }}
        >
          <div className="grid grid-cols-1 gap-4">
            {events.map((event) => (
              <Event key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
