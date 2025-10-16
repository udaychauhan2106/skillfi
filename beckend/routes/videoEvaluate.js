import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
import { evaluateSkill } from "../ai/skillanalysis.js"; 

dotenv.config();
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const uploadDir = path.join(process.cwd(), "uploads", "videos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created uploads/videos folder");
} else {
  console.log("📁 uploads/videos folder already exists");
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 200 * 1024 * 1024 }, 
});

router.post("/", upload.single("video"), async (req, res) => {
  try {
    const { skill, question } = req.body;
    const videoPath = req.file?.path;

    if (!videoPath) {
      return res.status(400).json({
        success: false,
        message: "No video uploaded.",
      });
    }

    console.log("🎥 Received video:", videoPath);

    let transcriptText = "";
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(videoPath),
        model: "gpt-4o-mini-transcribe", 
      });
      transcriptText = transcription.text?.trim() || "No speech detected.";
      console.log("🗣️ Transcribed text:", transcriptText);
    } catch (err) {
      if (err.code === "insufficient_quota" || err.status === 429) {
        console.warn("🚫 OpenAI quota exceeded — skipping transcription.");
        transcriptText = "Transcription unavailable due to OpenAI quota limit.";
      } else {
        console.error("🎤 Transcription failed:", err);
        transcriptText = "Transcription failed due to audio processing error.";
      }
    }

    console.log("⚙️ Running evaluateSkill() for unified scoring...");
    const evaluation = await evaluateSkill(skill, question, transcriptText);

    fs.unlink(videoPath, (err) => {
      if (err) console.error("⚠️ Error deleting temp video:", err);
      else console.log("🧹 Deleted temp video:", videoPath);
    });

    res.status(200).json({
      success: true,
      feedback: evaluation.feedback,
      score: evaluation.score,
      transcript: transcriptText,
    });
  } catch (error) {
    console.error("❌ Video evaluation failed:", error);
    res.status(500).json({
      success: false,
      error: "Server error during video evaluation.",
      details: error.message,
    });
  }
});

export default router;
