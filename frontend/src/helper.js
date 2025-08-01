export const trimUserData = (userData) => {
  return {
    email: userData.email.trim(),
    password: userData.password.trim(),
    profile_picture: userData.profile_picture || "",
    wallet_address: userData.wallet_address.trim(),
  };
};

// Function to format relative time
export const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now - activityTime) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }
};

// get status color
export const getStatusColor = (status) => {
  switch (status) {
    case "confirmed":
      return "text-green-400";
    case "pending":
      return "text-yellow-400";
    case "failed":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
};

// Currency converter helpers
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

// Supported currencies for conversion
export const supportedCurrencies = [
  { code: "usd", symbol: "$", name: "US Dollar" },
  { code: "eur", symbol: "€", name: "Euro" },
  { code: "gbp", symbol: "£", name: "British Pound" },
  { code: "jpy", symbol: "¥", name: "Japanese Yen" },
  { code: "aud", symbol: "A$", name: "Australian Dollar" },
  { code: "cad", symbol: "C$", name: "Canadian Dollar" },
  { code: "chf", symbol: "Fr", name: "Swiss Franc" },
  { code: "cny", symbol: "¥", name: "Chinese Yuan" },
  { code: "inr", symbol: "₹", name: "Indian Rupee" },
  { code: "krw", symbol: "₩", name: "South Korean Won" },
];

// Get current XRP price in various currencies
export const getXRPRates = async () => {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/simple/price?ids=ripple&vs_currencies=${supportedCurrencies
        .map((c) => c.code)
        .join(",")}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching XRP rates: ${response.status}`);
    }

    const data = await response.json();

    // If the API response doesn't contain ripple data, throw an error
    if (!data.ripple) {
      throw new Error("XRP rates not found in response");
    }

    return data.ripple;
  } catch (error) {
    console.error("Error fetching XRP rates:", error);
    throw error;
  }
};

// Format a currency value with the appropriate symbol
export const formatCurrency = (value, currencyCode) => {
  if (!value || isNaN(value)) return "—";

  const currency = supportedCurrencies.find((c) => c.code === currencyCode);
  if (!currency) return value.toFixed(2);

  return `${currency.symbol}${value.toFixed(2)}`;
};

// Convert XRP to another currency
export const convertXRPToFiat = (xrpAmount, exchangeRate) => {
  if (!xrpAmount || !exchangeRate || isNaN(xrpAmount) || isNaN(exchangeRate)) {
    return null;
  }

  return parseFloat(xrpAmount) * exchangeRate;
};
