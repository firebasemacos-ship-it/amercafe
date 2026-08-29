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

  const navItemsLeft = [
    { id: "home", icon: Home, label: "الرئيسية", path: "/" },
    { id: "search", icon: Search, label: "البحث", path: "/search" },
  ];

  const navItemsRight = [
    { id: "orders", icon: FileText, label: "طلباتي", path: "/orders" },
    { id: "about", icon: Store, label: "عن الكافي", path: "/about" },
  ];

  return (
    <div className="fixed bottom-4 inset-x-0 mx-auto max-w-md px-4 z-50 pointer-events-none transition-all duration-300">
      <nav className="pointer-events-auto glass-dock rounded-full px-3 py-2 flex items-center justify-between shadow-[0_20px_50px_rgba(11,51,53,0.5)] border border-white/25">
        {/* Left Navigation Tabs */}
        <div className="flex items-center gap-1">
          {navItemsLeft.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.path)}
                className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-300 w-13 h-11 rounded-2xl relative active:scale-90 ${
                  isActive
                    ? "text-[#f7d6b5] bg-white/15 shadow-inner ring-1 ring-white/20"
                    : "text-[#a8d3d5] hover:text-white"
                }`}
              >
                <tab.icon
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? "scale-110 drop-shadow-[0_2px_10px_rgba(247,214,181,0.6)]" : ""
                  }`}
                />
                <span
                  className={`text-[9px] tracking-tight transition-all duration-300 ${
                    isActive ? "font-black opacity-100" : "font-bold opacity-75"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Center Floating Cart Button */}
        <div className="relative -top-5 flex justify-center">
          <button
            onClick={() => router.push("/cart")}
            className={`w-13 h-13 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 relative ${
              activeTab === "cart"
                ? "bg-gradient-to-tr from-[#187a7d] to-[#0e4c4e] text-[#f7d6b5] ring-4 ring-[#f7d6b5]/50 shadow-[0_10px_25px_rgba(24,122,125,0.7)] scale-105"
                : "bg-gradient-to-tr from-[#f7d6b5] via-[#edd0b0] to-[#e4be93] text-[#0b3335] hover:scale-110 shadow-[0_12px_28px_rgba(247,214,181,0.5)] border-2 border-white/80"
            }`}
            title="سلة المشتريات"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -end-1 bg-[#187a7d] text-[#f7d6b5] text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse shadow-md">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Navigation Tabs */}
        <div className="flex items-center gap-1">
          {navItemsRight.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.path)}
                className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-300 w-13 h-11 rounded-2xl relative active:scale-90 ${
                  isActive
                    ? "text-[#f7d6b5] bg-white/15 shadow-inner ring-1 ring-white/20"
                    : "text-[#a8d3d5] hover:text-white"
                }`}
              >
                <tab.icon
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isActive ? "scale-110 drop-shadow-[0_2px_10px_rgba(247,214,181,0.6)]" : ""
                  }`}
                />
                <span
                  className={`text-[9px] tracking-tight transition-all duration-300 ${
                    isActive ? "font-black opacity-100" : "font-bold opacity-75"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
