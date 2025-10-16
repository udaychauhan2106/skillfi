import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function transcribeAudio(filePath) {
  try {
    console.log("🎤 Transcribing audio from:", filePath);
    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "gpt-4o-mini-transcribe", 
    });
    console.log("🗣️ Transcription complete.");
    return transcription.text;
  } catch (err) {
    console.error("🎤 Transcription failed:", err);
    return "";
  }
}

export async function evaluateSkill(skill, question, answerOrPath) {
  try {
    let answerPreview = "";
    
    if (typeof answerOrPath === "string" && fs.existsSync(answerOrPath)) {
      if (answerOrPath.endsWith(".webm") || answerOrPath.endsWith(".mp4")) {
        const transcript = await transcribeAudio(answerOrPath);
        answerPreview = transcript
          ? transcript.slice(0, 5000)
          : "No transcript available from video.";
      } else {
        const content = fs.readFileSync(answerOrPath, "utf8");

        const MAX_CHARS = 12000;
        answerPreview =
          content.length > MAX_CHARS
            ? content.slice(0, MAX_CHARS) + "\n...[truncated: content too long]"
            : content;
      }
    }
    else {
      answerPreview = typeof answerOrPath === "string" ? answerOrPath : "";
      if (answerPreview.length > 12000) {
        answerPreview =
          answerPreview.slice(0, 12000) + "\n...[truncated: input too long]";
      }
    }

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

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    let raw = completion.choices?.[0]?.message?.content?.trim() || "";
    console.log("🧠 Raw AI Response:", raw);

    raw = raw.replace(/```json|```/g, "").trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI JSON format");

    const parsed = JSON.parse(jsonMatch[0]);

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

