"use server";

import { prisma } from "@/prisma/prisma";
import { startOfDay, endOfDay } from "date-fns";
import { summarizeData, predictDiagnosticLocally } from "./predictor";

export interface MentalHealthInput {
  sadness?: boolean;
  euphoric?: boolean;
  exhausted?: boolean;
  sleep_disorder?: boolean;
  mood_swing?: boolean;
  suicidal_thoughts?: boolean;
  anorexia?: boolean;
  authority_respect?: boolean;
  try_explanation?: boolean;
  aggressive_response?: boolean;
  ignore_and_move_on?: boolean;
  nervous_breakdown?: boolean;
  admit_mistakes?: boolean;
  overthinking?: boolean;
  concentration?: number;
  optimism?: number;
}

export const insertMentalHealth = async (data: MentalHealthInput) => {
  const req = await prisma.mentalHealthAssessment.create({
    data: {
      sadness: Boolean(data.sadness),
      euphoric: Boolean(data.euphoric),
      exhausted: Boolean(data.exhausted),
      sleep_disorder: Boolean(data.sleep_disorder),
      mood_swing: Boolean(data.mood_swing),
      suicidal_thoughts: Boolean(data.suicidal_thoughts),
      anorexia: Boolean(data.anorexia),
      authority_respect: Boolean(data.authority_respect),
      try_explanation: Boolean(data.try_explanation),
      aggressive_response: Boolean(data.aggressive_response),
      ignore_and_move_on: Boolean(data.ignore_and_move_on),
      nervous_breakdown: Boolean(data.nervous_breakdown),
      admit_mistakes: Boolean(data.admit_mistakes),
      overthinking: Boolean(data.overthinking),
      concentration: Number(data.concentration ?? 5),
      optimism: Number(data.optimism ?? 5),
    },
  });

  return req;
};

export const getMentalDatas = async () => {
  const data = await prisma.mentalHealthAssessment.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return data;
};

export const getTodayCompleted = async () => {
  const now = new Date();
  const data = await prisma.mentalHealthAssessment.count({
    where: {
      createdAt: {
        gte: startOfDay(now),
        lte: endOfDay(now),
      },
    },
  });

  return data > 0;
};

export const processData = async () => {
  const d = await getMentalDatas();
  const summarizedData = summarizeData(d);

  const concentration = Math.round(Number(summarizedData.concentration) || 5);
  const optimism = Math.round(Number(summarizedData.optimism) || 5);

  summarizedData.concentration = `${concentration} From 10`;
  summarizedData.optimism = `${optimism} From 10`;

  // First attempt external Flask endpoint if active
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const req = await fetch("http://127.0.0.1:5000/predict", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(summarizedData),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (req.ok) {
      const json = await req.json();
      return {
        ...json,
        source: "flask-model",
      };
    }
  } catch {
    // Flask not running - fallback seamlessly to internal diagnostic classifier
  }

  const localPrediction = predictDiagnosticLocally(summarizedData);
  return {
    prediction: localPrediction.prediction,
    confidence: localPrediction.confidence,
    riskLevel: localPrediction.riskLevel,
    recommendations: localPrediction.recommendations,
    details: localPrediction.scores,
    source: "deep-learning-engine",
  };
};
