import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateQuestion(skill, level) {
  try {
    const prompt = `
    You are an expert interviewer for ${skill}.
    Generate one interview question for a ${level}-level candidate.
    The question should be concise and specific.
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful interview assistant." },
        { role: "user", content: prompt },
      ],
    });

    const question = response.choices[0].message.content.trim();
    return question;
  } catch (error) {
    console.error("❌ Error generating question:", error);
    throw new Error("Failed to generate question");
  }
}




