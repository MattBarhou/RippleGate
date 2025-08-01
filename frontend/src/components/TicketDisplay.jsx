import React, { useState } from "react";
import {
  FaTicketAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaExternalLinkAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { verifyTicket } from "../api/tickets";
import { toast } from "react-toastify";

export default function TicketDisplay({ ticket }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  // Format price to display in XRP with 2 decimal places
  const formattedPrice = parseFloat(ticket.price).toFixed(2);

  // Format date to be more readable
  const eventDate = new Date(ticket.event?.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Format time with safety checks
  let formattedTime = "TBA";
  if (ticket.event?.time) {
    try {
      const timeComponents = ticket.event.time.split(":");
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

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case "confirmed":
        return {
          color: "text-green-400",
          bgColor: "bg-green-500/20",
          borderColor: "border-green-500/30",
          icon: <FaCheckCircle />,
          text: "Confirmed",
        };
      case "pending":
        return {
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
          borderColor: "border-yellow-500/30",
          icon: <FaSpinner className="animate-spin" />,
          text: "Pending",
        };
      case "failed":
        return {
          color: "text-red-400",
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500/30",
          icon: <FaTimesCircle />,
          text: "Failed",
        };
      default:
        return {
          color: "text-gray-400",
          bgColor: "bg-gray-500/20",
          borderColor: "border-gray-500/30",
          icon: <FaTicketAlt />,
          text: "Unknown",
        };
    }
  };

  const statusInfo = getStatusInfo(ticket.status);

  const handleVerifyTicket = async () => {
    if (!ticket.nft_id) {
      toast.error("No NFT ID available for verification");
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verifyTicket(ticket.id);
      setVerificationResult(result);

      if (result.verified) {
        toast.success("Ticket ownership verified on XRPL!");
      } else {
        toast.warning("Ticket verification failed");
      }
    } catch (error) {
      toast.error(
        "Error verifying ticket: " + (error.error || "Unknown error")
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleViewTransaction = () => {
    if (ticket.transaction_hash) {
      // Open XRPL testnet explorer
      window.open(
        `https://testnet.xrpl.org/transactions/${ticket.transaction_hash}`,
        "_blank"
      );
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20 hover:border-cyan-400/30 transition-all shadow-lg hover:shadow-cyan-500/10">
      {/* Header with status */}
      <div className="px-4 py-3 border-b border-purple-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaTicketAlt className="text-cyan-400 text-lg" />
          <span className="text-white font-medium">Ticket #{ticket.id}</span>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusInfo.bgColor} ${statusInfo.borderColor} border`}
        >
          <span className={statusInfo.color}>{statusInfo.icon}</span>
          <span className={`text-sm font-medium ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        </div>
      </div>

      <div className="p-4">
        {/* Event Image */}
        {ticket.event?.image && (
          <div className="relative h-32 mb-4 rounded-xl overflow-hidden">
            <img
              src={ticket.event.image}
              alt={ticket.event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-2 left-2">
              <div className="bg-black/60 backdrop-blur-md p-1.5 rounded-lg border border-purple-500/20 flex items-center">
                <FaMoneyBillWave className="text-cyan-400 mr-1.5" />
                <span className="text-white font-medium">
                  {formattedPrice} XRP
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Event Details */}
        <h3 className="text-lg font-display font-semibold text-white mb-3">
          {ticket.event?.title || "Event Title"}
        </h3>

        <div className="space-y-2 text-sm mb-4">
          {ticket.event?.location && (
            <div className="flex items-center text-gray-400">
              <FaMapMarkerAlt className="mr-2 text-cyan-400 w-4" />
              <span>{ticket.event.location}</span>
            </div>
          )}

          <div className="flex items-center text-gray-400">
            <FaCalendarAlt className="mr-2 text-cyan-400 w-4" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center text-gray-400">
            <FaClock className="mr-2 text-cyan-400 w-4" />
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* NFT Details */}
        {ticket.nft_id && (
          <div className="bg-purple-500/10 rounded-xl p-3 mb-4 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <FaShieldAlt className="text-purple-400" />
              <span className="text-purple-400 font-medium text-sm">
                NFT Details
              </span>
            </div>
            <div className="text-xs text-gray-400 break-all">
              <strong>NFT ID:</strong> {ticket.nft_id}
            </div>
          </div>
        )}

        {/* Verification Result */}
        {verificationResult && (
          <div
            className={`rounded-xl p-3 mb-4 border ${
              verificationResult.verified
                ? "bg-green-500/10 border-green-500/20"
                : "bg-red-500/10 border-red-500/20"
            }`}
          >
            <div className="flex items-center gap-2">
              {verificationResult.verified ? (
                <FaCheckCircle className="text-green-400" />
              ) : (
                <FaTimesCircle className="text-red-400" />
              )}
              <span
                className={`font-medium text-sm ${
                  verificationResult.verified
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {verificationResult.verified
                  ? "Ownership Verified"
                  : "Verification Failed"}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {ticket.status === "confirmed" && ticket.nft_id && (
            <button
              onClick={handleVerifyTicket}
              disabled={isVerifying}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30 hover:border-cyan-400/50 transition-all font-medium disabled:opacity-50"
            >
              {isVerifying ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaShieldAlt />
              )}
              <span className="text-sm">
                {isVerifying ? "Verifying..." : "Verify"}
              </span>
            </button>
          )}

          {ticket.transaction_hash && (
            <button
              onClick={handleViewTransaction}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-black/20 text-gray-300 border border-gray-500/30 hover:border-cyan-400/50 hover:text-white transition-all"
            >
              <FaExternalLinkAlt className="text-sm" />
              <span className="text-sm">View TX</span>
            </button>
          )}
        </div>

        {/* Purchase Date */}
        <div className="mt-3 pt-3 border-t border-purple-500/20">
          <span className="text-xs text-gray-500">
            Purchased:{" "}
            {(() => {
              const purchaseDate = new Date(ticket.created_at);
              // displaying in local timezone
              return purchaseDate.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              });
            })()}
          </span>
        </div>
      </div>
    </div>
  );
}
