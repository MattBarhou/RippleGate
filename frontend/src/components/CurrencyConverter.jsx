import { useState, useEffect } from "react";
import { FaExchangeAlt, FaSync } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  getXRPRates,
  supportedCurrencies,
  formatCurrency,
  convertXRPToFiat,
} from "../helper";

export default function CurrencyConverter({ amount }) {
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [exchangeRates, setExchangeRates] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch rates when component mounts or amount changes
  useEffect(() => {
    if (amount) {
      fetchExchangeRates();
    }
  }, []);

  const fetchExchangeRates = async () => {
    try {
      setIsLoading(true);
      const rates = await getXRPRates();
      setExchangeRates(rates);
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error);
      toast.error("Could not load currency rates. Using estimated values.");

      // Fallback to estimated rates if API fails
      setExchangeRates({
        usd: 0.48,
        eur: 0.45,
        gbp: 0.38,
        jpy: 75.5,
        aud: 0.74,
        cad: 0.66,
        chf: 0.44,
        cny: 3.48,
        inr: 40.25,
        krw: 648.32,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshRates = async () => {
    toast.info("Refreshing exchange rates...");
    await fetchExchangeRates();
    toast.success("Exchange rates updated!");
  };

  const calculateFiatPrice = () => {
    if (!amount || !exchangeRates[selectedCurrency]) return "";

    const convertedAmount = convertXRPToFiat(
      amount,
      exchangeRates[selectedCurrency]
    );

    return formatCurrency(convertedAmount, selectedCurrency);
  };

  if (!amount) return null;

  return (
    <div className="mt-2 bg-black/40 p-3 rounded-xl border border-cyan-500/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <FaExchangeAlt className="text-cyan-400 mr-2" />
          <span className="text-gray-300 text-sm">Currency Converter</span>
        </div>
        <button
          type="button"
          onClick={handleRefreshRates}
          className="text-cyan-400 hover:text-cyan-300 p-1 rounded-full hover:bg-cyan-900/20 transition-colors"
          title="Refresh rates"
        >
          <FaSync className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Currency Select Dropdown - Full Width */}
      <div className="mb-2">
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="w-full bg-black/60 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm"
        >
          {supportedCurrencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Converted Price */}
      {isLoading ? (
        <div className="py-1 text-gray-400 text-sm">Loading rates...</div>
      ) : (
        <div className="py-1 flex justify-between items-center">
          <span className="text-gray-300">Equivalent:</span>
          <span className="font-medium text-white text-lg">
            {calculateFiatPrice() || "—"}
          </span>
        </div>
      )}

      {/* CoinGecko Attribution */}
      <div className="mt-2 pt-2 border-t border-purple-500/10 text-xs text-gray-400 flex items-center justify-between">
        <span>Data: CoinGecko API</span>
        {exchangeRates[selectedCurrency] && (
          <span className="bg-gray-800/50 px-1.5 py-0.5 rounded text-gray-300">
            1 XRP ≈{" "}
            {formatCurrency(exchangeRates[selectedCurrency], selectedCurrency)}
          </span>
        )}
      </div>
    </div>
  );
}
