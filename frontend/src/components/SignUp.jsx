import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaWallet,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import { RiShieldKeyholeLine } from "react-icons/ri";
import { register } from "../api/auth";
import { trimUserData } from "../helper";
import { useNavigate } from "react-router-dom";
import ImageUploader from "./ImageUploader";

export default function SignUp() {
  const [userData, setUserData] = useState({
    profile_picture: "",
    email: "",
    password: "",
    wallet_address: "",
  });

  const [profilePreview, setProfilePreview] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (file) => {
    if (file) {
      setUserData({ ...userData, profile_picture: file.name });
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const trimmedUserData = trimUserData(userData);

    if (
      trimmedUserData.wallet_address.length < 25 ||
      trimmedUserData.wallet_address.length > 35
    ) {
      setErrorMessage(
        "Invalid wallet address, must be between 25 and 35 characters"
      );
      setIsLoading(false);
      return;
    }
    try {
      const response = await register(trimmedUserData);

      if (response && response.status === 200) {
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          navigate("/main-dashboard");
        }, 3000);
      } else {
        if (response && response.data && response.data.message) {
          setErrorMessage(response.data.message);
        } else {
          setErrorMessage("Registration failed. Please try again.");
        }
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 md:p-8 relative">
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
          <div className="bg-black/60 backdrop-blur-lg border border-green-500/50 shadow-lg shadow-green-500/20 rounded-xl py-3 px-6 flex items-center">
            <FaCheckCircle className="text-green-500 mr-3 text-xl" />
            <span className="text-white font-medium">
              Account created successfully!
            </span>
          </div>
        </div>
      )}

      <div className="max-w-md w-full bg-black/30 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/20 shadow-2xl">
        <div className="flex items-center justify-center mb-2">
          <RiShieldKeyholeLine className="text-cyan-400 text-3xl" />
        </div>
        <h1 className="font-display text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-6 text-center">
          Create Account
        </h1>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500/50 rounded-xl text-white text-sm">
            <p className="text-center">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Picture Upload */}
          <div className="flex justify-center mb-6">
            <ImageUploader
              imagePreview={profilePreview}
              onImageChange={handleImageChange}
              height="h-28"
              label="Profile Picture"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaEnvelope className="text-purple-400" />
            </div>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
              placeholder="Email address"
              className="w-full bg-gray-800/50 text-white pl-10 pr-4 py-3 rounded-xl border border-purple-500/30 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 placeholder-gray-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaLock className="text-purple-400" />
            </div>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
              placeholder="Secure password"
              className="w-full bg-gray-800/50 text-white pl-10 pr-4 py-3 rounded-xl border border-purple-500/30 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 placeholder-gray-500"
            />
          </div>

          {/* Wallet Address */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaWallet className="text-purple-400" />
            </div>
            <input
              type="text"
              name="wallet_address"
              value={userData.wallet_address}
              onChange={handleChange}
              required
              placeholder="XRP wallet address"
              className="font-mono w-full bg-gray-800/50 text-white pl-10 pr-4 py-3 rounded-xl border border-purple-500/30 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 placeholder-gray-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer py-3 px-6 mt-8 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Create Account
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
