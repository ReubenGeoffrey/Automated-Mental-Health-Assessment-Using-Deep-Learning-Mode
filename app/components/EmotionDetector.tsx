"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import * as faceapi from "face-api.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Camera,
  CameraOff,
  AlertCircle,
  Smile,
  Frown,
  Flame,
  Ghost,
  Skull,
  Sparkles,
  Meh,
  Brain,
  Activity,
  HeartPulse,
  RefreshCw,
} from "lucide-react";

interface EmotionDetectorProps {
  onEmotionDetected?: (emotion: string, confidence: string) => void;
  compact?: boolean;
}

const EmotionDetector: React.FC<EmotionDetectorProps> = ({ onEmotionDetected, compact = false }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<{ name: string; probability: string } | null>(null);
  const [allEmotions, setAllEmotions] = useState<Record<string, number>>({});
  const [debugInfo, setDebugInfo] = useState("Initializing neural networks...");
  const detectionRef = useRef<NodeJS.Timeout | null>(null);
  const isModelsLoaded = useRef(false);

  const [sec, setSec] = useState(0);

  const secToMin = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (isCameraActive) {
        setSec((s) => s + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isCameraActive]);

  const loadModels = async (): Promise<boolean> => {
    try {
      setDebugInfo("Loading face detection & emotion models...");
      await Promise.all([
        faceapi.nets.tinyFaceDetector.load("/models"),
        faceapi.nets.faceLandmark68Net.load("/models"),
        faceapi.nets.faceExpressionNet.load("/models"),
      ]);
      isModelsLoaded.current = true;
      setDebugInfo("Deep learning models loaded");
      return true;
    } catch (err: any) {
      console.error("Model loading error:", err);
      setError("Failed to load local face recognition models.");
      setDebugInfo("Model initialization error");
      return false;
    }
  };

  const startVideo = async (): Promise<boolean> => {
    try {
      setDebugInfo("Requesting webcam access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play();
              resolve();
            };
          }
        });
        setIsCameraActive(true);
        setDebugInfo("Camera feed active");
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Camera access error:", err);
      setError("Camera permission denied or camera not found.");
      setDebugInfo("Webcam not available");
      setIsCameraActive(false);
      return false;
    }
  };

  const stopVideo = () => {
    if (detectionRef.current) {
      clearInterval(detectionRef.current);
      detectionRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setDebugInfo("Camera paused");
  };

  const detectEmotions = useCallback(async () => {
    if (!videoRef.current || !isModelsLoaded.current) return;
    if (videoRef.current.paused || videoRef.current.ended) return;

    try {
      const video = videoRef.current;
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224 }))
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections && detections.length > 0) {
        const expressions = detections[0].expressions;
        const dominantEmotion = Object.entries(expressions).reduce((prev, current) =>
          current[1] > prev[1] ? current : prev
        );

        const currentProb = (dominantEmotion[1] * 100).toFixed(1);
        const emotionData = {
          name: dominantEmotion[0],
          probability: currentProb,
        };

        setEmotion(emotionData);
        setAllEmotions(expressions as unknown as Record<string, number>);
        setDebugInfo("Face detected: " + dominantEmotion[0]);

        if (onEmotionDetected) {
          onEmotionDetected(dominantEmotion[0], currentProb);
        }

        // Render face landmarks to overlay canvas if present
        if (canvasRef.current && video.videoWidth && video.videoHeight) {
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const displaySize = { width: video.videoWidth, height: video.videoHeight };
          faceapi.matchDimensions(canvas, displaySize);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          }
        }
      } else {
        setEmotion(null);
        setDebugInfo("Scanning for face...");
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    } catch (err) {
      console.error("Detection error:", err);
    }
  }, [onEmotionDetected]);

  const startDetection = useCallback(() => {
    if (detectionRef.current) {
      clearInterval(detectionRef.current);
    }
    detectEmotions();
    detectionRef.current = setInterval(detectEmotions, 800);
  }, [detectEmotions]);

  const initSystem = async () => {
    setIsLoading(true);
    setError(null);
    const loaded = await loadModels();
    if (loaded) {
      const cameraOk = await startVideo();
      if (cameraOk) {
        startDetection();
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    initSystem();
    return () => {
      stopVideo();
    };
  }, []);

  const getEmotionIcon = (emotionName: string) => {
    switch (emotionName) {
      case "happy":
        return <Smile className="w-8 h-8 text-emerald-500 animate-pulse" />;
      case "sad":
        return <Frown className="w-8 h-8 text-blue-500 animate-pulse" />;
      case "angry":
        return <Flame className="w-8 h-8 text-rose-500 animate-pulse" />;
      case "fearful":
        return <Ghost className="w-8 h-8 text-amber-500 animate-pulse" />;
      case "disgusted":
        return <Skull className="w-8 h-8 text-orange-500 animate-pulse" />;
      case "surprised":
        return <Sparkles className="w-8 h-8 text-violet-500 animate-pulse" />;
      case "neutral":
      default:
        return <Meh className="w-8 h-8 text-slate-500 animate-pulse" />;
    }
  };

  const getEmotionBadge = (emotionName: string) => {
    switch (emotionName) {
      case "happy":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "sad":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "angry":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "fearful":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "disgusted":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "surprised":
        return "bg-violet-50 text-violet-700 border-violet-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className={compact ? "w-full" : "min-h-screen p-2 md:p-6"}>
      <Card className="max-w-5xl mx-auto cloud-card rounded-3xl border border-white/80 shadow-xl bg-white/95 backdrop-blur-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-sky-50/40 via-white to-blue-50/20 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 text-white shadow-md shadow-blue-500/20">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  Real-Time Deep Emotion Recognition
                </CardTitle>
                <CardDescription className="text-slate-500 text-xs md:text-sm">
                  Powered by CNN & FaceNet feature extraction running natively in-browser
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={isCameraActive ? stopVideo : initSystem}
                className="gap-1.5 text-xs font-medium border-slate-200"
              >
                {isCameraActive ? (
                  <>
                    <CameraOff className="w-3.5 h-3.5 text-rose-500" /> Pause Feed
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-blue-600" /> Start Camera
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Webcam video view */}
            <div className="lg:col-span-7 flex flex-col space-y-3">
              <div className="relative aspect-video w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 pointer-events-none w-full h-full object-cover transform -scale-x-100"
                />

                {/* Status Overlay */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 border border-white/10 text-white text-xs z-10">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isCameraActive ? "bg-emerald-400 animate-ping" : "bg-rose-400"
                    }`}
                  />
                  <span>{isCameraActive ? "LIVE FEED" : "PAUSED"}</span>
                </div>

                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white gap-3 z-20">
                    <Camera className="w-10 h-10 animate-bounce text-blue-400" />
                    <p className="text-sm font-medium text-slate-300">Loading deep learning weights...</p>
                  </div>
                )}
              </div>

              {/* Status and Session metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                    Session
                  </span>
                  <span className="text-base font-bold text-slate-800 font-mono">
                    {secToMin(sec)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                    Status
                  </span>
                  <span className="text-xs font-semibold text-blue-600 truncate block mt-0.5">
                    {debugInfo}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                    Model
                  </span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                    TinyFace+FER
                  </span>
                </div>
              </div>
            </div>

            {/* Real-time Emotion Inference Card */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              {error ? (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription className="text-xs">{error}</AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="p-5 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-blue-500" /> Primary Expression
                      </span>
                      {emotion && (
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getEmotionBadge(
                            emotion.name
                          )}`}
                        >
                          {emotion.probability}% confidence
                        </span>
                      )}
                    </div>

                    {emotion ? (
                      <div className="flex items-center gap-4 pt-1">
                        <div className="p-3 rounded-2xl bg-white shadow-md border border-slate-100">
                          {getEmotionIcon(emotion.name)}
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-slate-900 capitalize tracking-tight">
                            {emotion.name}
                          </h4>
                          <p className="text-xs text-slate-500">
                            Neural network classified emotional state
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2">
                        <HeartPulse className="w-8 h-8 text-slate-300 animate-pulse" />
                        <span>Position your face in front of the camera</span>
                      </div>
                    )}
                  </div>

                  {/* Emotion probability breakdown */}
                  <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-3">
                    <h5 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Emotion Distribution
                    </h5>
                    <div className="space-y-2">
                      {["happy", "neutral", "sad", "surprised", "fearful", "angry"].map((emoKey) => {
                        const val = allEmotions[emoKey] ? Math.round(allEmotions[emoKey] * 100) : 0;
                        return (
                          <div key={emoKey} className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-600 font-medium capitalize">
                              <span>{emoKey}</span>
                              <span className="font-mono text-slate-400">{val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 rounded-full ${
                                  emoKey === "happy"
                                    ? "bg-emerald-500"
                                    : emoKey === "sad"
                                    ? "bg-blue-500"
                                    : emoKey === "angry"
                                    ? "bg-rose-500"
                                    : emoKey === "surprised"
                                    ? "bg-violet-500"
                                    : "bg-slate-400"
                                }`}
                                style={{ width: `${val}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionDetector;