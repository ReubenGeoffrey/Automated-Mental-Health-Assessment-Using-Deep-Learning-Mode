"use client";

import React from "react";
import {
  Printer,
  X,
  Brain,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssessmentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: any;
  assessmentData?: any;
}

export const AssessmentReportModal: React.FC<AssessmentReportModalProps> = ({
  isOpen,
  onClose,
  result,
  assessmentData,
}) => {
  if (!isOpen || !result) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Top actions */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Clinical Evaluation Certificate</h3>
              <p className="text-xs text-slate-400">Deep Learning Multimodal Health Assessment</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              variant="outline"
              className="text-xs gap-1.5 border-slate-200 rounded-xl"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close report"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="space-y-6 text-slate-800">
          {/* Diagnostic Result Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-sky-50/80 border border-blue-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                Primary Diagnostic Classification
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {result.prediction}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" /> Evaluated on {currentDate}
              </div>
            </div>

            <div className="text-right sm:self-center">
              <span className="text-xs font-semibold text-slate-500 block">Classifier Match</span>
              <span className="text-2xl font-black text-blue-600 font-mono">
                {result.confidence}%
              </span>
              <span className="text-[10px] block text-slate-400 uppercase tracking-wider">
                Risk: {result.riskLevel}
              </span>
            </div>
          </div>

          {/* Diagnostic Cluster Breakdown */}
          {result.details && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Symptom Cluster Relative Proximity
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Normal</span>
                  <span className="text-base font-bold text-slate-800 font-mono">
                    {result.details.normal} pts
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Depression</span>
                  <span className="text-base font-bold text-slate-800 font-mono">
                    {result.details.depression} pts
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Bipolar I</span>
                  <span className="text-base font-bold text-slate-800 font-mono">
                    {result.details.bipolarType1} pts
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Bipolar II</span>
                  <span className="text-base font-bold text-slate-800 font-mono">
                    {result.details.bipolarType2} pts
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Clinical Action Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Recommended Clinical Interventions
            </h4>
            <div className="space-y-2">
              {(result.recommendations || []).map((rec: string, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3 text-xs leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic & Disclaimer footer */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-600">
              Reference Architecture: IEEE 2024 AffectNet & FER-2013 Multimodal Deep Learning Model
            </p>
            <p>
              This report is generated by an automated computational classifier. It provides clinical decision support and self-monitoring insights, but does not replace formal medical evaluation by a licensed psychiatrist.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <Button onClick={onClose} className="w-full bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-2xl py-2.5">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
