import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const ScorePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extracting values passed from the test or evaluation component
  const {
    projectScore = 0,
    testScore = 0,
    skill = "JavaScript",
    username = "User",
  } = location.state || {};

  // Weighted final score (70% test + 30% project)
  const finalScore = Math.round(projectScore * 0.3 + testScore * 0.7);

  const [motivation, setMotivation] = useState("");

  useEffect(() => {
    if (finalScore >= 90) {
      setMotivation("Outstanding! You are a superstar! 🌟");
    } else if (finalScore >= 75) {
      setMotivation("Great job, keep pushing forward! 💪");
    } else if (finalScore >= 50) {
      setMotivation("Good effort! Practice makes perfect! ✨");
    } else {
      setMotivation("Don't give up! Every step counts! 🚀");
    }
  }, [finalScore]);

  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.width = sidebar.style.width === "300px" ? "0" : "300px";
  };

  const logout = () => {
    alert("You have been logged out.");
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen text-gray-800 overflow-hidden"
    >
      {/* 🔹 Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/1200x/73/b8/a9/73b8a9fdd483d6ddac928aa780ccfb2d.jpg')",
        }}
      ></div>
      <div className="absolute inset-0 bg-black/40"></div>

      {/* 🔹 Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4 bg-white/0 backdrop-blur-md shadow-sm">
        <div>
          <img
            src="https://image2url.com/images/1760087403658-2a78793e-55ea-4d22-80bf-f49a687cd2c8.png"
            alt="SkillFi"
            className="w-25 h-10"
          />
        </div>

        <nav className="hidden md:flex space-x-8 text-lg font-medium text-white ml-auto">
          <a href="/about" className="hover:text-blue-400">&lt;About Us&gt;</a>
          <a href="/services" className="hover:text-blue-400">&lt;Services&gt;</a>
          <a href="/contact" className="hover:text-blue-400">&lt;Contact Us&gt;</a>
          <a href="/login" className="hover:text-blue-400">&lt;Sign Up&gt;</a>
        </nav>

        <div
          className="bg-blue-600 hover:bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full cursor-pointer shadow-lg transition"
          onClick={toggleSidebar}
        >
          <i className="fa-solid fa-user text-xl"></i>
        </div>
      </header>

      {/* 🔹 Score Section */}
      <main className="flex items-center justify-center pt-[150px] relative z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-12 flex flex-col items-center space-y-8 w-[500px] h-[520px]"
        >
          {/* Motivational Message */}
          <div className="text-center">
            <p className="text-white/90 text-2xl mb-3">{motivation}</p>
            <h1 className="text-8xl font-bold text-white drop-shadow-lg pt-5">
              {finalScore}/100
            </h1>
            <p className="text-white/80 mt-2 text-3xl">Your Final Score</p>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white/20 p-4 rounded-xl w-full text-white text-lg">
            <p>
              🧠 Test Performance:{" "}
              <span className="text-blue-300">{testScore.toFixed(1)}%</span>
            </p>
            <p>
              💼 Project Quality:{" "}
              <span className="text-blue-300">{projectScore.toFixed(1)}%</span>
            </p>
            <p className="mt-2 text-sm text-gray-200">
              Formula: 70% Test + 30% Project
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col space-y-4 w-full">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition text-2xl"
            >
              View Dashboard
            </button>
            <button
              onClick={() =>
                navigate("/badge", {
                  state: { finalScore, skill, username },
                })
              }
              className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow-md transition text-2xl"
            >
              Generate Badge
            </button>
          </div>
        </motion.div>
      </main>

      {/* 🔹 Sidebar */}
      <div
        id="sidebar"
        className="fixed top-0 right-0 h-full w-0 overflow-hidden bg-slate-900/95 shadow-xl transition-all duration-500 ease-in-out z-20 text-white"
      >
        <div className="p-6 flex flex-col h-full">
          <button
            className="self-end text-3xl hover:text-blue-400 transition"
            onClick={toggleSidebar}
          >
            &times;
          </button>
          <div className="mt-6 space-y-6 text-lg flex-1">
            <h3 className="text-2xl font-semibold border-b border-slate-700 pb-3">
              Hi, {username} 👋
            </h3>
            <a
              href="/edit-profile"
              className="flex items-center gap-3 hover:text-blue-400 transition"
            >
              <i className="fa-solid fa-pen"></i> Edit Profile
            </a>
            <a
              href="/dashboard"
              className="flex items-center gap-3 hover:text-blue-400 transition"
            >
              <i className="fa-solid fa-chart-line"></i> Dashboard
            </a>
            <a
              href="/skills"
              className="flex items-center gap-3 hover:text-blue-400 transition"
            >
              <i className="fa-solid fa-lightbulb"></i> My Skills
            </a>
            <a
              href="/badges"
              className="flex items-center gap-3 hover:text-blue-400 transition"
            >
              <i className="fa-solid fa-medal"></i> My Badges
            </a>
            <button
              onClick={() => navigate("/notifications")}
              className="flex items-center gap-3 hover:text-blue-400 transition w-full text-left"
            >
              <i className="fa-solid fa-bell"></i> Notification Preferences
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-3 text-red-400 hover:text-red-500 transition w-full text-left"
            >
              <i className="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>
          <div className="border-t border-slate-700 pt-5 mt-5">
            <button
              onClick={() => navigate("/help")}
              className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition w-full text-left"
            >
              <i className="fa-solid fa-circle-question"></i> Help & Support
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScorePage;

