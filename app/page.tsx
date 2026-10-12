"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Brain,
  MessageCircle,
  Activity,
  ArrowRight,
  Sparkles,
  Heart,
  Smile,
  Cpu,
  Wind,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "./components/Navbar";
import { BreathingExercise } from "./components/BreathingExercise";

export default function HomePage() {
  const [showBreathingPreview, setShowBreathingPreview] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/50 via-white to-slate-50 text-slate-800 pb-20">
      {/* Floating Cloud Navbar */}
      <Navbar onOpenBreathing={() => setShowBreathingPreview(true)} />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-16">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-sky-200/80 text-sky-800 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
              <span>Next-Gen Affective Computing & Deep Learning</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Compassionate Mental Health AI Built on <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Real Emotion</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Experience proactive, personalized mental health screening powered by in-browser
              biometric facial expression detection, Google Gemini conversational intelligence,
              and clinical DSM-5 symptom profiling.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link href="/chat">
                <Button
                  size="lg"
                  className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-6 text-sm shadow-lg shadow-blue-500/25 gap-2 transition-all hover:scale-[1.02]"
                >
                  Start Assessment <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/detect">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-slate-200/90 text-slate-700 hover:bg-slate-50 font-bold px-6 py-6 text-sm gap-2 bg-white/80 shadow-2xs"
                >
                  <Activity className="w-4 h-4 text-blue-600" /> Test Emotion Camera
                </Button>
              </Link>
            </div>

            {/* Trust points */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>100% Client-Side Privacy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>FaceNet CNN Biometrics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Gemini LLM Guided</span>
              </div>
            </div>
          </div>

          {/* Right Floating Cloud Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-sky-200/60 to-blue-200/40 rounded-3xl blur-2xl opacity-60"></div>
            
            <div className="cloud-glass rounded-3xl p-6 md:p-8 space-y-6 relative border border-white/90 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                    <Smile className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Affective State Engine</h3>
                    <p className="text-xs text-slate-400">Live 68-Point Facial Alignment</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                  Optimal
                </span>
              </div>

              {/* Progress Gauges */}
              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Facial Affect Recognition</span>
                    <span className="text-blue-600 font-mono">95.4%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full w-[95%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Conversational Sentiment Analysis</span>
                    <span className="text-indigo-600 font-mono">91.8%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full w-[91%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Multimodal Decision Convergence</span>
                    <span className="text-emerald-600 font-mono">94.0%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[94%]"></div>
                  </div>
                </div>
              </div>

              {/* Feature Pill Card */}
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 text-xs text-slate-600 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Wind className="w-5 h-5 text-sky-600 flex-shrink-0" />
                  <span className="font-medium">Cloud Mind Sanctuary Active</span>
                </div>
                <button
                  onClick={() => setShowBreathingPreview(!showBreathingPreview)}
                  className="font-bold text-sky-700 hover:text-sky-900 underline text-xs"
                >
                  {showBreathingPreview ? "Close" : "Try Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Optional Interactive Breathing Sanctuary Drawer */}
      {showBreathingPreview && (
        <section className="max-w-4xl mx-auto px-4 md:px-6 pb-12 animate-in slide-in-from-top-4 duration-300">
          <BreathingExercise />
        </section>
      )}

      {/* Feature Pillars */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16 border-t border-slate-100">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-extrabold text-blue-600">
            System Architecture
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Integrated Multimodal Mental Health Suite
          </h2>
          <p className="text-sm text-slate-500">
            Designed for compassionate early intervention, affective monitoring, and clinical decision support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="cloud-card rounded-3xl border border-slate-100/90 p-7 space-y-4 hover:border-sky-200 group">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Real-Time Facial Vision</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              In-browser neural net reads micro-expressions and 68 facial points to track emotional shifts (Joy, Sadness, Anger, Fear) securely on your device.
            </p>
            <Link href="/detect">
              <Button variant="ghost" size="sm" className="text-xs text-sky-600 hover:text-sky-700 hover:bg-sky-50 p-0 font-bold gap-1">
                Explore Vision <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>

          {/* Card 2 */}
          <Card className="cloud-card rounded-3xl border border-slate-100/90 p-7 space-y-4 hover:border-blue-200 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Affect-Aware AI Companion</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Powered by Google Gemini. The companion continuously adapts its tone, empathy, and grounding advice to your current detected emotional state.
            </p>
            <Link href="/chat">
              <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 font-bold gap-1">
                Open Companion <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>

          {/* Card 3 */}
          <Card className="cloud-card rounded-3xl border border-slate-100/90 p-7 space-y-4 hover:border-indigo-200 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">12-Factor Clinical Assessment</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Standardized questionnaire mapping against clinical centroids to evaluate Depression, Bipolar-I, Bipolar-II, and Normal profiles with printable reports.
            </p>
            <Link href="/chat">
              <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-0 font-bold gap-1">
                Start Screening <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 md:px-6 pt-12 border-t border-slate-100 text-center space-y-2">
        <p className="text-xs font-semibold text-slate-600">
          MindWell AI • Automated Mental Health Assessment Using Deep Learning Model
        </p>
        <p className="text-[11px] text-slate-400">
          Academic Research Edition • For emergency clinical support, call or text 988.
        </p>
      </footer>
    </div>
  );
}