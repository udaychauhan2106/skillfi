import React from "react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="relative z-20 flex items-center justify-between w-full px-10 py-6 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 w-10 h-10 flex items-center justify-center rounded-full">
          <FaUser size={18} />
        </div>
        <h1 className="text-2xl font-semibold tracking-wide">SkillFi</h1>
      </div>

      <nav className="hidden md:flex space-x-8 text-lg font-medium">
        <Link to="/" className="hover:text-blue-400 transition">
          About Us
        </Link>
        <Link to="/" className="hover:text-blue-400 transition">
          Services
        </Link>
        <Link to="/" className="hover:text-blue-400 transition">
          Contact Us
        </Link>
        <Link to="/login" className="hover:text-blue-400 transition">
          Sign Up
        </Link>
      </nav>
    </header>
  );
}
