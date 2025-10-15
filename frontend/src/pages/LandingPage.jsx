import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/1200x/73/b8/a9/73b8a9fdd483d6ddac928aa780ccfb2d.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Navbar */}
      <header className="relative z-20 flex items-center justify-between w-full px-8 py-5 backdrop-blur-md bg-white/5 shadow-lg">
        <div>
          <img
            src="https://image2url.com/images/1760087403658-2a78793e-55ea-4d22-80bf-f49a687cd2c8.png"
            alt="SkillFi Logo"
            className="h-10"
          />
        </div>

        <nav className="hidden md:flex space-x-8 text-lg font-medium">
          <a href="/about" className="hover:text-blue-400 transition">&lt;About Us&gt;</a>
          <a href="/services" className="hover:text-blue-400 transition">&lt;Services&gt;</a>
          <a href="/contact" className="hover:text-blue-400 transition">&lt;Contact Us&gt;</a>
          <a href="/login" className="hover:text-blue-400 transition">&lt;Sign Up&gt;</a>
        </nav>

        <div className="flex items-center">
          <div
            className="bg-blue-600 hover:bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full cursor-pointer shadow-lg transition"
          >
            <i className="fa-solid fa-user text-xl"></i>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 text-center mt-32 max-w-3xl">
        <h1 className="text-5xl font-extrabold mb-6 leading-tight">
          Empower Your <span className="text-blue-400">Skills</span><br />
          Get <span className="text-cyan-400">Recognized</span> Instantly
        </h1>
        <p className="text-gray-300 text-lg mb-10">
          SkillFi helps you showcase your verified skills and connect with global opportunities.
        </p>

        {/* ✅ Framer Motion Button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/uploadskill"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition"
          >
            Get your skills verified
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-32 text-gray-400 text-sm">
        © 2025 SkillFi. All rights reserved.
      </footer>
    </div>
  );
}
