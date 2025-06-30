import Navbar from "./Navbar";
import EventList from "./EventList";
import Activity from "./Activity";
import { FaTicketAlt, FaHistory } from "react-icons/fa";

export default function MainDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-display font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text mt-6 mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-black/30 backdrop-blur-lg rounded-3xl p-6 border border-purple-500/20 shadow-xl lg:col-span-1 md:row-span-2 h-[600px]">
            <EventList />
          </div>

          <div className="bg-black/30 backdrop-blur-lg rounded-3xl p-6 border border-purple-500/20 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <FaTicketAlt className="text-xl text-cyan-400" />
              <h2 className="text-xl font-display text-white">My Tickets</h2>
            </div>
            <p className="text-gray-300">No tickets purchased yet</p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg rounded-3xl p-6 border border-purple-500/20 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <FaHistory className="text-xl text-cyan-400" />
              <h2 className="text-xl font-display text-white">Activity</h2>
            </div>
            <Activity />
          </div>
        </div>
      </div>
    </div>
  );
}
