"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

type BreathingTechnique = "box" | "478" | "calm";

interface PhaseConfig {
  name: string;
  duration: number; // in seconds
  scale: number;
  instruction: string;
}

export const BreathingExercise: React.FC = () => {
  const [technique, setTechnique] = useState<BreathingTechnique>("box");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(4);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);

  const techniques: Record<BreathingTechnique, { title: string; description: string; phases: PhaseConfig[] }> = {
    box: {
      title: "Box Breathing",
      description: "Equal 4-part rhythm used by elite performers to stabilize high stress and restore calm.",
      phases: [
        { name: "Inhale", duration: 4, scale: 1.35, instruction: "Breathe in deeply through your nose..." },
        { name: "Hold", duration: 4, scale: 1.35, instruction: "Gently hold your breath with softness..." },
        { name: "Exhale", duration: 4, scale: 1.0, instruction: "Release smoothly through your mouth..." },
        { name: "Hold", duration: 4, scale: 1.0, instruction: "Stay empty and centered..." },
      ],
    },
    "478": {
      title: "4-7-8 Relaxation",
      description: "Dr. Andrew Weil's natural nervous system tranquilizer for sleep and anxiety relief.",
      phases: [
        { name: "Inhale", duration: 4, scale: 1.4, instruction: "Inhale quietly through your nose (4s)..." },
        { name: "Hold", duration: 7, scale: 1.4, instruction: "Hold peacefully (7s)..." },
        { name: "Exhale", duration: 8, scale: 1.0, instruction: "Exhale completely with a whoosh (8s)..." },
      ],
    },
    calm: {
      title: "4-4 Gentle Flow",
      description: "Balanced rhythmic breath to regulate heart rate variability and mental clarity.",
      phases: [
        { name: "Inhale", duration: 4, scale: 1.3, instruction: "Inhale calmness and light..." },
        { name: "Exhale", duration: 4, scale: 1.0, instruction: "Exhale tension and thoughts..." },
      ],
    },
  };

  const currentPhases = techniques[technique].phases;
  const currentPhase = currentPhases[phaseIndex] || currentPhases[0];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTotalSeconds((t) => t + 1);

        setSecondsRemaining((sec) => {
          if (sec <= 1) {
            // Advance phase
            setPhaseIndex((prevPhase) => {
              const nextPhase = (prevPhase + 1) % currentPhases.length;
              if (nextPhase === 0) {
                setCompletedCycles((c) => c + 1);
              }
              return nextPhase;
            });
            // Reset seconds for next phase
            const nextIdx = (phaseIndex + 1) % currentPhases.length;
            return currentPhases[nextIdx].duration;
          }
          return sec - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phaseIndex, currentPhases]);

  const handleToggle = () => {
    if (!isActive) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsRemaining(currentPhases[0].duration);
    setCompletedCycles(0);
    setTotalSeconds(0);
  };

  const handleSelectTechnique = (tech: BreathingTechnique) => {
    setTechnique(tech);
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsRemaining(techniques[tech].phases[0].duration);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <Card className="cloud-card rounded-3xl border border-white/80 p-6 md:p-8 relative overflow-hidden bg-white/90 backdrop-blur-2xl">
        {/* Cloudy background gradient accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-100/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-500 text-white shadow-lg shadow-sky-400/20">
                <Wind className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  Cloud Mind Sanctuary
                </h3>
                <p className="text-xs text-slate-500">
                  Affective calming protocol for heart rate synchronization & anxiety de-escalation
                </p>
              </div>
            </div>

            {/* Technique Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/60 self-start sm:self-auto">
              <button
                onClick={() => handleSelectTechnique("box")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  technique === "box"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Box 4×4
              </button>
              <button
                onClick={() => handleSelectTechnique("478")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  technique === "478"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                4-7-8 Calm
              </button>
              <button
                onClick={() => handleSelectTechnique("calm")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  technique === "calm"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Flow 4-4
              </button>
            </div>
          </div>

          {/* Central Ethereal Breathing Orb */}
          <div className="flex flex-col items-center justify-center py-6 space-y-6">
            <div className="relative flex items-center justify-center w-64 h-64 md:w-72 md:h-72">
              {/* Outer pulsing cloud ring */}
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-100 via-blue-50 to-indigo-50 border border-sky-200/60 shadow-inner transition-transform duration-1000 ease-in-out"
                style={{
                  transform: isActive ? `scale(${currentPhase.scale * 1.08})` : "scale(1)",
                  opacity: isActive ? 0.85 : 0.4,
                }}
              />

              {/* Middle cloud glass orb */}
              <div
                className="absolute w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-sky-200/60 via-white to-blue-200/40 backdrop-blur-md border border-white/90 shadow-2xl transition-transform duration-1000 ease-in-out flex flex-col items-center justify-center text-center p-4"
                style={{
                  transform: isActive ? `scale(${currentPhase.scale})` : "scale(1)",
                  boxShadow: isActive
                    ? "0 20px 60px -10px rgba(56, 189, 248, 0.4), 0 0 40px 10px rgba(255, 255, 255, 0.9)"
                    : "0 10px 30px -10px rgba(148, 163, 184, 0.2)",
                }}
              >
                <span className="text-xs uppercase tracking-widest font-black text-sky-600 mb-1">
                  {isActive ? currentPhase.name : "Ready"}
                </span>
                <span className="text-5xl md:text-6xl font-black text-slate-800 font-mono tracking-tighter">
                  {isActive ? secondsRemaining : "—"}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 mt-1">
                  {isActive ? `${currentPhase.duration}s phase` : "Press Start"}
                </span>
              </div>
            </div>

            {/* Phase Guidance Text */}
            <div className="text-center space-y-1.5 max-w-md">
              <h4 className="text-lg font-bold text-slate-800">
                {isActive ? currentPhase.instruction : techniques[technique].description}
              </h4>
              <p className="text-xs text-slate-400">
                Synchronize your breath smoothly with the expanding and releasing cloud.
              </p>
            </div>
          </div>

          {/* Controls & Session Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 items-center">
            {/* Cycles counter */}
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Completed Cycles
              </span>
              <span className="text-lg font-extrabold text-slate-800 font-mono">
                {completedCycles}
              </span>
            </div>

            {/* Play / Pause / Reset button group */}
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={handleToggle}
                size="lg"
                className={`rounded-2xl px-6 py-2.5 font-bold shadow-md transition-all gap-2 text-sm ${
                  isActive
                    ? "bg-slate-800 hover:bg-slate-900 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> Begin Sanctuary
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                className="rounded-2xl border-slate-200 text-slate-500 hover:text-slate-800 w-11 h-11"
                aria-label="Reset session"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Total Duration */}
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Session Time
              </span>
              <span className="text-lg font-extrabold text-slate-800 font-mono">
                {formatTime(totalSeconds)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
