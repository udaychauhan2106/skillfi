import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, 
    },

    skill: {
      type: String,
      required: [true, "Skill is required"],
      trim: true,
    },

    title: {
      type: String,
      trim: true,
    },

    githubLink: {
      type: String,
      trim: true,
    },

    fileName: {
      type: String,
      trim: true,
    },
    filePath: {
      type: String,
      trim: true,
    },

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
