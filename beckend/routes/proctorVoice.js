
import express from "express";
import multer from "multer";
import { logProctorEvent } from "../ai/Proctoring.js";

const router = express.Router();
const upload = multer({ dest: "uploads/audio" });

router.post("/", upload.single("audioChunk"), async (req, res) => {
  const { userId, sessionId } = req.body;
  // TODO: Add simple verification or ML model to check for mismatched voice
  const violationDetected = Math.random() < 0.05; // placeholder: 5% chance for demo
  if (violationDetected) await logProctorEvent(userId, sessionId, "voiceMismatch", 5);
  res.json({ violation: violationDetected });
});

export default router;

