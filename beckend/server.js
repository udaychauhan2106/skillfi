// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";

// DB
import { connectDB } from "./config/db.js";

// Routes
import hierarchyRoutes from "./routes/hierarchy.js";
import evaluateRoutes from "./routes/evaluate.js";
import videoEvaluateRoutes from "./routes/videoEvaluate.js";
import uploadRoutes from "./routes/uploadold.js";
import skillRoutes from "./routes/skills.js";
import proctorVoiceRoutes from "./routes/proctorVoice.js";
import proctorRoutes from "./routes/proctor.js";


// Socket
import { initProctorSocket } from "./routes/proctor.js";

// ------------------------------
// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------
// Load .env
dotenv.config({ path: path.join(__dirname, ".env") });
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
console.log("MONGO_URI:", process.env.MONGO_URI);

// ------------------------------
// Connect to MongoDB
connectDB();

// ------------------------------
// Express app
const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------------------
// Routes
app.use("/api/hierarchy", hierarchyRoutes);
app.use("/api/evaluate", evaluateRoutes);
app.use("/api/video", videoEvaluateRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/proctor/voice", proctorVoiceRoutes);
app.use("/api/proctor", proctorRoutes);
// ------------------------------
// Create HTTP server for socket.io
const server = http.createServer(app);

// Initialize proctor socket
const io = initProctorSocket(server);

// ------------------------------
// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));




