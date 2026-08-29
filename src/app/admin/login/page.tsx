"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, User, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("amer_admin_auth", "true");
        router.push("/admin");
      } else {
        setError(data.message || "اسم المستخدم أو كلمة المرور غير صحيحة");
      }
    } catch {
      setError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b3335] via-[#104245] to-[#187a7d] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[36px] shadow-2xl p-8 border border-[#f7d6b5]/20 animate-in fade-in zoom-in-95">
        {/* Header with Amer Cafe Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#187a7d] p-1 shadow-lg border-2 border-[#f7d6b5]/40 mb-4 overflow-hidden">
            <Image
              src="/images/logo.png"
              alt="كافي عامر"
              width={80}
              height={80}
              unoptimized
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 bg-[#e4f2f2] text-[#187a7d] text-xs font-black px-3 py-1 rounded-full border border-[#187a7d]/20 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>لوحة تحكم الإدارة الرسمية</span>
          </div>
          <h1 className="text-xl font-black text-[#0f2b2d]">تسجيل دخول المدير</h1>
          <p className="text-gray-500 text-xs mt-1">كافي عامر • Since 2012</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-2xl text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0f2b2d] mb-1.5">
              اسم المستخدم
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full ps-10 pe-4 py-3 bg-[#f4f8f8] border border-[#187a7d]/20 rounded-2xl text-xs font-bold text-[#0f2b2d] focus:outline-none focus:border-[#187a7d] focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0f2b2d] mb-1.5">
              كلمة المرور
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full ps-10 pe-4 py-3 bg-[#f4f8f8] border border-[#187a7d]/20 rounded-2xl text-xs font-bold text-[#0f2b2d] focus:outline-none focus:border-[#187a7d] focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#187a7d] hover:bg-[#136265] text-white py-3.5 px-6 rounded-2xl font-black text-sm shadow-lg shadow-[#187a7d]/30 transition active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span>جاري التحقق...</span>
            ) : (
              <>
                <span>دخول لوحة التحكم</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-xs text-gray-500 hover:text-[#187a7d] font-bold transition"
          >
            ← العودة للمتجر الرئيسي
          </button>
        </div>
      </div>
    </div>
  );
}
