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

// Verify ticket ownership
export const verifyTicket = async (ticketId) => {
  try {
    const response = await axios.get(`${API_URL}verify/${ticketId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user NFTs from XRPL
export const getUserNFTs = async (walletAddress) => {
  try {
    const response = await axios.get(`${API_URL}nfts/${walletAddress}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
