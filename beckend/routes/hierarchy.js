import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const { skill } = req.body;
  if (!skill) return res.status(400).json({ error: "Skill required" });

  const hierarchy = [
    { level: "Foundational", question: `What is ${skill}?` },
    { level: "Intermediate", question: `Explain key concepts of ${skill}.` },
    { level: "Advanced", question: `What are challenges in ${skill}?` },
    { level: "Applied", question: `How would you use ${skill} in a real project?` },
    { level: "Expert", question: `What’s the future of ${skill}?` }
  ];

  res.json({ skill, hierarchy });
});

export default router;
