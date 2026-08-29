"use client";

import { Home, Search, ShoppingBag, FileText, Store } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useApp();

  const getActiveTab = () => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/search")) return "search";
    if (pathname.startsWith("/cart")) return "cart";
    if (pathname.startsWith("/orders")) return "orders";
    if (pathname.startsWith("/about") || pathname.startsWith("/profile")) return "about";
    return "";
  };

  const activeTab = getActiveTab();

  return (
    <div className="fixed bottom-3 sm:bottom-4 inset-x-0 mx-auto px-4 z-50 pointer-events-none transition-all duration-300 pb-[env(safe-area-inset-bottom,0px)] flex justify-center">
      <nav className="pointer-events-auto glass-dock rounded-full px-2.5 py-1.5 flex items-center justify-center gap-1 sm:gap-1.5 shadow-[0_20px_50px_rgba(11,51,53,0.5)] border border-white/25 w-auto max-w-[340px] sm:max-w-[360px]">
        {/* 1. Home Tab */}
        <button
          onClick={() => router.push("/")}
          className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-300 w-12 sm:w-13 h-10 sm:h-11 rounded-2xl relative active:scale-90 ${
            activeTab === "home"
              ? "text-[#f7d6b5] bg-white/15 shadow-inner ring-1 ring-white/20"
              : "text-[#a8d3d5] hover:text-white"
          }`}
        >
          <Home
            className={`w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform duration-300 ${
              activeTab === "home" ? "scale-110 drop-shadow-[0_2px_10px_rgba(247,214,181,0.6)]" : ""
            }`}
          />
          <span
            className={`text-[8.5px] sm:text-[9px] tracking-tight transition-all duration-300 ${
              activeTab === "home" ? "font-black opacity-100" : "font-bold opacity-75"
            }`}
          >
            الرئيسية
          </span>
        </button>

        {/* 2. Search Tab */}
        <button
          onClick={() => router.push("/search")}
          className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-300 w-12 sm:w-13 h-10 sm:h-11 rounded-2xl relative active:scale-90 ${
            activeTab === "search"
              ? "text-[#f7d6b5] bg-white/15 shadow-inner ring-1 ring-white/20"
              : "text-[#a8d3d5] hover:text-white"
          }`}
        >
          <Search
            className={`w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform duration-300 ${
              activeTab === "search" ? "scale-110 drop-shadow-[0_2px_10px_rgba(247,214,181,0.6)]" : ""
            }`}
          />
          <span
            className={`text-[8.5px] sm:text-[9px] tracking-tight transition-all duration-300 ${
              activeTab === "search" ? "font-black opacity-100" : "font-bold opacity-75"
            }`}
          >
            البحث
          </span>
        </button>

        {/* 3. Center Floating Cart Button */}
        <div className="relative -top-4 flex justify-center px-1">
          <button
            onClick={() => router.push("/cart")}
            className={`w-11.5 h-11.5 sm:w-12.5 sm:h-12.5 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 relative ${
              activeTab === "cart"
                ? "bg-gradient-to-tr from-[#187a7d] to-[#0e4c4e] text-[#f7d6b5] ring-3 sm:ring-4 ring-[#f7d6b5]/50 shadow-[0_10px_25px_rgba(24,122,125,0.7)] scale-105"
                : "bg-gradient-to-tr from-[#f7d6b5] via-[#edd0b0] to-[#e4be93] text-[#0b3335] hover:scale-110 shadow-[0_12px_28px_rgba(247,214,181,0.5)] border-2 border-white/80"
            }`}
            title="سلة المشتريات"
          >
            <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -end-1 bg-[#187a7d] text-[#f7d6b5] text-[9px] sm:text-[10px] font-black w-4.5 h-4.5 sm:w-5 sm:h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse shadow-md">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>

        {/* 4. Orders Tab */}
        <button
          onClick={() => router.push("/orders")}
          className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-300 w-12 sm:w-13 h-10 sm:h-11 rounded-2xl relative active:scale-90 ${
            activeTab === "orders"
              ? "text-[#f7d6b5] bg-white/15 shadow-inner ring-1 ring-white/20"
              : "text-[#a8d3d5] hover:text-white"
          }`}
        >
          <FileText
            className={`w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform duration-300 ${
              activeTab === "orders" ? "scale-110 drop-shadow-[0_2px_10px_rgba(247,214,181,0.6)]" : ""
            }`}
          />
          <span
            className={`text-[8.5px] sm:text-[9px] tracking-tight transition-all duration-300 ${
              activeTab === "orders" ? "font-black opacity-100" : "font-bold opacity-75"
            }`}
          >
            طلباتي
          </span>
        </button>

        {/* 5. About Tab */}
        <button
          onClick={() => router.push("/about")}
          className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-300 w-12 sm:w-13 h-10 sm:h-11 rounded-2xl relative active:scale-90 ${
            activeTab === "about"
              ? "text-[#f7d6b5] bg-white/15 shadow-inner ring-1 ring-white/20"
              : "text-[#a8d3d5] hover:text-white"
          }`}
        >
          <Store
            className={`w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform duration-300 ${
              activeTab === "about" ? "scale-110 drop-shadow-[0_2px_10px_rgba(247,214,181,0.6)]" : ""
            }`}
          />
          <span
            className={`text-[8.5px] sm:text-[9px] tracking-tight transition-all duration-300 ${
              activeTab === "about" ? "font-black opacity-100" : "font-bold opacity-75"
            }`}
          >
            عن الكافي
          </span>
        </button>
      </nav>
    </div>
  );
}
