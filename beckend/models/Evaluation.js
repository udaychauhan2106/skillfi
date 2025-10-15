import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  score: { type: Number, required: true },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Evaluation", evaluationSchema);
