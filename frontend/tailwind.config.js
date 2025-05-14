/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      keyframes: {
        "notification-slide-in": {
          "0%": {
            opacity: "0",
            transform: "translate(-50%, -20px)",
          },
          "20%": {
            opacity: "1",
            transform: "translate(-50%, 0)",
          },
          "80%": {
            opacity: "1",
            transform: "translate(-50%, 0)",
          },
          "100%": {
            opacity: "0",
            transform: "translate(-50%, -10px)",
          },
        },
        "notification-pulse": {
          "0%": {
            boxShadow: "0 0 0 0 rgba(74, 222, 128, 0.4)",
            transform: "scale(0.95)",
          },
          "20%": {
            boxShadow: "0 0 0 5px rgba(74, 222, 128, 0)",
            transform: "scale(1)",
          },
          "80%": {
            transform: "scale(1)",
          },
          "100%": {
            transform: "scale(0.98)",
            opacity: 0,
          },
        },
        "notification-icon-pop": {
          "0%": { transform: "scale(0)" },
          "50%": { transform: "scale(1.2)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        "notification-text-fade": {
          "0%": { opacity: "0", transform: "translateX(10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "notification-slide-in":
          "notification-slide-in 3s ease-in-out forwards",
        "notification-pulse": "notification-pulse 3s ease-in-out forwards",
        "notification-icon-pop": "notification-icon-pop 0.5s ease-out forwards",
        "notification-text-fade":
          "notification-text-fade 0.5s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
