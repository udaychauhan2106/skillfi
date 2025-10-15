import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TestPage1() {
  const { skillId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [videoURL, setVideoURL] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [testScores, setTestScores] = useState([]); // store AI scores per question
  const videoRef = useRef();

  // ✅ Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/evaluate/all");
        const data = await response.json();
        if (data.success) {
          setQuestions(data.questions);
        } else {
          console.error("❌ Failed to load questions:", data.error);
        }
      } catch (err) {
        console.error("❌ Error fetching questions:", err);
      }
    };
    fetchQuestions();
  }, []);

  // ✅ Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;

      const recorder = new MediaRecorder(stream);
      setChunks([]);

      recorder.ondataavailable = (e) => setChunks((prev) => [...prev, e.data]);

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoURL(url);
        uploadVideo(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      alert("⚠️ Camera/microphone access denied or unavailable.");
      console.error(err);
    }
  };

  // ✅ Stop recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      const tracks = videoRef.current.srcObject?.getTracks();
      tracks?.forEach((track) => track.stop());
    }
  };

  // ✅ Upload and evaluate
  const uploadVideo = async (blob) => {
    setLoading(true);
    setFeedback("");

    const formData = new FormData();
    formData.append("video", blob, "response.webm");
    formData.append("skill", skillId);
    formData.append("question", questions[currentQuestion]?.question || "");

    try {
      const response = await fetch("http://localhost:5000/api/video", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFeedback(`✅ AI Feedback: ${data.feedback}\nScore: ${data.score}/100`);
        setTestScores((prev) => [...prev, data.score]);
      } else {
        setFeedback("❌ Evaluation failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setFeedback("⚠️ Server error during evaluation. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Move to next question or final score page
  const handleNext = () => {
    const next = currentQuestion + 1;
    if (next < questions.length) {
      setCurrentQuestion(next);
      setFeedback("");
      setVideoURL("");
    } else {
      // all questions done → calculate final test score
      const avgTestScore =
        testScores.reduce((a, b) => a + b, 0) / testScores.length || 0;
      const projectScore = 80; // placeholder, you can fetch real value later
      const finalScore = Math.round(projectScore * 0.3 + avgTestScore * 0.7);

      navigate("/score", {
        state: { projectScore, testScore: avgTestScore, finalScore },
      });
    }
  };

  // ✅ Smooth scroll when feedback arrives
  useEffect(() => {
    if (feedback) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [feedback]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-blue-400">🎯 AI Skill Test</h1>

      {questions.length === 0 ? (
        <p className="text-gray-400">Loading questions...</p>
      ) : (
        <>
          <h2 className="text-2xl mb-4 text-center max-w-2xl">
            {questions[currentQuestion]?.question ||
              "No question available for this skill."}
          </h2>

          <div className="flex flex-col items-center gap-4">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-96 h-72 rounded-xl border border-gray-700"
            />

            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-6 py-3 bg-green-600 rounded-xl hover:bg-green-700 transition"
              >
                🎥 Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700 transition"
              >
                ⏹ Stop Recording
              </button>
            )}
          </div>

          {loading && (
            <p className="mt-4 text-yellow-400 animate-pulse">
              ⏳ Analyzing your response...
            </p>
          )}

          {videoURL && !loading && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">🎬 Your Recorded Answer:</h3>
              <video
                src={videoURL}
                controls
                className="w-96 h-72 rounded-xl border border-gray-600"
              />
            </div>
          )}

          {feedback && (
            <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700 w-[28rem]">
              <h3 className="text-xl font-semibold text-green-400 mb-2">
                🤖 AI Evaluation
              </h3>
              <p className="whitespace-pre-line">{feedback}</p>
              <button
                onClick={handleNext}
                className="mt-4 px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
              >
                {currentQuestion + 1 === questions.length
                  ? "Finish Test →"
                  : "Next Question →"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
