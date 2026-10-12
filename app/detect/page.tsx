"use client";

import React, { useState } from "react";
import EmotionDetector from "../components/EmotionDetector";
import { Navbar } from "../components/Navbar";

export default function Detect() {
  const [currentEmotion, setCurrentEmotion] = useState<string>("Neutral");

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/40 via-white to-slate-50/60 pb-16">
      <Navbar currentEmotion={currentEmotion !== "Neutral" ? currentEmotion : undefined} />
      <main className="max-w-6xl mx-auto px-3 md:px-6 pt-6">
        <EmotionDetector
          onEmotionDetected={(emotion) => setCurrentEmotion(emotion)}
        />
      </main>
    </div>
  );
}
