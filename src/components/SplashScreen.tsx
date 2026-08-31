"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Coffee } from "lucide-react";

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Check if splash was already shown in this session (optional, but keep fresh load smooth)
    const startTime = Date.now();
    const duration = 1800; // 1.8 seconds total loading time

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            setIsVisible(false);
          }, 600); // fade out duration
        }, 200);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      dir="rtl"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-gradient-to-b from-[#072426] via-[#0b3335] to-[#041718] text-white select-none transition-all duration-700 ease-out px-6 py-12 ${
        isFading ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 -start-20 w-80 h-80 bg-[#187a7d]/25 rounded-full blur-[90px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/3 -end-20 w-80 h-80 bg-[#f7d6b5]/15 rounded-full blur-[100px] pointer-events-none animate-pulse delay-700"></div>

      {/* Top Placeholder for balance */}
      <div className="w-full flex justify-center items-center pt-4">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Coffee className="w-3.5 h-3.5 text-[#f7d6b5]" />
          <span className="text-[10px] text-[#f7d6b5] font-bold tracking-wider">قهوة مختصة ومخبوزات فاخرة</span>
        </div>
      </div>

      {/* Main Center Content: Logo + Title + Progress */}
      <div className="flex flex-col items-center justify-center text-center my-auto w-full max-w-xs">
        {/* Animated Brand Logo Container */}
        <div className="relative mb-6 group">
          {/* Glowing Aura Ring */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-[#187a7d] via-[#f7d6b5]/50 to-[#187a7d] rounded-[36px] blur-md opacity-60 animate-pulse"></div>
          
          {/* Logo Glass Card */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-white/10 backdrop-blur-2xl rounded-[32px] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/25 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="كافي عامر - Amer Cafe"
              width={120}
              height={120}
              priority
              unoptimized
              className="object-contain w-full h-full drop-shadow-lg"
            />
          </div>
        </div>

        {/* Cafe Name & Since 2012 */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1.5 flex items-center justify-center gap-2">
          <span>كافي عامر</span>
          <span className="text-[10px] sm:text-xs font-bold bg-[#f7d6b5] text-[#0b3335] px-2 py-0.5 rounded-lg shadow-sm">
            Amer Cafe
          </span>
        </h1>
        <p className="text-[#a8d3d5] text-xs font-medium mb-8 flex items-center gap-1.5">
          <span>طبرق ، مفترق رابعة</span>
          <span className="text-[#f7d6b5]">•</span>
          <span>Since 2012</span>
        </p>

        {/* Loading Progress Bar Container */}
        <div className="w-full space-y-2">
          {/* Progress Bar Track */}
          <div className="w-full h-2 bg-white/10 backdrop-blur-md rounded-full overflow-hidden p-0.5 border border-white/15 relative">
            <div
              className="h-full bg-gradient-to-r from-[#187a7d] via-[#f7d6b5] to-[#edd0b0] rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_rgba(247,214,181,0.6)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Progress Percentage Counter */}
          <div className="flex items-center justify-between text-[11px] text-[#a8d3d5] font-bold px-1">
            <span className="text-white/60 text-[10px] font-medium">جاري تجهيز المنيو...</span>
            <span className="font-mono text-[#f7d6b5]">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Credit to Huwiyya Marketing */}
      <div className="w-full flex flex-col items-center justify-center text-center pb-2">
        <div className="flex items-center gap-1.5 text-xs text-[#a8d3d5]/90 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#f7d6b5] animate-pulse" />
          <span>برمجة وتطوير</span>
          <span className="font-bold text-[#f7d6b5] underline underline-offset-4 decoration-[#f7d6b5]/40">
            شركة هوية للتسويق الرقمي
          </span>
        </div>
      </div>
    </div>
  );
}
