"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyD5LnBGm3GuVzX7Q2Ru97rkalFHPljDOxo";
const genAI = new GoogleGenerativeAI(apiKey);

export const generateGeminiResponse = async (
  prompt: string,
  history: any[] = [],
  emotion: string = "Not Detected",
  pred?: any
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const formattedHistory = (history || [])
      .slice(-10)
      .map((m) => `${m.isBot ? "Assistant" : "User"}: ${m.text}`)
      .join("\n");

    const template = `You are MindWell AI, a compassionate, supportive, and certified mental health companion powered by deep learning and affective computing.
Detected Real-Time Facial Emotion: ${emotion || "Neutral"}.
${pred ? `Clinical Assessment Status: ${JSON.stringify(pred)}` : ""}

Recent Chat Context:
${formattedHistory}

Current User Message:
"${prompt}"

Instructions:
1. Respond with warmth, deep empathy, validation, and active listening.
2. If the user's emotion is sad, fearful, or angry, acknowledge and validate their emotional state gently.
3. Suggest evidence-based mindfulness, grounding techniques (e.g. 5-4-3-2-1, Box Breathing), or positive coping strategies when appropriate.
4. Format your response cleanly using Markdown with friendly headings or bullet points if giving advice.
5. Keep responses supportive, conversational, and concise (2-4 paragraphs).
6. Always provide a gentle reminder that you are an AI assistant and not a replacement for emergency healthcare if severe distress is detected.`;

    const result = await model.generateContent(template);
    const responseText = result.response.text();
    return responseText;
  } catch (error: any) {
    console.error("Gemini API error:", error?.message || error);

    // Context-aware fallback response in case of API unavailability or quota limits
    const emotionLower = (emotion || "").toLowerCase();
    if (emotionLower.includes("sad") || emotionLower.includes("depress")) {
      return `I hear how heavy things feel right now, and I want you to know you're not alone. When sadness settles in, taking things one breath at a time is enough. Would you like to try a gentle 2-minute breathing exercise together, or talk about what has been on your mind?`;
    }
    if (emotionLower.includes("fear") || emotionLower.includes("anxi")) {
      return `I can sense tension and anxiety in this moment. Let's ground ourselves together: Take a slow, deep breath in... hold for 3 seconds... and let it all gently out. You are safe in this moment. What is feeling most overwhelming right now?`;
    }
    if (emotionLower.includes("angry")) {
      return `It's completely okay to feel anger and frustration. Those are valid signals that something needs attention. I'm here to listen without judgment whenever you're ready to share.`;
    }

    return `Thank you for sharing that with me. I'm here to support you through whatever you're experiencing today. How have your energy and thoughts been over the past few days?`;
  }
};
