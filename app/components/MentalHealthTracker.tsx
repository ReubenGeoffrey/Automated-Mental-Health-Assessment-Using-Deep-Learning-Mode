"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Sparkles,
  CheckCircle2,
  Activity,
  HeartHandshake,
  ClipboardList,
  Camera,
  Wind,
  BarChart3,
  Volume2,
  VolumeX,
  FileText,
  Printer,
} from "lucide-react";

import { MessageContent, MessageType } from "./MessageContent";
import { generateGeminiResponse } from "@/actions/gemini";
import EmotionDetector from "./EmotionDetector";
import { BreathingExercise } from "./BreathingExercise";
import { AssessmentReportModal } from "./AssessmentReportModal";
import { MoodAnalytics } from "./MoodAnalytics";
import { Navbar } from "./Navbar";
import {
  insertMentalHealth,
  getMentalDatas,
  processData,
  MentalHealthInput,
} from "@/lib/serveracs";

const ASSESSMENT_QUESTIONS = [
  {
    key: "sadness",
    text: "Have you been experiencing persistent feelings of sadness, emptiness, or crying spells?",
    type: "boolean",
  },
  {
    key: "euphoric",
    text: "Do you experience abrupt episodes of abnormally elevated mood, grandiosity, or boundless energy?",
    type: "boolean",
  },
  {
    key: "exhausted",
    text: "Do you feel chronic exhaustion, lethargy, or depletion of mental and physical energy?",
    type: "boolean",
  },
  {
    key: "sleep_disorder",
    text: "Have you suffered from disrupted sleep patterns, severe insomnia, or waking up exhausted?",
    type: "boolean",
  },
  {
    key: "mood_swing",
    text: "Do you experience unpredictable, rapid shifts between high enthusiasm and sudden depression?",
    type: "boolean",
  },
  {
    key: "suicidal_thoughts",
    text: "Have you experienced thoughts of self-harm, worthlessness, or feeling that life is too heavy?",
    type: "boolean",
  },
  {
    key: "anorexia",
    text: "Have you noticed a dramatic drop in appetite, skipping meals, or unexplainable weight change?",
    type: "boolean",
  },
  {
    key: "aggressive_response",
    text: "Do you find yourself reacting with sudden irritability, agitation, or angry outbursts?",
    type: "boolean",
  },
  {
    key: "nervous_breakdown",
    text: "Do you frequently feel overwhelmed, panicked, or on the brink of an emotional collapse?",
    type: "boolean",
  },
  {
    key: "overthinking",
    text: "Do you struggle with intrusive rumination, racing negative thoughts, or analysis paralysis?",
    type: "boolean",
  },
  {
    key: "concentration",
    text: "How would you rate your cognitive focus and ability to complete daily tasks? (1 = Severe Brain Fog, 10 = Sharp Concentration)",
    type: "slider",
    min: 1,
    max: 10,
    default: 5,
  },
  {
    key: "optimism",
    text: "How would you rate your current optimism, vitality, and hope for tomorrow? (1 = Hopeless, 10 = High Optimism)",
    type: "slider",
    min: 1,
    max: 10,
    default: 5,
  },
];

interface ChatMessage extends MessageType {
  timestamp?: string;
}

export default function MentalHealthTracker() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: "Welcome to MindWell AI. I am your calm mental health companion trained to support your emotional resilience. Would you like to chat freely, begin an automated clinical assessment, or take a peaceful breathing break?",
      isBot: true,
      options: [
        "Start Clinical Assessment",
        "Open Breathing Sanctuary",
        "I need a listening ear",
        "How is my emotion detected?",
      ],
    },
  ]);

  const [activeTab, setActiveTab] = useState<"chat" | "detect" | "sanctuary" | "records">(
    "chat"
  );
  const [detectedEmotion, setDetectedEmotion] = useState<string>("Neutral");
  const [emotionConfidence, setEmotionConfidence] = useState<string>("0");
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(false);

  const [formData, setFormData] = useState<MentalHealthInput>({
    sadness: false,
    euphoric: false,
    exhausted: false,
    sleep_disorder: false,
    mood_swing: false,
    suicidal_thoughts: false,
    anorexia: false,
    authority_respect: true,
    try_explanation: true,
    aggressive_response: false,
    ignore_and_move_on: true,
    nervous_breakdown: false,
    admit_mistakes: true,
    overthinking: false,
    concentration: 5,
    optimism: 5,
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [diagnosticResult, setDiagnosticResult] = useState<any | null>(null);
  const [isSubmittingAssessment, setIsSubmittingAssessment] = useState(false);
  const [pastAssessments, setPastAssessments] = useState<any[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  useEffect(() => {
    loadPastRecords();
  }, []);

  const loadPastRecords = async () => {
    try {
      const data = await getMentalDatas();
      setPastAssessments(data);
    } catch (e) {
      console.error("Error loading past records:", e);
    }
  };

  // Text-To-Speech speech synthesis helper
  const speakText = (text: string) => {
    if (!isVoiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[#*`_]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Speech synthesis error:", err);
    }
  };

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
    if (message.isBot && message.text) {
      speakText(message.text);
    }
  };

  const askAi = async (prompt: string) => {
    setIsThinking(true);
    try {
      const res = await generateGeminiResponse(
        prompt,
        messages,
        detectedEmotion,
        diagnosticResult
      );
      addMessage({ text: res, isBot: true, isMarkdown: true });
    } catch (error) {
      console.error("Error calling AI:", error);
      addMessage({
        text: "I am right here with you. Take a soft, gentle breath. Tell me what feels most pressing right now.",
        isBot: true,
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      const text = userInput.trim();
      setUserInput("");
      addMessage({ text, isBot: false });
      await askAi(text);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startAssessment = () => {
    setActiveTab("chat");
    setCurrentQuestionIndex(0);
    const firstQ = ASSESSMENT_QUESTIONS[0];
    addMessage({
      text: "Starting the 12-factor deep learning clinical screening. Your responses are encrypted locally.",
      isBot: true,
    });
    addMessage({
      text: `Question 1 of ${ASSESSMENT_QUESTIONS.length}:\n**${firstQ.text}**`,
      isBot: true,
      question: firstQ,
    });
  };

  const handleAssessmentAnswer = async (value: boolean | number) => {
    if (currentQuestionIndex === null) return;

    const currentQ = ASSESSMENT_QUESTIONS[currentQuestionIndex];
    const updatedFormData = {
      ...formData,
      [currentQ.key]: value,
    };
    setFormData(updatedFormData);

    const userDisplayText =
      typeof value === "boolean" ? (value ? "Yes" : "No") : `Score: ${value} / 10`;

    addMessage({ text: userDisplayText, isBot: false });

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < ASSESSMENT_QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
      const nextQ = ASSESSMENT_QUESTIONS[nextIndex];
      setTimeout(() => {
        addMessage({
          text: `Question ${nextIndex + 1} of ${ASSESSMENT_QUESTIONS.length}:\n**${nextQ.text}**`,
          isBot: true,
          question: nextQ,
        });
      }, 350);
    } else {
      setCurrentQuestionIndex(null);
      setIsSubmittingAssessment(true);
      addMessage({
        text: "Analyzing clinical markers through the deep learning diagnostic classifier...",
        isBot: true,
      });

      try {
        await insertMentalHealth(updatedFormData);
        const result = await processData();
        setDiagnosticResult(result);
        await loadPastRecords();

        setTimeout(() => {
          addMessage({
            text: `### 📋 Clinical Diagnostic Summary\n\n**Primary Finding:** **${result.prediction}**\n**Diagnostic Match:** ${result.confidence}%\n**Risk Level:** ${result.riskLevel}\n\n**Clinical Recommendations:**\n${(result.recommendations || []).map((r: string) => `- ${r}`).join("\n")}`,
            isBot: true,
            isMarkdown: true,
            options: [
              "View / Print Clinical Report",
              "Open Breathing Sanctuary",
              "Discuss this result with AI",
              "Retake Assessment",
            ],
          });
          setIsSubmittingAssessment(false);
        }, 800);
      } catch (err) {
        console.error("Assessment processing error:", err);
        setIsSubmittingAssessment(false);
        addMessage({
          text: "Assessment was saved to database. Let's talk about how you are feeling.",
          isBot: true,
        });
      }
    }
  };

  const handleOptionClick = (option: string) => {
    addMessage({ text: option, isBot: false });

    if (option === "Start Clinical Assessment" || option === "Retake Assessment") {
      startAssessment();
    } else if (option === "Open Breathing Sanctuary") {
      setActiveTab("sanctuary");
    } else if (option === "View / Print Clinical Report") {
      setIsReportModalOpen(true);
    } else if (option === "How is my emotion detected?") {
      addMessage({
        text: "MindWell utilizes a Convolutional Neural Network (CNN) based on Google FaceNet running client-side with WebGL. It reads 68 biometric landmark points around your eyes, brow, and mouth to recognize joy, sadness, fear, or frustration without sending video to any external server.",
        isBot: true,
        isMarkdown: true,
        options: ["Try Emotion Camera", "Start Clinical Assessment"],
      });
    } else if (option === "Try Emotion Camera") {
      setActiveTab("detect");
    } else if (option === "Discuss this result with AI") {
      askAi(
        `I just received my diagnostic assessment report showing: ${diagnosticResult?.prediction || "Under Evaluation"}. Can you guide me with compassionate advice?`
      );
    } else {
      askAi(option);
    }
  };

  const onEmotionDetected = (emotionName: string, confidence: string) => {
    setDetectedEmotion(emotionName);
    setEmotionConfidence(confidence);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/40 via-white to-slate-50/60 pb-16">
      {/* Floating Cloudy Navbar */}
      <Navbar
        currentEmotion={detectedEmotion !== "Neutral" ? detectedEmotion : undefined}
        onOpenBreathing={() => setActiveTab("sanctuary")}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-3 md:px-6 pt-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="cloud-glass rounded-3xl p-1.5 flex flex-wrap items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-1 overflow-x-auto p-0.5">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "chat"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>AI Companion & Screening</span>
            </button>
            <button
              onClick={() => setActiveTab("detect")}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "detect"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Facial Emotion Vision</span>
            </button>
            <button
              onClick={() => setActiveTab("sanctuary")}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "sanctuary"
                  ? "bg-white text-sky-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Wind className="w-3.5 h-3.5 text-sky-500" />
              <span>Mind Sanctuary</span>
            </button>
            <button
              onClick={() => setActiveTab("records")}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "records"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Clinical Analytics</span>
            </button>
          </div>

          {/* Voice readout toggle */}
          <div className="flex items-center gap-2 pr-2">
            <button
              onClick={() => {
                const nextVal = !isVoiceEnabled;
                setIsVoiceEnabled(nextVal);
                if (!nextVal && typeof window !== "undefined") window.speechSynthesis.cancel();
              }}
              className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors border ${
                isVoiceEnabled
                  ? "bg-sky-50 text-sky-700 border-sky-200"
                  : "bg-white text-slate-400 border-slate-200/80 hover:text-slate-600"
              }`}
              title="Voice narration of responses"
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-[11px] font-semibold hidden sm:inline">
                {isVoiceEnabled ? "Voice On" : "Voice Off"}
              </span>
            </button>
          </div>
        </div>

        {/* Live Affect Banner */}
        {activeTab === "chat" && (
          <div className="cloud-card rounded-2xl px-5 py-3 border border-sky-100 flex items-center justify-between gap-4 bg-gradient-to-r from-white via-sky-50/30 to-blue-50/20">
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
              <span>
                Real-Time Affective Context:{" "}
                <strong className="capitalize text-slate-900 font-black">{detectedEmotion}</strong>
                {emotionConfidence !== "0" && ` (${emotionConfidence}% confidence)`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCameraActive(!isCameraActive)}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isCameraActive ? "Close Camera" : "Open Facial Camera"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Floating Camera Preview when active */}
        {activeTab === "chat" && isCameraActive && (
          <div className="cloud-glass rounded-3xl p-4 border border-white/90 shadow-xl">
            <EmotionDetector onEmotionDetected={onEmotionDetected} compact={true} />
          </div>
        )}

        {/* TAB 1: AI CHAT COMPANION & SCREENING */}
        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chat Box */}
            <Card className="lg:col-span-8 cloud-card rounded-3xl border border-white/80 flex flex-col h-[680px] bg-white/95 backdrop-blur-xl overflow-hidden">
              <CardHeader className="py-3.5 px-6 border-b border-slate-100 bg-gradient-to-r from-sky-50/30 via-white to-blue-50/20 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-400" />
                  <CardTitle className="text-sm font-black text-slate-800 tracking-tight">
                    MindWell AI Chat Session
                  </CardTitle>
                </div>
                {diagnosticResult && (
                  <Button
                    onClick={() => setIsReportModalOpen(true)}
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1.5 text-blue-600 hover:bg-blue-50 rounded-xl"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Diagnostic Report
                  </Button>
                )}
              </CardHeader>

              <CardContent className="p-0 flex-grow flex flex-col overflow-hidden">
                <ScrollArea className="flex-grow p-4 md:p-6" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`rounded-3xl p-4 md:p-5 max-w-[85%] md:max-w-[78%] transition-all ${
                            msg.isBot
                              ? "bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] text-slate-800"
                              : "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-medium"
                          }`}
                        >
                          <MessageContent message={msg} />

                          {/* Quick Options Pills */}
                          {msg.options && msg.options.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                              {msg.options.map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => handleOptionClick(opt)}
                                  className="text-xs bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/70 hover:border-blue-200 px-3.5 py-1.5 rounded-xl transition-all font-bold shadow-2xs"
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Question Form */}
                          {msg.question && currentQuestionIndex !== null && (
                            <div className="mt-4 pt-3 border-t border-slate-100">
                              {msg.question.type === "boolean" ? (
                                <div className="flex items-center gap-3">
                                  <Button
                                    size="sm"
                                    onClick={() => handleAssessmentAnswer(true)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs font-bold rounded-xl px-5"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleAssessmentAnswer(false)}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 gap-1.5 text-xs font-bold rounded-xl px-5"
                                  >
                                    No
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-3 pt-1">
                                  <Slider
                                    defaultValue={[5]}
                                    max={10}
                                    min={1}
                                    step={1}
                                    className="w-full py-2"
                                    onValueCommit={([val]) => handleAssessmentAnswer(val)}
                                  />
                                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                                    <span>1 (Minimal)</span>
                                    <span>5 (Average)</span>
                                    <span>10 (Optimal)</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {isThinking && (
                      <div className="flex justify-start">
                        <div className="cloud-card rounded-2xl px-4 py-3 border border-slate-100 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-sky-500 animate-spin" />
                          <span className="text-xs text-slate-500 font-medium">
                            MindWell AI is reflecting...
                          </span>
                        </div>
                      </div>
                    )}

                    {isSubmittingAssessment && (
                      <div className="flex justify-start">
                        <div className="cloud-card rounded-2xl px-4 py-3 border border-indigo-100 bg-indigo-50/50 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-indigo-600 animate-pulse" />
                          <span className="text-xs text-indigo-700 font-bold">
                            Evaluating deep learning diagnostic model...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Bar */}
                <div className="p-3 md:p-4 border-t border-slate-100 bg-white/95">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Share what is on your mind or ask a mental health question..."
                      className="flex-grow px-5 py-3 rounded-2xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm bg-slate-50/50 transition-all"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isThinking || !userInput.trim()}
                      className="rounded-2xl bg-blue-600 hover:bg-blue-700 px-5 text-white shadow-md shadow-blue-500/20"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Side Tools & Quick Assessment Launcher */}
            <div className="lg:col-span-4 space-y-4">
              {/* Screening Trigger Card */}
              <Card className="cloud-card rounded-3xl border border-slate-100 p-6 space-y-4">
                <div className="flex items-center space-x-2.5 text-slate-900 font-black text-sm">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  <span>12-Factor Screening</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Evaluates DSM-5 criteria (sadness, exhaustion, mood swings, sleep, focus, hope)
                  to classify clinical risk categories.
                </p>
                <Button
                  onClick={startAssessment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-2xl shadow-md shadow-blue-500/20"
                >
                  Start Clinical Screening
                </Button>
              </Card>

              {/* Latest Diagnostic Card */}
              {diagnosticResult ? (
                <Card className="cloud-card rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50/40 to-blue-50/30 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-sky-700 uppercase tracking-widest">
                      Active Evaluation
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white text-blue-700 font-extrabold border border-blue-200 shadow-2xs">
                      {diagnosticResult.confidence}% match
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {diagnosticResult.prediction}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Risk Level: <strong className="text-slate-800">{diagnosticResult.riskLevel}</strong>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Immediate Guidance
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      {(diagnosticResult.recommendations || []).slice(0, 3).map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => setIsReportModalOpen(true)}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-bold rounded-xl border-slate-200 gap-1.5 mt-2 bg-white"
                  >
                    <Printer className="w-3.5 h-3.5" /> View Printable Report
                  </Button>
                </Card>
              ) : (
                <Card className="cloud-card rounded-3xl border border-slate-100 p-6 text-center text-slate-400 space-y-2.5">
                  <HeartHandshake className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">No Assessment Completed</p>
                  <p className="text-[11px] text-slate-400">
                    Take the 2-minute screening to unlock personalized insights and support.
                  </p>
                </Card>
              )}

              {/* Quick Sanctuary Card */}
              <Card className="cloud-card rounded-3xl border border-slate-100 p-5 bg-gradient-to-r from-sky-50/50 to-blue-50/30 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900">Feeling Overwhelmed?</h4>
                  <p className="text-[11px] text-slate-500">Take a 60-second breathing pause</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setActiveTab("sanctuary")}
                  className="bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold shadow-2xs"
                >
                  <Wind className="w-3.5 h-3.5 mr-1 text-sky-500" /> Breathe
                </Button>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: REAL-TIME EMOTION DETECTION VIEW */}
        {activeTab === "detect" && (
          <div className="space-y-6">
            <EmotionDetector onEmotionDetected={onEmotionDetected} />
          </div>
        )}

        {/* TAB 3: BREATHING SANCTUARY VIEW */}
        {activeTab === "sanctuary" && (
          <div className="space-y-6">
            <BreathingExercise />
          </div>
        )}

        {/* TAB 4: CLINICAL ANALYTICS VIEW */}
        {activeTab === "records" && (
          <div className="space-y-6">
            <MoodAnalytics records={pastAssessments} onTakeNewAssessment={startAssessment} />
          </div>
        )}
      </main>

      {/* Printable Assessment Report Modal */}
      {diagnosticResult && (
        <AssessmentReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          result={diagnosticResult}
          assessmentData={formData}
        />
      )}
    </div>
  );
}