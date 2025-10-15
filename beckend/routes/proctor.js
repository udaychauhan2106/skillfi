// routes/proctor.js

import { Server } from "socket.io";
import { logProctorEvent } from "../ai/Proctoring.js";

// Call this inside server.js after creating your express app
export function initProctorSocket(httpServer) {
  const io = new Server(httpServer, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("⚡ Proctor client connected:", socket.id);

    socket.on("startSession", ({ userId, sessionId }) => {
      socket.join(sessionId);
      console.log(`📝 Session started for user ${userId}`);
    });

    socket.on("proctorEvent", async ({ userId, sessionId, type, severity = 1 }) => {
      console.log(`📌 Proctor event: ${type} (severity: ${severity})`);
      await logProctorEvent(userId, sessionId, type, severity);
    });

    socket.on("disconnect", () => {
      console.log("⚡ Proctor client disconnected:", socket.id);
    });
  });

  return io;
}

