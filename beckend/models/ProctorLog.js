// models/ProctorLog.js
import mongoose from "mongoose";

const ProctorLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  sessionId: { type: String, required: true },
  events: [
    {
      type: { type: String, required: true }, // gazeAway, tabSwitch, copyPaste, multiFace, voiceMismatch
      timestamp: { type: Date, default: Date.now },
      severity: { type: Number, default: 1 }, // weight of penalty
    },
  ],
});

export default mongoose.model("ProctorLog", ProctorLogSchema);

