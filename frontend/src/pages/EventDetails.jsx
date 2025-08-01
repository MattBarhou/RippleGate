import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaTicketAlt,
  FaMoneyBillWave,
  FaSpinner,
  FaArrowLeft,
  FaCheckCircle,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { getEvents } from "../api/events";
import { buyTicket } from "../api/tickets";
import { toast } from "react-toastify";
import { fetchCurrentUser } from "../api/auth";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetchCurrentUser();
      setUser(response.data);
    };
    fetchUser();
  }, []);

  // memoize the fetchEventDetails function
  const fetchEventDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const events = await getEvents();
      const selectedEvent = events.find((e) => e.id === parseInt(id));

      if (selectedEvent) {
        setEvent(selectedEvent);
      } else {
        setError("Event not found");
      }
    } catch (err) {
      setError("Failed to load event details");
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  const handleBuyTicket = async () => {
    if (!event) return;

    setPurchasing(true);
    try {
      const result = await buyTicket(event.id, user.user_id);
      toast.success("Ticket purchased successfully! NFT minted on XRPL.");

      // Refresh event data to update ticket count
      await fetchEventDetails();

      // Navigate to My Tickets page after a short delay
      setTimeout(() => {
        navigate("/tickets");
      }, 2000);
    } catch (err) {
      toast.error(err.error || "Failed to purchase ticket");
    } finally {
      setPurchasing(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center">
            <FaSpinner className="text-cyan-400 text-4xl animate-spin mb-4" />
            <p className="text-gray-400">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">
              {error || "Event not found"}
            </h1>
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-purple-500/30 hover:border-cyan-400/50 transition-all"
            >
              <FaArrowLeft />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format price to display in XRP with 2 decimal places
  const formattedPrice = parseFloat(event.price).toFixed(2);

  // Format date to be more readable
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Format time with safety checks
  let formattedTime = "TBA";
  if (event.time) {
    try {
      const timeComponents = event.time.split(":");
      if (timeComponents.length >= 2) {
        const hours = parseInt(timeComponents[0]);
        const minutes = timeComponents[1];
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        formattedTime = `${formattedHours}:${minutes} ${ampm}`;
      }
    } catch (error) {
      console.error("Error formatting time:", error);
    }
  }

  const isAvailable = event.tickets > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="inline-flex cursor-pointer items-center gap-2 mb-6 px-4 py-2 rounded-xl bg-black/20 text-gray-300 border border-gray-500/30 hover:border-cyan-400/50 hover:text-white transition-all"
        >
          <FaArrowLeft />
          Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Image */}
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Price Badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-purple-500/20 flex items-center">
                <FaMoneyBillWave className="text-cyan-400 mr-2" />
                <span className="text-white font-bold text-lg">
                  {formattedPrice} XRP
                </span>
              </div>
            </div>

            {/* Availability Badge */}
            <div className="absolute bottom-4 left-4">
              <div
                className={`backdrop-blur-md p-2 rounded-xl border flex items-center ${
                  isAvailable
                    ? "bg-green-500/20 border-green-500/30"
                    : "bg-red-500/20 border-red-500/30"
                }`}
              >
                <FaTicketAlt
                  className={`mr-2 ${
                    isAvailable ? "text-green-400" : "text-red-400"
                  }`}
                />
                <span
                  className={`font-medium ${
                    isAvailable ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {event.tickets} {event.tickets === 1 ? "Ticket" : "Tickets"}{" "}
                  {isAvailable ? "Available" : "Sold Out"}
                </span>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
            <h1 className="text-3xl font-display font-bold text-white mb-4">
              {event.title}
            </h1>

            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              {event.description}
            </p>

            {/* Event Info */}
            <div className="space-y-4 mb-8">
              {/* Host Information */}
              {event.host_name && (
                <div className="flex items-center text-gray-300">
                  <FaUserTie className="text-cyan-400 mr-3 w-5" />
                  <span className="text-lg">
                    Hosted by{" "}
                    <span className="font-medium text-purple-400">
                      {event.host_name}
                    </span>
                  </span>
                </div>
              )}

              <div className="flex items-center text-gray-300">
                <FaMapMarkerAlt className="text-cyan-400 mr-3 w-5" />
                <span className="text-lg">{event.location}</span>
              </div>

              <div className="flex items-center text-gray-300">
                <FaCalendarAlt className="text-cyan-400 mr-3 w-5" />
                <span className="text-lg">{formattedDate}</span>
              </div>

              <div className="flex items-center text-gray-300">
                <FaClock className="text-cyan-400 mr-3 w-5" />
                <span className="text-lg">{formattedTime}</span>
              </div>

              <div className="flex items-center text-gray-300">
                <FaUsers className="text-cyan-400 mr-3 w-5" />
                <span className="text-lg">
                  {event.tickets} {event.tickets === 1 ? "ticket" : "tickets"}{" "}
                  remaining
                </span>
              </div>
            </div>

            {/* Purchase Button */}
            <div className="space-y-4">
              <button
                onClick={handleBuyTicket}
                disabled={purchasing || !isAvailable}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                  isAvailable
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white shadow-lg hover:shadow-cyan-500/25"
                    : "bg-gray-500/20 text-gray-500 cursor-not-allowed"
                } ${purchasing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {purchasing ? (
                  <div className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Minting NFT Ticket...
                  </div>
                ) : !isAvailable ? (
                  "Sold Out"
                ) : (
                  <div className="flex cursor-pointer items-center justify-center gap-2">
                    <FaTicketAlt />
                    Buy Ticket for {formattedPrice} XRP
                  </div>
                )}
              </button>

              {isAvailable && (
                <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-purple-400 mt-1 flex-shrink-0" />
                    <div className="text-sm text-gray-300">
                      <p className="font-medium text-purple-400 mb-1">
                        NFT Ticket Benefits:
                      </p>
                      <ul className="space-y-1 text-gray-400">
                        <li>• Blockchain-verified ownership</li>
                        <li>• Transferable and tradeable</li>
                        <li>• Permanent proof of attendance</li>
                        <li>• Secure and tamper-proof</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
