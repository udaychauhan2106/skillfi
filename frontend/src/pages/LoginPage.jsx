import React from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/uploadskill");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-[#0a0a12] overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d1a] via-[#0b0b17] to-[#000000]"></div>
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 mt-20 w-[90%] max-w-lg bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-white/10"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 border border-white/10">
            <FaUser className="text-gray-300" />
            <input
              type="text"
              placeholder="Name"
              className="bg-transparent outline-none w-full text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 border border-white/10">
            <FaEnvelope className="text-gray-300" />
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent outline-none w-full text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 border border-white/10">
            <FaLock className="text-gray-300" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none w-full text-white placeholder-gray-400"
              required
            />
          </div>

          <p className="text-right text-sm text-gray-300">
            Forgot password?{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Click here
            </a>
          </p>

          <div className="flex gap-4 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="w-1/2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition duration-300"
            >
              Sign Up
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-1/2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition duration-300"
            >
              Login
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

