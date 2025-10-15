import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaPen,
  FaMedal,
  FaLightbulb,
  FaSignOutAlt,
  FaQuestionCircle,
} from "react-icons/fa";

export default function SkillUpload() {
  const [skill, setSkill] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const navigate = useNavigate();

  // Toggle sidebar
  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.width = sidebar.style.width === "300px" ? "0" : "300px";
  };

  // Logout
  const handleLogout = () => {
    alert("You have been logged out.");
    window.location.href = "/login";
  };

  // ✅ Upload + AI Evaluation + Navigate to /rules/:id
  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEvaluation(null);

    const formData = new FormData();
    formData.append("skill", skill);
    if (file) formData.append("file", file);
    if (githubLink) formData.append("githubLink", githubLink);

    try {
      const res = await fetch("http://localhost:5000/api/upload/upload-skill", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      console.log("✅ Server Response:", data);

      if (data.success && data.project?._id) {
        // Save project to localStorage
        localStorage.setItem("activeSkill", JSON.stringify(data.project));

        // Set evaluation details for UI feedback (optional)
        setEvaluation({
          score: data.project.aiScore ?? "N/A",
          feedback:
            data.project.aiFeedback ??
            "Evaluation completed, but feedback missing.",
        });

        // 🟢 Navigate to Test Rules page
        setTimeout(() => {
          navigate(`/rules/${data.project._id}`);
        }, 1200); // small delay so user can see "Success"
      } else {
        alert("Evaluation complete, but project data missing.");
      }
    } catch (error) {
      console.error("❌ Upload Error:", error);
      alert("There was a problem uploading or evaluating your skill.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-gray-800 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://i.pinimg.com/1200x/73/b8/a9/73b8a9fdd483d6ddac928aa780ccfb2d.jpg')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white/0 backdrop-blur-md shadow-sm relative z-10">
        <img
          src="https://image2url.com/images/1760087403658-2a78793e-55ea-4d22-80bf-f49a687cd2c8.png"
          alt="Skillfi Logo"
          className="w-32 h-10"
        />

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
            <FaUser className="text-xl" />
          </div>
        </div>
      </header>

      {/* Upload Form */}
      <main className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 px-6 py-16">
        <form
          onSubmit={handleUpload}
          className="bg-white/20 backdrop-blur-lg shadow-2xl p-8 rounded-2xl w-full md:w-3/4 text-white"
        >
          <h2 className="text-4xl  mb-6 text-center">
            Upload Your Skill
          </h2>

          {/* Skill Input */}
          <textarea
            rows="5"
            placeholder="Describe your skill (e.g., Python, React, UI Design)..."
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full p-4 rounded-lg text-black-900 border-1 border-grey-200 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-5 resize-none"
          ></textarea>

          {/* File Upload */}
          <label className="block text-lg mb-3 font-bold text-gray-300">
            Upload Project File:
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-black-200 file:mr-4 file:py-2 file:px-6 file:rounded-lg file:border-0 file:text-lg file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 mb-6"
          />

          {/* GitHub Link */}
          <label className="text-lg block mb-3 text-gray-300 ">
            GitHub Repository Link:
          </label>
          <input
            type="text"
            placeholder="Paste your GitHub link..."
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
            className="w-full h-14 p-3 border-1 rounded-lg text-black-900 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Evaluating..." : "Upload & Evaluate Skill"}
          </button>
        </form>
      </main>

      {/* Evaluation Result */}
      {evaluation && (
        <div className="relative z-10 flex flex-col items-center text-white mt-10 mb-20">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg w-[90%] max-w-2xl text-center">
            <h3 className="text-2xl font-semibold mb-4">Evaluation Results</h3>
            <p className="text-lg mb-2">
              <strong>Score:</strong> {evaluation.score} / 100
            </p>
            <p className="text-gray-200">{evaluation.feedback}</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
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
              Hi, User 👋
            </h3>
            <a
              href="/edit-profile"
              className="flex items-center gap-3 hover:text-blue-400 transition"
            >
              <FaPen /> Edit Profile
            </a>
            <a
              href="/dashboard"
              className="flex items-center gap-3 hover:text-blue-400 transition"
            >
              <FaMedal /> Dashboard
            </a>
            <a
              href="/my-skills"
              className="flex items-center gap-3 hover:text-blue-400 transition"
            >
              <FaLightbulb /> My Skills
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-red-400 hover:text-red-500 transition"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
          <div className="border-t border-slate-700 pt-5 mt-5">
            <button
              onClick={() => alert("Redirecting to Help")}
              className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition"
            >
              <FaQuestionCircle /> Help & Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
