import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import MyTickets from "./pages/MyTickets";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import MainDashboard from "./components/MainDashBoard";

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          borderRadius: "12px",
          color: "white",
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main-dashboard" element={<MainDashboard />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/tickets" element={<MyTickets />} />
      </Routes>
    </Router>
  );
}

export default App;
