import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import { readFile } from "fs/promises";

const serviceAccount = JSON.parse(
  await readFile(new URL("./firebase-key.json", import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🔥 API is running...");
});

// ✅ Main route for skill hierarchy
app.post("/api/hierarchy", async (req, res) => {
  const { name, level } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Skill name is required" });
  }

  const hierarchy = [
    {
      level: "Foundational",
      question: `What is ${name}?`,
    },
    {
      level: "Intermediate",
      question: `Explain key concepts of ${name}.`,
    },
    {
      level: "Advanced",
      question: `How does ${name} work in real-world applications?`,
    },
  ];

  try {
    const docRef = await db.collection("skills").add({
      name,
      level: level || "N/A",
      hierarchy,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      message: "Skill hierarchy stored successfully!",
      id: docRef.id,
      data: { name, level, hierarchy },
    });
  } catch (error) {
    console.error("Error writing to Firestore:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all skills from Firestore
app.get("/api/skills", async (req, res) => {
  try {
    const snapshot = await db.collection("skills").get();
    const skills = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ success: true, skills });
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ success: false, message: "Failed to fetch skills" });
  }
});

// Get a single skill by ID
app.get("/api/skills/:id", async (req, res) => {
  try {
    const skillId = req.params.id;
    const docRef = db.collection("skills").doc(skillId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    res.status(200).json({ success: true, skill: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error("Error fetching skill:", error);
    res.status(500).json({ success: false, message: "Failed to fetch skill" });
  }
});

// Get a skill by name
app.get("/api/skills/by-name/:name", async (req, res) => {
  try {
    const skillName = req.params.name;
    console.log("Searching for skill:", skillName);

    const snapshot = await db.collection("skills").where("name", "==", skillName).get();
    console.log("Matching docs:", snapshot.size);

    if (snapshot.empty) {
      return res.status(404).json({ success: false, message: "Skill not found" });
    }

    const doc = snapshot.docs[0];
    res.status(200).json({ success: true, skill: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error("Error fetching skill by name:", error);
    res.status(500).json({ success: false, message: "Failed to fetch skill by name" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🔥 Server is running on http://localhost:${PORT}`);
});