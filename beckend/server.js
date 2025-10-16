import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";

import { connectDB } from "./config/db.js";

import hierarchyRoutes from "./routes/hierarchy.js";
import evaluateRoutes from "./routes/evaluate.js";
import videoEvaluateRoutes from "./routes/videoEvaluate.js";
import uploadRoutes from "./routes/uploadold.js";
import skillRoutes from "./routes/skills.js";
import proctorVoiceRoutes from "./routes/proctorVoice.js";
import proctorRoutes from "./routes/proctor.js";


import { initProctorSocket } from "./routes/proctor.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.join(__dirname, ".env") });
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
console.log("MONGO_URI:", process.env.MONGO_URI);


connectDB();


const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/hierarchy", hierarchyRoutes);
app.use("/api/evaluate", evaluateRoutes);
app.use("/api/video", videoEvaluateRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/proctor/voice", proctorVoiceRoutes);
app.use("/api/proctor", proctorRoutes);
const server = http.createServer(app);

const io = initProctorSocket(server);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));




