import Navbar from "./Navbar";
import EventList from "./EventList";
import Activity from "./Activity";
import QuickStats from "./QuickStats";
import { FaHistory, FaChartLine, FaCalendarAlt } from "react-icons/fa";
import { RiShieldKeyholeLine } from "react-icons/ri";

export default function MainDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8">
        {/* Hero Section */}
        <div className="text-center mb-12 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
              <RiShieldKeyholeLine className="text-3xl text-cyan-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text">
              Dashboard
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Welcome to your RippleGate dashboard. Manage events, track tickets,
            and explore the future of blockchain ticketing.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Events Section - Takes up more space */}
          <div className="lg:col-span-8">
            <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 overflow-hidden h-fit">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 p-6 border-b border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                    <FaCalendarAlt className="text-xl text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white">
                      Upcoming Events
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Discover amazing events powered by blockchain
                    </p>
                  </div>
                </div>
              </div>

              {/* Events Content */}
              <div className="p-6">
                <EventList />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Stats */}
            <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 border-b border-green-500/20">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                    <FaChartLine className="text-lg text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">
                      Quick Stats
                    </h3>
                    <p className="text-gray-400 text-xs">
                      Your activity overview
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <QuickStats />
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-4 border-b border-orange-500/20">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
                    <FaHistory className="text-lg text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">
                      Live Activity
                    </h3>
                    <p className="text-gray-400 text-xs">
                      Recent platform activity
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <Activity />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
