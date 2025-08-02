import {
  FaUserLock,
  FaUserPlus,
  FaShieldVirus,
  FaRocket,
  FaGem,
} from "react-icons/fa";
import {
  RiShieldKeyholeLine,
  RiSecurePaymentLine,
  RiFlashlightLine,
} from "react-icons/ri";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { BiCube } from "react-icons/bi";
import rippleLogo from "../assets/ripplegate.webp";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: <RiShieldKeyholeLine className="text-2xl" />,
      title: "Blockchain Security",
      description: "Immutable ticket verification on XRP Ledger",
    },
    {
      icon: <RiFlashlightLine className="text-2xl" />,
      title: "Instant Transfers",
      description: "Lightning-fast ticket transactions",
    },
    {
      icon: <RiSecurePaymentLine className="text-2xl" />,
      title: "Zero Fraud",
      description: "Cryptographic proof prevents counterfeiting",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Primary gradient overlay */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(139, 92, 246, 0.3) 0%, 
              rgba(59, 130, 246, 0.2) 25%, 
              rgba(16, 185, 129, 0.1) 50%, 
              transparent 70%)`,
          }}
        />

        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-emerald-900/20 animate-pulse" />
          <div
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-3xl animate-bounce"
            style={{ animationDuration: "6s" }}
          />
          <div
            className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl animate-bounce"
            style={{ animationDuration: "8s", animationDelay: "2s" }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        {/* Hero Section */}
        <div
          className={`max-w-6xl w-full transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Logo and Badge */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative bg-black/50 backdrop-blur-xl rounded-full p-4 border border-white/10">
                <img
                  src={rippleLogo || "/placeholder.svg"}
                  alt="RippleGate Logo"
                  className="w-16 h-16 md:w-20 md:h-20 object-contain filter drop-shadow-lg"
                />
              </div>
            </div>

            <div className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-full border border-cyan-500/20">
              <span className="text-cyan-400 text-sm font-medium flex items-center gap-2">
                <HiSparkles className="text-yellow-400" />
                Powered by XRP Ledger
                <HiSparkles className="text-yellow-400" />
              </span>
            </div>
          </div>

          {/* Main Title */}
          <div className="text-center mb-8">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-purple-300">
                Ripple
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                Gate
              </span>
            </h1>

            <div className="relative">
              <p className="font-sans text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
                The future of event ticketing is here. Experience
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-semibold">
                  {" "}
                  secure
                </span>
                ,
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
                  {" "}
                  transparent
                </span>
                , and
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 font-semibold">
                  {" "}
                  decentralized
                </span>{" "}
                ticketing
              </p>

              <div className="flex items-center justify-center gap-2 text-gray-400">
                <BiCube className="text-cyan-400" />
                <span className="text-sm">Built on blockchain technology</span>
                <HiLightningBolt className="text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:transform hover:scale-105 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="/login"
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-3">
                <FaUserLock className="text-lg" />
                <span>Access Dashboard</span>
                <div className="w-2 h-2 bg-white/50 rounded-full group-hover:animate-ping" />
              </div>
            </a>

            <a
              href="/signup"
              className="group relative px-8 py-4 bg-white/5 backdrop-blur-xl rounded-2xl font-semibold text-white border border-white/20 overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-3">
                <FaUserPlus className="text-lg" />
                <span>Create Account</span>
                <FaRocket className="text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <FaShieldVirus className="text-green-400" />
                <span>Bank-level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <FaGem className="text-purple-400" />
                <span>Premium Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <HiLightningBolt className="text-yellow-400" />
                <span>Instant Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
