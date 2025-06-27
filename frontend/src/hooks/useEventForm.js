import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { createEvent } from "../api/events";

export const useEventForm = (onSuccess) => {
  const [eventData, setEventData] = useState({
    title: "",
    location: "",
    description: "",
    tickets: "",
    price: "",
    image: "",
    date: new Date(),
    time: new Date(),
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const resetForm = useCallback(() => {
    setEventData({
      title: "",
      location: "",
      description: "",
      tickets: "",
      price: "",
      image: "",
      date: new Date(),
      time: new Date(),
    });
    setImagePreview(null);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setEventData((prev) => ({
      ...prev,
      date,
    }));
  };

  const handleTimeChange = (time) => {
    setEventData((prev) => ({
      ...prev,
      time,
    }));
  };

  const handleImageChange = (file) => {
    if (file) {
      // Store the file name in the image field
      setEventData((prev) => ({ ...prev, image: file.name }));

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format date for backend
      const formattedDate = eventData.date.toISOString().split("T")[0];

      // Format time for the backend using the expected format
      // combine the date and time into a proper ISO string
      const timeDate = new Date(eventData.time);
      const hours = timeDate.getHours();
      const minutes = timeDate.getMinutes();
      const seconds = timeDate.getSeconds();

      // Create a properly formatted ISO timestamp
      const formattedTime = `${formattedDate}T${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;

      const imageUrl = imagePreview || eventData.image;

      const formattedData = {
        ...eventData,
        date: formattedDate,
        time: formattedTime,
        image: imageUrl,
      };

      await createEvent(formattedData);
      toast.success("Event created successfully!");

      if (typeof onSuccess === "function") {
        onSuccess();
      }

      resetForm();
    } catch (error) {
      toast.error(error.message || "Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return {
    eventData,
    loading,
    imagePreview,
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleImageChange,
    handleSubmit,
    resetForm,
  };
};
