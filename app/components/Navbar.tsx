"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brain,
  MessageCircle,
  Activity,
  Wind,
  PhoneCall,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrisisModal } from "./CrisisModal";

interface NavbarProps {
  currentEmotion?: string;
  onOpenBreathing?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentEmotion,
  onOpenBreathing,
}) => {
  const pathname = usePathname();
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Overview", href: "/", icon: Brain },
    { name: "AI Companion", href: "/chat", icon: MessageCircle },
    { name: "Emotion Vision", href: "/detect", icon: Activity },
  ];

  return (
    <>
      <header className="sticky top-3 z-40 px-3 md:px-6 max-w-6xl mx-auto w-full transition-all">
        <div className="cloud-glass rounded-3xl px-4 md:px-6 py-2.5 flex items-center justify-between shadow-lg">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm md:text-base font-black text-slate-900 tracking-tight block leading-none">
                MindWell
              </span>
              <span className="text-[9px] text-sky-600 font-bold uppercase tracking-widest block mt-0.5">
                Affective AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100/70 rounded-2xl border border-slate-200/50">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Live affect pill if available */}
            {currentEmotion && (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                <span className="capitalize">{currentEmotion}</span>
              </div>
            )}

            {/* Quick Sanctuary button if handler provided */}
            {onOpenBreathing && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenBreathing}
                className="hidden sm:flex text-xs gap-1.5 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Wind className="w-3.5 h-3.5 text-sky-500" /> Sanctuary
              </Button>
            )}

            {/* Crisis Hotline Button */}
            <Button
              size="sm"
              onClick={() => setIsCrisisOpen(true)}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold gap-1.5 shadow-2xs transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-rose-600" />
              <span>988 Help</span>
            </Button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 p-3 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-100 shadow-xl space-y-2 animate-in slide-in-from-top-2 duration-150">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            {onOpenBreathing && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenBreathing();
                }}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-sky-700 hover:bg-sky-50"
              >
                <Wind className="w-4 h-4 text-sky-500" />
                <span>Cloud Mind Sanctuary</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* 24/7 Crisis Support Modal */}
      <CrisisModal isOpen={isCrisisOpen} onClose={() => setIsCrisisOpen(false)} />
    </>
  );
};
