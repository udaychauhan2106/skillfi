import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // 🧠 User reference (optional)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // ✅ no longer required
    },

    // 🏷️ Skill name (e.g., "React", "Python", etc.)
    skill: {
      type: String,
      required: [true, "Skill is required"],
      trim: true,
    },

    // 📄 Project title (same as skill for now)
    title: {
      type: String,
      trim: true,
    },

    // 🔗 GitHub link (optional)
    githubLink: {
      type: String,
      trim: true,
    },

    // 📁 File info
    fileName: {
      type: String,
      trim: true,
    },
    filePath: {
      type: String,
      trim: true,
    },

    // 🤖 AI Evaluation
    aiScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    aiFeedback: {
      type: String,
      default: "Awaiting feedback",
      trim: true,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
