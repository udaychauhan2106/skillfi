import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Badge = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  const { skill = "JavaScript", username = "User" } = location.state || {};

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleDownload = () => {
    alert(`Downloading ${skill} badge...`);
  };

  const handleRedirect = (path, msg) => {
    alert(msg);
    navigate(path);
  };

  return (
    <div className="relative min-h-screen text-gray-800 overflow-hidden transition-colors duration-500">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/1200x/73/b8/a9/73b8a9fdd483d6ddac928aa780ccfb2d.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10">
        <header className="flex items-center justify-between px-8 py-4 bg-white/0 backdrop-blur-md shadow-sm">
          <div>
            <img
              src="https://image2url.com/images/1760087403658-2a78793e-55ea-4d22-80bf-f49a687cd2c8.png"
              alt="SkillFi Logo"
              className="w-25 h-10"
            />
          </div>

          <nav className="hidden md:flex space-x-8 text-lg font-medium text-white ml-auto">
            <a href="/about" className="hover:text-blue-400">
              &lt;About Us&gt;
            </a>
            <a href="/services" className="hover:text-blue-400">
              &lt;Services&gt;
            </a>
            <a href="/contact" className="hover:text-blue-400">
              &lt;Contact Us&gt;
            </a>
            <a href="/login" className="hover:text-blue-400">
              &lt;Sign Up&gt;
            </a>
          </nav>

          <div className="flex items-center">
            <div
              className="bg-blue-600 hover:bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full cursor-pointer shadow-lg transition"
              onClick={toggleSidebar}
            >
              <i className="fa-solid fa-user text-xl"></i>
            </div>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center px-6 py-16">
          <div className="bg-gradient-to-b from-purple-500 via-pink-500 to-red-500 rounded-3xl shadow-2xl flex flex-col items-center justify-start p-8 w-[450px] h-[700px] text-white">
            <img
              src="https://cdn-icons-png.flaticon.com/512/5968/5968292.png"
              alt={`${skill} Logo`}
              className="w-40 h-40 rounded-full bg-white/20 mt-5 mb-5"
            />

            <h1 className="text-5xl text-center drop-shadow-lg mb-7">
              {skill}
            </h1>

            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${skill}Badge-${username}`}
              alt="QR Code"
              className="w-[200px] h-[200px] rounded-lg bg-white/20 p-2 mb-0"
            />

            <button
              onClick={handleDownload}
              className="bg-white text-purple-900 font-semibold px-10 py-4 rounded-lg hover:bg-gray-100 transition shadow-md mt-20"
            >
              Download Badge
            </button>
          </div>
        </main>
      </div>

      <div
        className={`fixed top-0 right-0 h-full ${
          sidebarOpen ? "w-[300px]" : "w-0"
        } overflow-hidden bg-slate-900/95 shadow-xl transition-all duration-500 ease-in-out z-20 text-white`}
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
              href="/profile/edit"
              className="flex items-center gap-3 hover:text-blue-400 transition"
            >
              <i className="fa-solid fa-pen"></i> Edit Profile
            </a>
            <a
              href="/dashboard"
              className="flex items-center gap-3 hover:text-blue-400 transition"
            >
              <i className="fa-solid fa-medal"></i> Dashboard
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
              onClick={() =>
                handleRedirect(
                  "/notifications",
                  "Redirecting to Notification Preferences..."
                )
              }
              className="flex items-center gap-3 hover:text-blue-400 transition w-full text-left"
            >
              <i className="fa-solid fa-bell"></i> Notification Preferences
            </button>

            <button
              onClick={() =>
                handleRedirect("/login", "You have been logged out.")
              }
              className="flex items-center gap-3 text-red-400 hover:text-red-500 transition w-full text-left"
            >
              <i className="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>

          <div className="border-t border-slate-700 pt-5 mt-5">
            <button
              onClick={() =>
                handleRedirect("/help", "Redirecting to Help & Support...")
              }
              className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition w-full text-left"
            >
              <i className="fa-solid fa-circle-question"></i> Help & Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badge;
