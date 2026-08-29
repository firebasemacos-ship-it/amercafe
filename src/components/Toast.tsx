"use client";

import { useApp } from "@/context/AppContext";
import { CheckCircle2 } from "lucide-react";

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] max-w-[90%] pointer-events-none animate-bounce">
      <div className="bg-[#111] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-white/10 text-sm font-medium">
        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
        <span>{toast}</span>
      </div>
    </div>
  );
}
