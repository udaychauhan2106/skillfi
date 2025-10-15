// ai/skillanalysis.js
import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * ✅ Helper: Transcribe audio/video file (e.g. .webm from webcam)
 */
async function transcribeAudio(filePath) {
  try {
    console.log("🎤 Transcribing audio from:", filePath);
    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "gpt-4o-mini-transcribe", // Whisper-based model
    });
    console.log("🗣️ Transcription complete.");
    return transcription.text;
  } catch (err) {
    console.error("🎤 Transcription failed:", err);
    return "";
  }
}

/**
 * ✅ AI Skill Evaluation Function (Optimized + Video Support)
 * @param {string} skill - The skill name or type (e.g., "React", "Python")
 * @param {string} question - The task or challenge description
 * @param {string} answerOrPath - The answer text, GitHub link, or file path (code OR video)
 * @returns {Promise<{score: number, feedback: string}>}
 */
export async function evaluateSkill(skill, question, answerOrPath) {
  try {
    let answerPreview = "";

    // 🧾 Case 1: Handle local file input (text/code/video)
    if (typeof answerOrPath === "string" && fs.existsSync(answerOrPath)) {
      if (answerOrPath.endsWith(".webm") || answerOrPath.endsWith(".mp4")) {
        // 🎥 Transcribe audio if it’s a video file
        const transcript = await transcribeAudio(answerOrPath);
        answerPreview = transcript
          ? transcript.slice(0, 5000)
          : "No transcript available from video.";
      } else {
        // 📄 Otherwise, read as text/code
        const content = fs.readFileSync(answerOrPath, "utf8");

        // 🔒 Limit input size
        const MAX_CHARS = 12000;
        answerPreview =
          content.length > MAX_CHARS
            ? content.slice(0, MAX_CHARS) + "\n...[truncated: content too long]"
            : content;
      }
    }
    // 🧾 Case 2: Direct text or GitHub link
    else {
      answerPreview = typeof answerOrPath === "string" ? answerOrPath : "";
      if (answerPreview.length > 12000) {
        answerPreview =
          answerPreview.slice(0, 12000) + "\n...[truncated: input too long]";
      }
    }

    // 🧠 Build concise evaluation prompt
    const prompt = `
You are an expert evaluator specializing in ${skill}.
Evaluate the following response and provide a JSON output.

---
📝 Question / Task:
${question}

💬 User Submission (preview):
${answerPreview}
---

Return ONLY valid JSON in this exact format:
{
  "score": <number>,
  "feedback": "<2–3 concise sentences of feedback>"
}`;

    // ✅ Call OpenAI safely
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    let raw = completion.choices?.[0]?.message?.content?.trim() || "";
    console.log("🧠 Raw AI Response:", raw);

    // 🧹 Clean up JSON if wrapped in markdown
    raw = raw.replace(/```json|```/g, "").trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI JSON format");

    const parsed = JSON.parse(jsonMatch[0]);

    // ✅ Validate structure
    if (typeof parsed.score !== "number" || !parsed.feedback) {
      throw new Error("AI response missing score or feedback");
    }

    return parsed;
  } catch (error) {
    console.error("❌ AI Evaluation Error:", error.message);
    return {
      score: 0,
      feedback:
        "Evaluation failed due to input or server error. Please try again later.",
    };
  }
}

