import express from "express";
import Skill from "../models/Skill.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json(skills);
  } catch (err) {
    console.error("❌ Error fetching skills:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.status(200).json(skill);
  } catch (err) {
    console.error("❌ Error fetching skill:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/", async (req, res) => {
  try {
    const { name, duration, hierarchy } = req.body;
    const newSkill = new Skill({ name, duration, hierarchy });
    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (err) {
    console.error("❌ Error adding skill:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
