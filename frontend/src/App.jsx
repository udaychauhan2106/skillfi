import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SkillUpload from "./pages/SkillUpload";
import TestRules from "./pages/TestRules";
import TestPage1 from "./pages/TestPage1";
import ScorePage from "./pages/ScorePage";

function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <AnimatedPage>
              <LandingPage />
            </AnimatedPage>
          }
        />
        <Route
          path="/login"
          element={
            <AnimatedPage>
              <LoginPage />
            </AnimatedPage>
          }
        />
        <Route
          path="/uploadskill"
          element={
            <AnimatedPage>
              <SkillUpload />
            </AnimatedPage>
          }
        />
        <Route
          path="/rules/:skillId"
          element={
            <AnimatedPage>
              <TestRules />
            </AnimatedPage>
          }
        />
        <Route
          path="/test/:skillId"
          element={
            <AnimatedPage>
              <TestPage1 />
            </AnimatedPage>
          }
        />

        <Route
          path="/score"
          element={
            <AnimatedPage>
              <ScorePage />
            </AnimatedPage>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
