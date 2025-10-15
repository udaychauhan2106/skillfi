// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import hierarchyRoutes from "./routes/hierarchy.js";
import evaluateRoutes from "./routes/evaluate.js";
import videoEvaluateRoutes from "./routes/videoEvaluate.js";
import uploadRoutes from "./routes/uploadold.js"; // ✅ ES import, not require
import skillRoutes from "./routes/skills.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env
dotenv.config({ path: path.resolve(__dirname, ".env") });

// ✅ Connect DB
connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ✅ Static uploads folder (for project files)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/hierarchy", hierarchyRoutes);
app.use("/api/evaluate", evaluateRoutes);
app.use("/api/video", videoEvaluateRoutes); // AI live video evaluation route
app.use("/api/upload", uploadRoutes); // Project upload
app.use("/api/skills", skillRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));





