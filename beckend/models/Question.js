import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  level: { type: String, required: true },
  question: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Question", QuestionSchema);

