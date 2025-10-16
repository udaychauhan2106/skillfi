import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Proctoring from "../components/proctoring";

const TestPage1 = () => {
  const { skillId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [tabSwitches, setTabSwitches] = useState(0);

  const webcamRef = useRef(null);

  // ===========================
  // 📸 Recording Setup
  // ===========================
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
        webcamRef.current.play();
      }

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) setRecordedChunks((prev) => [...prev, event.data]);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Camera/mic access denied:", error);
      alert("Please allow camera and microphone access to continue the test.");
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);

      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const formData = new FormData();
      formData.append("video", blob, "recording.webm");

      try {
        const response = await fetch("http://localhost:5000/api/video/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        setVideoURL(data.videoUrl || "");
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  // ===========================
  // 📘 Fetch Questions
  // ===========================
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/questions/${skillId}`);
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [skillId]);

  // ===========================
  // 🚫 Tab Switch Detection
  // ===========================
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => prev + 1);
        handleViolation({
          type: "tab_switch",
          message: "User switched tab during test",
          timestamp: new Date(),
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // ===========================
  // ⚠️ Handle Proctor Violations
  // ===========================
  const handleViolation = (violation) => {
    console.warn("Violation detected:", violation);
    setWarnings((prev) => [...prev, violation.message]);

    // Log violation to backend
    fetch("http://localhost:5000/api/proctor/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...violation,
        testId: skillId,
        timestamp: new Date(),
      }),
    }).catch((err) => console.error("Failed to log violation:", err));
  };

  // ===========================
  // 🧠 Submit Answer
  // ===========================
  const handleSubmit = async (answer) => {
    const question = questions[currentQuestion];
    try {
      const res = await fetch("http://localhost:5000/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answer,
          skillId,
          videoURL,
          tabSwitches,
          warningsCount: warnings.length,
        }),
      });

      const data = await res.json();
      setFeedback(data.feedback || "Answer evaluated successfully.");

      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        stopRecording();
        navigate(`/results/${skillId}`);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  // ===========================
  // 🚀 Start Test on Mount
  // ===========================
  useEffect(() => {
    startRecording();
    return () => stopRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===========================
  // 🧩 Render
  // ===========================
  return (
    <div style={{ padding: "20px" }}>
      <h2>Test in Progress</h2>

      {/* 👁️ Proctoring System */}
      <Proctoring onViolation={handleViolation} />

      {/* 🎥 Webcam Feed */}
      <video
        ref={webcamRef}
        width="320"
        height="240"
        autoPlay
        muted
        style={{ borderRadius: "10px", marginTop: "10px" }}
      ></video>

      {/* ❓ Question Section */}
      {questions.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>
            Question {currentQuestion + 1}: {questions[currentQuestion].text}
          </h3>
          <textarea
            id="answer"
            rows="4"
            cols="50"
            placeholder="Type your answer..."
            style={{ display: "block", marginTop: "10px" }}
          ></textarea>
          <button
            onClick={() =>
              handleSubmit(document.getElementById("answer").value)
            }
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              borderRadius: "6px",
              background: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Submit Answer
          </button>
        </div>
      )}

      {/* 🧾 Feedback */}
      {feedback && (
        <p style={{ marginTop: "10px", color: "green" }}>
          Feedback: {feedback}
        </p>
      )}

      {/* ⚠️ Warnings */}
      {warnings.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4>Proctoring Warnings:</h4>
          <ul>
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestPage1;
