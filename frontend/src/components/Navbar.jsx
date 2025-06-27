import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUser,
  FaTicketAlt,
  FaCalendarPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { RiShieldKeyholeLine } from "react-icons/ri";
import EventModal from "./EventModal";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleCreateEventClick = (e) => {
    e.preventDefault();
    setEventModalOpen(true);
    setMobileMenuOpen(false);
  };

  const navItems = [
    {
      name: "Profile",
      path: "/profile",
      icon: <FaUser />,
      onClick: null,
    },
    {
      name: "My Tickets",
      path: "/tickets",
      icon: <FaTicketAlt />,
      onClick: null,
    },
    {
      name: "Create Event",
      path: "#",
      icon: <FaCalendarPlus />,
      onClick: handleCreateEventClick,
    },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-purple-500/30 px-4 py-3 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <RiShieldKeyholeLine className="text-cyan-400 text-2xl" />
            <span className="font-display text-xl text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text hidden sm:block">
              RippleGate
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={item.onClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white"
                    : "text-gray-300 hover:bg-black/20 hover:text-white"
                }`}
              >
                <span
                  className={`text-lg ${
                    isActive(item.path) ? "text-cyan-400" : ""
                  }`}
                >
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/80 backdrop-blur-lg border-b border-purple-500/20">
            <div className="flex flex-col py-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={item.onClick || (() => setMobileMenuOpen(false))}
                  className={`flex items-center justify-center gap-3 px-4 py-3 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white"
                      : "text-gray-300 hover:bg-black/20 hover:text-white"
                  }`}
                >
                  <span
                    className={`text-xl ${
                      isActive(item.path) ? "text-cyan-400" : ""
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Mobile Navigation (Small Screens) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/70 backdrop-blur-lg border-t border-purple-500/20 z-50">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={item.onClick}
                className={`flex flex-col items-center py-3 px-4 ${
                  isActive(item.path) ? "text-cyan-400" : "text-gray-300"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Event Creation Modal */}
      <EventModal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
      />
    </>
  );
}
