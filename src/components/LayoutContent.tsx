"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Toast from "@/components/Toast";
import FoodDetailsModal from "@/components/FoodDetailsModal";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <div suppressHydrationWarning className="w-full min-h-screen bg-[#f4f8f8] text-gray-900 flex flex-col font-sans relative overflow-x-hidden">
        {/* Admin Ambient Light Orbs */}
        <div className="fixed top-0 start-1/4 w-96 h-96 bg-[#187a7d]/10 rounded-full blur-[100px] pointer-events-none -z-0"></div>
        <div className="fixed bottom-0 end-1/4 w-96 h-96 bg-[#f7d6b5]/20 rounded-full blur-[100px] pointer-events-none -z-0"></div>
        <Toast />
        <div className="relative z-10 w-full min-h-screen flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="mx-auto w-full max-w-md bg-[#f4f8f8] h-full relative shadow-2xl overflow-hidden flex flex-col font-sans">
      {/* Ambient Glassmorphic Light Mesh Orbs for mobile app */}
      <div className="absolute -top-20 -start-20 w-72 h-72 bg-[#187a7d]/20 rounded-full blur-[75px] pointer-events-none z-0"></div>
      <div className="absolute top-1/3 -end-24 w-64 h-64 bg-[#f7d6b5]/40 rounded-full blur-[80px] pointer-events-none z-0"></div>
      <div className="absolute bottom-28 -start-20 w-80 h-80 bg-[#187a7d]/15 rounded-full blur-[85px] pointer-events-none z-0"></div>
      <div className="absolute -bottom-20 -end-20 w-72 h-72 bg-[#f7d6b5]/30 rounded-full blur-[80px] pointer-events-none z-0"></div>

      <Toast />
      <FoodDetailsModal />
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
