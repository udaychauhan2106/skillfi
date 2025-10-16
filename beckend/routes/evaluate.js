import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { generateQuestion } from "../ai/question.js";
import { evaluateSkill } from "../ai/skillanalysis.js";
import Question from "../models/Question.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/generate", async (req, res) => {
  const { skill, level } = req.body;

  if (!skill || !level)
    return res.status(400).json({ error: "Skill and level are required." });

  try {
    const question = await generateQuestion(skill, level);

    // Save to MongoDB
    const newQuestion = new Question({ skill, level, question });
    await newQuestion.save();

    res.status(200).json({
      success: true,
      message: "Question generated and saved successfully!",
      data: newQuestion,
    });
  } catch (err) {
    console.error("❌ Error generating question:", err);
    res.status(500).json({ error: "Failed to generate question" });
  }
});


router.post("/evaluate", async (req, res) => {
  const { skill, question, answer } = req.body;

  if (!skill || !question || !answer)
    return res
      .status(400)
      .json({ error: "Skill, question, and answer are required." });

  try {
    const evaluation = await evaluateSkill(skill, question, answer);
    res.status(200).json({ success: true, ...evaluation });
  } catch (err) {
    console.error("❌ Error evaluating answer:", err);
    res.status(500).json({ error: "Failed to evaluate answer" });
  }
});

router.post("/video", upload.single("video"), async (req, res) => {
  try {
    const { skill, question } = req.body;
    const filePath = req.file?.path;

    if (!skill || !question || !filePath) {
      return res
        .status(400)
        .json({ success: false, message: "Missing video, skill, or question." });
    }

    console.log(`📹 Received video for skill: ${skill}`);
    console.log("📁 File path:", filePath);

    const aiResult = await evaluateSkill(skill, question, filePath);

    fs.unlink(filePath, (err) => {
      if (err) console.warn("⚠️ Failed to delete temp file:", err);
    });

    res.status(200).json({
      success: true,
      message: "Video evaluated successfully!",
      ...aiResult,
    });
  } catch (error) {
    console.error("❌ Video Evaluation Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Video evaluation failed." });
  }
});


router.get("/all", async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (err) {
    console.error("❌ Error fetching questions:", err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

export default router;
