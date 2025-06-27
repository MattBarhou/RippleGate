import { useState } from "react";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import { RiShieldKeyholeLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    const userData = { email, password };

    try {
      const response = await login(userData);
      if (response.status === 200) {
        navigate("/dashboard");
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.log({ email, password });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-md w-full bg-black/30 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/20 shadow-2xl">
        <div className="flex items-center justify-center mb-2">
          <RiShieldKeyholeLine className="text-cyan-400 text-3xl" />
        </div>
        <h1 className="font-display text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-6 text-center">
          Welcome Back!
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaEnvelope className="text-purple-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
              className="font-sans w-full bg-gray-800/50 text-white pl-10 pr-4 py-3 rounded-xl border border-purple-500/30 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 placeholder-gray-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaLock className="text-purple-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="font-sans w-full bg-gray-800/50 text-white pl-10 pr-4 py-3 rounded-xl border border-purple-500/30 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 placeholder-gray-500"
            />
          </div>

          <div className="flex justify-end">
            <a
              href="#"
              className="font-sans text-sm text-cyan-400 hover:text-cyan-300"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="font-sans w-full cursor-pointer py-3 px-6 mt-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 group"
          >
            Log In
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-sans text-gray-400 text-sm">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
