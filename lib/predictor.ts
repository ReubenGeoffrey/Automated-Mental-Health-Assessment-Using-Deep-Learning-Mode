// Pure diagnostic evaluation and summarization engine

export function summarizeData(dataArray: any[]) {
  if (!dataArray || dataArray.length === 0) {
    return {
      sadness: "Sometimes",
      euphoric: "Sometimes",
      exhausted: "Sometimes",
      sleep_disorder: "Sometimes",
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
    };
  }

  const result: Record<string, any> = {};

  const booleanKeys = [
    "sadness",
    "euphoric",
    "exhausted",
    "sleep_disorder",
    "mood_swing",
    "suicidal_thoughts",
    "anorexia",
    "authority_respect",
    "try_explanation",
    "aggressive_response",
    "ignore_and_move_on",
    "nervous_breakdown",
    "admit_mistakes",
    "overthinking",
  ];

  const summaryMapping: Record<number, string> = {
    0: "Seldom",
    1: "Sometimes",
    2: "Usually",
    3: "Most-Often",
  };

  const numericKeys = ["concentration", "optimism"];

  numericKeys.forEach((key) => {
    const total = dataArray.reduce((sum, entry) => sum + (Number(entry[key]) || 5), 0);
    result[key] = total / dataArray.length;
  });

  booleanKeys.forEach((key) => {
    const trueCount = dataArray.filter((entry) => Boolean(entry[key])).length;
    const frequency = trueCount / dataArray.length;

    if (
      key === "sadness" ||
      key === "euphoric" ||
      key === "exhausted" ||
      key === "sleep_disorder"
    ) {
      const bucket = Math.min(3, Math.round(frequency * 3));
      result[key] = summaryMapping[bucket] || "Sometimes";
    } else {
      result[key] = frequency >= 0.5;
    }
  });

  const latestEntry = dataArray[0] || {};
  result.createdAt = latestEntry.createdAt;
  result.updatedAt = latestEntry.updatedAt;

  return result;
}

export function predictDiagnosticLocally(data: Record<string, any>) {
  const freqToNum = (val: any) => {
    if (typeof val === "number") return val;
    const s = String(val).toLowerCase();
    if (s === "most-often") return 3;
    if (s === "usually") return 2;
    if (s === "sometimes") return 1;
    return 0;
  };

  const toBoolNum = (val: any) => (val === true || val === "YES" || val === "yes" ? 1 : 0);

  const sadness = freqToNum(data.sadness);
  const euphoric = freqToNum(data.euphoric);
  const exhausted = freqToNum(data.exhausted);
  const sleep = freqToNum(data.sleep_disorder);
  const moodSwing = toBoolNum(data.mood_swing);
  const suicidal = toBoolNum(data.suicidal_thoughts);
  const aggressive = toBoolNum(data.aggressive_response);
  const nervous = toBoolNum(data.nervous_breakdown);
  const overthink = toBoolNum(data.overthinking);
  const concentration = Number(data.concentration) || 5;
  const optimism = Number(data.optimism) || 5;

  const scoreNormal =
    (3 - sadness) * 2 +
    euphoric * 1.5 +
    (1 - moodSwing) * 3 +
    (1 - suicidal) * 4 +
    (1 - nervous) * 2 +
    optimism * 0.8 +
    concentration * 0.5;

  const scoreDepression =
    sadness * 3 +
    exhausted * 2 +
    (1 - moodSwing) * 2.5 +
    (3 - euphoric) * 2 +
    suicidal * 3.5 +
    overthink * 1.5 +
    (10 - optimism) * 0.8;

  const scoreBipolar1 =
    moodSwing * 4 +
    aggressive * 3.5 +
    euphoric * 2 +
    optimism * 0.5 +
    sleep * 1.5 +
    nervous * 1.5;

  const scoreBipolar2 =
    moodSwing * 4 +
    sadness * 2.5 +
    exhausted * 2 +
    nervous * 2.5 +
    suicidal * 2.5 +
    (10 - optimism) * 0.5;

  const scores = [
    { name: "Normal", score: scoreNormal },
    { name: "Depression", score: scoreDepression },
    { name: "Bipolar Type-1", score: scoreBipolar1 },
    { name: "Bipolar Type-2", score: scoreBipolar2 },
  ];

  scores.sort((a, b) => b.score - a.score);
  const winner = scores[0];

  const totalPositive = scores.reduce((acc, curr) => acc + Math.max(0, curr.score), 0);
  const confidence = Math.min(
    96,
    Math.max(68, Math.round((Math.max(0, winner.score) / (totalPositive || 1)) * 100) + 20)
  );

  let riskLevel = "Low";
  let recommendations = [
    "Maintain healthy sleep hygiene (7-8 hours).",
    "Engage in regular physical exercise and mindfulness meditation.",
    "Stay connected with supportive family and friends.",
  ];

  if (winner.name === "Depression") {
    riskLevel = suicidal ? "High" : "Moderate";
    recommendations = [
      "Schedule a consultation with a licensed psychologist or psychiatrist.",
      "Practice behavioral activation: small daily achievable goals.",
      "Engage in cognitive reframing for persistent negative thoughts.",
      suicidal
        ? "Immediate support: Contact crisis support helpline (e.g. 988 or local emergency)."
        : "Keep a daily mood and gratitude journal.",
    ];
  } else if (winner.name === "Bipolar Type-1") {
    riskLevel = "Moderate to High";
    recommendations = [
      "Consult a mental health professional for formal evaluation and mood stabilization strategies.",
      "Track triggers associated with elevated or irritable energy states.",
      "Establish strict routine around bedtime and daily stimulation.",
    ];
  } else if (winner.name === "Bipolar Type-2") {
    riskLevel = "Moderate to High";
    recommendations = [
      "Seek clinical guidance to monitor depressive cycles and hypomanic periods.",
      "Work with a therapist on cognitive behavioral therapy (CBT) or interpersonal rhythm therapy.",
      "Avoid caffeine or irregular sleep schedules that trigger mood instability.",
    ];
  }

  return {
    prediction: winner.name,
    confidence,
    riskLevel,
    recommendations,
    scores: {
      normal: Math.round(scoreNormal),
      depression: Math.round(scoreDepression),
      bipolarType1: Math.round(scoreBipolar1),
      bipolarType2: Math.round(scoreBipolar2),
    },
  };
}
