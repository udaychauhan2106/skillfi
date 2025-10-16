import mongoose from "mongoose";

const ProctorLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  sessionId: { type: String, required: true },
  events: [
    {
      type: { type: String, required: true }, 
      timestamp: { type: Date, default: Date.now },
      severity: { type: Number, default: 1 }, 
    },
  ],
});

export default mongoose.model("ProctorLog", ProctorLogSchema);

