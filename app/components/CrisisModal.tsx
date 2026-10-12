"use client";

import React from "react";
import {
  PhoneCall,
  HeartHandshake,
  ShieldAlert,
  X,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/80 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close crisis support"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Immediate Care & Crisis Support
            </h3>
            <p className="text-xs text-slate-500">
              Free, confidential help is available 24/7. You are not alone.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Lifeline 988 */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50/70 via-white to-pink-50/50 border border-rose-100 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
                Suicide & Crisis Lifeline
              </span>
              <p className="text-sm font-black text-slate-900">Call or Text 988</p>
              <p className="text-xs text-slate-500">24/7 free support for emotional distress</p>
            </div>
            <a href="tel:988">
              <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs gap-1.5 shadow-sm">
                <PhoneCall className="w-3.5 h-3.5" /> Call 988
              </Button>
            </a>
          </div>

          {/* Crisis Text Line */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-white to-sky-50/50 border border-blue-100 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                Crisis Text Line
              </span>
              <p className="text-sm font-black text-slate-900">Text HOME to 741741</p>
              <p className="text-xs text-slate-500">Connect with a trained crisis counselor</p>
            </div>
            <a href="sms:741741?body=HOME">
              <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl text-xs gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Text HOME
              </Button>
            </a>
          </div>

          {/* The Trevor Project */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                The Trevor Project (LGBTQ+ Youth)
              </span>
              <p className="text-xs text-slate-600">Call 1-866-488-7386 or text START to 678-678</p>
            </div>
            <a href="tel:18664887386">
              <Button size="sm" variant="ghost" className="text-xs text-slate-700 hover:bg-slate-200 rounded-xl">
                Call
              </Button>
            </a>
          </div>
        </div>

        {/* Rapid Grounding Exercise */}
        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-bold text-sky-800">
            <HeartHandshake className="w-4 h-4 text-sky-600" />
            <span>Emergency 5-4-3-2-1 Grounding Rule</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Acknowledge <strong>5</strong> things you can see, <strong>4</strong> you can touch, <strong>3</strong> you can hear, <strong>2</strong> you can smell, and <strong>1</strong> positive thing you can taste.
          </p>
        </div>

        <div className="text-center">
          <Button onClick={onClose} variant="outline" className="w-full rounded-2xl text-xs border-slate-200 text-slate-600">
            I Understand & Close
          </Button>
        </div>
      </div>
    </div>
  );
};
