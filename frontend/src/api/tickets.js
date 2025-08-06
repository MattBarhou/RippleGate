import axios from "axios";

const API_URL = "http://localhost:5000/api/tickets/";

// Buy a ticket
export const buyTicket = async (eventId, userId) => {
  try {
    const response = await axios.post(
      `${API_URL}buy`,
      {
        event_id: eventId,
        user_id: userId,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user tickets
export const getUserTickets = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}user/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get recent ticket activity
export const getRecentActivity = async () => {
  try {
    const response = await axios.get(`${API_URL}activity`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
