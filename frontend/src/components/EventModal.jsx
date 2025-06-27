import { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaTicketAlt,
  FaClock,
  FaTimes,
} from "react-icons/fa";
import { useEventForm } from "../hooks/useEventForm";
import ImageUploader from "./ImageUploader";
import CurrencyConverter from "./CurrencyConverter";

export default function EventModal({ isOpen, onClose }) {
  const {
    eventData,
    loading,
    imagePreview,
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleImageChange,
    handleSubmit,
    resetForm,
  } = useEventForm(() => onClose());

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-auto">
      <div className="relative w-full max-w-2xl bg-black/60 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl my-4 max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 cursor-pointer right-4 text-gray-400 hover:text-white z-10"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <div className="p-5">
          <h2 className="text-2xl font-display font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text mb-4">
            Create New Event
          </h2>

          <div
            className="overflow-y-auto pr-2 max-h-[calc(90vh-150px)]"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#8b5cf6 #1f2937",
            }}
          >
            <form id="eventForm" onSubmit={handleSubmit} className="space-y-3">
              {/* Event Image Upload */}
              <div className="flex justify-center mb-4">
                <ImageUploader
                  imagePreview={imagePreview}
                  onImageChange={handleImageChange}
                  label="Upload Event Image"
                  height="h-40"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-black/40 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">
                  <FaMapMarkerAlt className="inline mr-2 text-cyan-400" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={eventData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-black/40 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Event location"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full px-4 py-2.5 bg-black/40 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Event description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">
                    <FaTicketAlt className="inline mr-2 text-cyan-400" />
                    Available Tickets
                  </label>
                  <input
                    type="number"
                    name="tickets"
                    value={eventData.tickets}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-2.5 bg-black/40 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    placeholder="Ticket quantity"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">
                    <FaCalendarAlt className="inline mr-2 text-cyan-400" />
                    Date
                  </label>
                  <DatePicker
                    selected={eventData.date}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    className="w-full px-4 py-2.5 bg-black/40 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    placeholderText="Select date"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">
                    <FaClock className="inline mr-2 text-cyan-400" />
                    Time
                  </label>
                  <DatePicker
                    selected={eventData.time}
                    onChange={handleTimeChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    className="w-full px-4 py-2.5 bg-black/40 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    placeholderText="Select time"
                  />
                </div>
              </div>

              {/* Price and Currency Converter in its own section */}
              <div>
                <label className="block text-gray-300 mb-1 font-medium">
                  <FaMoneyBillWave className="inline mr-2 text-cyan-400" />
                  Price (XRP)
                </label>
                <input
                  type="number"
                  name="price"
                  value={eventData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 bg-black/40 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="0.00"
                />

                {/* Currency Converter */}
                {eventData.price && (
                  <CurrencyConverter amount={eventData.price} />
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-purple-500/20 bg-black/60 rounded-b-3xl mt-auto">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 cursor-pointer rounded-full border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="eventForm"
              disabled={loading}
              className="px-5 py-2.5 cursor-pointer rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
