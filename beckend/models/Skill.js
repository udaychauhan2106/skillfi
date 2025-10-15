import mongoose from "mongoose";

const hierarchySchema = new mongoose.Schema({
  level: { type: String, required: true },
  question: { type: String, required: true },
});

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: Number, default: 10 }, // in minutes
  hierarchy: [hierarchySchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Skill", skillSchema);
