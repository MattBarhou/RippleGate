import { FaUserLock, FaUserPlus } from "react-icons/fa";
import { RiShieldKeyholeLine } from "react-icons/ri";
import rippleLogo from "../assets/ripplegate.webp";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full bg-black/30 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/20 shadow-2xl">
        <div className="flex justify-center mb-4">
          <img
            src={rippleLogo}
            alt="RippleGate Logo"
            className="w-20 h-20 md:w-24 md:h-24 object-contain"
          />
        </div>
        <h1 className="font-display text-4xl md:text-6xl py-4 font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-6 text-center tracking-tight">
          RippleGate
        </h1>

        <p className="font-sans text-gray-300 md:text-lg text-center mb-8 flex items-center justify-center gap-2">
          <RiShieldKeyholeLine className="text-cyan-400 text-xl" />
          Secure, transparent, and decentralized event ticketing powered by
          blockchain
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/login"
            className="font-sans px-6 py-3 cursor-pointer rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2"
          >
            <FaUserLock /> Log In
          </a>
          <a
            href="/signup"
            className="font-sans px-6 py-3 cursor-pointer rounded-full bg-transparent border border-purple-500 text-white font-semibold hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
          >
            <FaUserPlus /> Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
