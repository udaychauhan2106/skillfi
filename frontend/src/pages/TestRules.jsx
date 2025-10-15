import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const TestRules = () => {
  const navigate = useNavigate();
  const { skillId } = useParams();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/skills/${skillId}`);
        setSkill(res.data);
      } catch (err) {
        console.error("Error fetching skill:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkill();
  }, [skillId]);

  const handleStartTest = () => {
    localStorage.setItem("activeSkill", JSON.stringify(skill));
    navigate(`/test/${skillId}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full md:w-2/3 lg:w-1/2">
        <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">
          Skill Test Instructions
        </h1>
        <div className="border-t-2 border-blue-500 w-20 mx-auto mb-6"></div>

        <h2 className="text-xl font-semibold mb-2 text-gray-800 text-center">
          {skill?.name || "Selected Skill"}
        </h2>

        <p className="text-gray-600 mb-4 text-center">
          Duration:{" "}
          <span className="font-semibold">
            {skill?.duration || 10} minutes
          </span>
        </p>

        <ul className="list-disc text-gray-700 space-y-2 px-6 mb-6">
          <li>You must keep your camera ON throughout the test.</li>
          <li>Do not switch browser tabs or open other applications.</li>
          <li>Each question must be answered before proceeding to the next one.</li>
          <li>Your answers will be recorded and evaluated automatically by AI.</li>
          <li>Leaving the page or refreshing will end your test immediately.</li>
        </ul>

        <div className="flex justify-center">
          <button
            onClick={handleStartTest}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            I Agree, Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestRules;
