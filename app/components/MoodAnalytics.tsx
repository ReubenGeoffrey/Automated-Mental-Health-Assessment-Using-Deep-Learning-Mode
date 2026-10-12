"use client";

import React from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Activity,
  CheckCircle2,
} from "lucide-react";

interface MoodAnalyticsProps {
  records: any[];
  onTakeNewAssessment: () => void;
}

export const MoodAnalytics: React.FC<MoodAnalyticsProps> = ({
  records,
  onTakeNewAssessment,
}) => {
  const totalRecords = records.length;

  const sadnessCount = records.filter((r) => r.sadness).length;
  const moodSwingCount = records.filter((r) => r.mood_swing).length;
  const sleepCount = records.filter((r) => r.sleep_disorder).length;
  const exhaustedCount = records.filter((r) => r.exhausted).length;

  const avgConcentration =
    totalRecords > 0
      ? (records.reduce((sum, r) => sum + (Number(r.concentration) || 5), 0) / totalRecords).toFixed(1)
      : "5.0";

  const avgOptimism =
    totalRecords > 0
      ? (records.reduce((sum, r) => sum + (Number(r.optimism) || 5), 0) / totalRecords).toFixed(1)
      : "5.0";

  const exportCSV = () => {
    if (records.length === 0) return;
    const headers = [
      "ID",
      "Date",
      "Sadness",
      "Euphoric",
      "Exhausted",
      "Sleep_Disorder",
      "Mood_Swing",
      "Suicidal_Thoughts",
      "Concentration",
      "Optimism",
    ];
    const rows = records.map((r) => [
      r.id,
      r.createdAt,
      r.sadness,
      r.euphoric,
      r.exhausted,
      r.sleep_disorder,
      r.mood_swing,
      r.suicidal_thoughts,
      r.concentration,
      r.optimism,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mindwell_mental_health_records_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="cloud-card rounded-2xl p-5 border border-slate-100 bg-white/90 backdrop-blur-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Evaluations
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-slate-900 font-mono">{totalRecords}</span>
            <span className="text-xs text-blue-600 font-semibold">completed</span>
          </div>
        </div>

        <div className="cloud-card rounded-2xl p-5 border border-slate-100 bg-white/90 backdrop-blur-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Avg. Focus Level
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-slate-900 font-mono">{avgConcentration}</span>
            <span className="text-xs text-slate-500 font-medium">/ 10</span>
          </div>
        </div>

        <div className="cloud-card rounded-2xl p-5 border border-slate-100 bg-white/90 backdrop-blur-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Avg. Hope Index
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-emerald-600 font-mono">{avgOptimism}</span>
            <span className="text-xs text-slate-500 font-medium">/ 10</span>
          </div>
        </div>

        <div className="cloud-card rounded-2xl p-5 border border-slate-100 bg-white/90 backdrop-blur-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Stability Baseline
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-indigo-600 font-mono">
              {totalRecords > 0 ? Math.max(0, 100 - moodSwingCount * 25) : 85}%
            </span>
            <span className="text-xs text-slate-500 font-medium">resilience</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Container */}
      <Card className="cloud-card rounded-3xl border border-slate-100 bg-white/95 backdrop-blur-xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">
              Symptom Frequency & Affect Distribution
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Longitudinal pattern recognition across recorded screening checkpoints
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={exportCSV}
              disabled={records.length === 0}
              variant="outline"
              size="sm"
              className="text-xs gap-1.5 rounded-xl border-slate-200"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
            <Button
              onClick={onTakeNewAssessment}
              size="sm"
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs"
            >
              New Screening
            </Button>
          </div>
        </div>

        {totalRecords > 0 ? (
          <div className="space-y-6">
            {/* Visual Frequency Meters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50/70 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Affect Disruption Metrics
                </h4>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Persistent Sadness Rate</span>
                      <span className="font-mono text-slate-500">
                        {Math.round((sadnessCount / totalRecords) * 100)}% ({sadnessCount}/{totalRecords})
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${(sadnessCount / totalRecords) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Mood Swing Vulnerability</span>
                      <span className="font-mono text-slate-500">
                        {Math.round((moodSwingCount / totalRecords) * 100)}% ({moodSwingCount}/{totalRecords})
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${(moodSwingCount / totalRecords) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Sleep Architecture Disruption</span>
                      <span className="font-mono text-slate-500">
                        {Math.round((sleepCount / totalRecords) * 100)}% ({sleepCount}/{totalRecords})
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${(sleepCount / totalRecords) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Physical/Cognitive Exhaustion</span>
                      <span className="font-mono text-slate-500">
                        {Math.round((exhaustedCount / totalRecords) * 100)}% ({exhaustedCount}/{totalRecords})
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${(exhaustedCount / totalRecords) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cognitive Scores Balance */}
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col justify-between space-y-4">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Cognitive & Emotional Equilibrium
                </h4>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Focus Index
                    </span>
                    <span className="text-3xl font-black text-blue-600 font-mono mt-1 block">
                      {avgConcentration}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">Mental Focus</span>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Optimism Index
                    </span>
                    <span className="text-3xl font-black text-emerald-600 font-mono mt-1 block">
                      {avgOptimism}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 block">Future Hope</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-100 text-xs text-slate-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>
                    Higher optimism correlates clinically with positive therapy response and reduced depression recurrence.
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <Activity className="w-10 h-10 mx-auto text-slate-300" />
            <h4 className="text-sm font-bold text-slate-700">No Assessment Data Yet</h4>
            <p className="text-xs max-w-sm mx-auto text-slate-400">
              Complete your first clinical assessment to start generating longitudinal psychological analytics.
            </p>
            <Button onClick={onTakeNewAssessment} size="sm" className="rounded-xl text-xs bg-blue-600 text-white">
              Take Initial Assessment
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
