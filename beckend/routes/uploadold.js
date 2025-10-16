import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Project from "../models/Project.js";
import { evaluateSkill } from "../ai/skillanalysis.js";

const router = express.Router();

const uploadPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post("/upload-skill", upload.single("file"), async (req, res) => {
  try {
    console.log("\n📥 New Upload Request Received");

    const { skill, githubLink } = req.body;
    const file = req.file;

    if (!skill && !githubLink) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file or provide a GitHub link.",
      });
    }

    let fileText = "";
    if (file) {
      const filePath = path.join(uploadPath, file.filename);
      try {
        const content = fs.readFileSync(filePath, "utf8");
        fileText = content.length > 3000 ? content.slice(0, 3000) + "\n...[truncated]" : content;
      } catch {
        console.warn("⚠️ Could not read uploaded file content.");
      }
    }

    const combinedInput =
      (fileText ? `Uploaded Code:\n${fileText}` : "") +
      (githubLink ? `\nGitHub Link: ${githubLink}` : "");

    console.log("🧠 Evaluating via OpenAI...");
    const evaluation = await evaluateSkill(skill, "Uploaded project analysis", combinedInput);

    const projectData = {
      title: skill,
      skill,
      githubLink,
      fileName: file ? file.originalname : null,
      filePath: file ? `/uploads/${file.filename}` : null,
      aiScore: evaluation?.score || 0,
      aiFeedback: evaluation?.feedback || "No feedback.",
    };

    if (req.user?._id) {
      projectData.user = req.user._id;
    }

    const project = await Project.create(projectData);

    console.log("✅ AI evaluation saved for project:", project._id);

    res.status(200).json({
      success: true,
      message: "✅ Skill evaluated and project saved successfully.",
      project,
    });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({
      success: false,
      message: "Error processing upload",
      error: err.message,
    });
  }
});

export default router;
