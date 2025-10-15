// ai/proctoring.js
import ProctorLog from "../models/ProctorLog.js";

/**
 * Save a single proctoring event
 */
export async function logProctorEvent(userId, sessionId, type, severity = 1) {
  try {
    let log = await ProctorLog.findOne({ userId, sessionId });
    if (!log) {
      log = new ProctorLog({ userId, sessionId, events: [] });
    }

    log.events.push({ type, severity });
    await log.save();
  } catch (err) {
    console.error("❌ Failed to log proctor event:", err);
  }
}

/**
 * Compute penalty score from recorded events
 * @param {string} userId
 * @param {string} sessionId
 * @param {number} maxPenalty Maximum points to deduct (e.g., 30)
 */
export async function computeCheatingPenalty(userId, sessionId, maxPenalty = 30) {
  try {
    const log = await ProctorLog.findOne({ userId, sessionId });
    if (!log || !log.events.length) return 0;

    const totalSeverity = log.events.reduce((sum, e) => sum + e.severity, 0);
    return Math.min(maxPenalty, totalSeverity);
  } catch (err) {
    console.error("❌ Failed to compute cheating penalty:", err);
    return 0;
  }
}

/**
 * Adjust AI score dynamically
 */
export async function applyProctorPenalty(originalScore, userId, sessionId, maxPenalty = 30) {
  const penalty = await computeCheatingPenalty(userId, sessionId, maxPenalty);
  return Math.max(0, originalScore - penalty);
}

