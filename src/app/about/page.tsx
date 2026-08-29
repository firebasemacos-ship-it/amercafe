"use client";

import Link from "next/link";
import {
  ChevronRight,
  Phone,
  MapPin,
  Clock,
  Share2,
  ExternalLink,
  Sparkles,
  QrCode,
  Coffee,
} from "lucide-react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/SocialIcons";

export default function AboutPage() {
  const { showToast } = useApp();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "كافي عامر | Amer Cafe",
        text: "المنيو الإلكتروني وتفاصيل كافي عامر - طبرق، مفترق رابعة",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("تم نسخ رابط كافي عامر للمشاركة 📋");
    }
  };

  const socialLinks = [
    {
      name: "واتساب",
      icon: WhatsAppIcon,
      handle: "0924478000",
      href: "https://wa.me/218924478000",
      iconBg: "bg-[#25D366] text-white",
      cardStyle: "glass-card hover:border-emerald-300",
      textColor: "text-emerald-800",
    },
    {
      name: "فيسبوك",
      icon: FacebookIcon,
      handle: "كافي عامر - Amer Cafe",
      href: "https://www.facebook.com/share/14vTdfJRa9R/",
      iconBg: "bg-[#1877F2] text-white",
      cardStyle: "glass-card hover:border-blue-300",
      textColor: "text-blue-900",
    },
    {
      name: "إنستغرام",
      icon: InstagramIcon,
      handle: "@amerc.afe",
      href: "https://www.instagram.com/amerc.afe",
      iconBg: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white",
      cardStyle: "glass-card hover:border-pink-300",
      textColor: "text-pink-900",
    },
    {
      name: "تيك توك",
      icon: TikTokIcon,
      handle: "@kaf_e1",
      href: "https://www.tiktok.com/@kaf_e1",
      iconBg: "bg-[#010101] text-white",
      cardStyle: "glass-card hover:border-gray-400",
      textColor: "text-gray-900",
    },
  ];

  return (
    <div className="flex-1 bg-transparent overflow-y-auto pb-32 h-full scrollbar-hide">
      {/* Sticky Header */}
      <header className="px-4 sm:px-6 pt-7 sm:pt-10 pb-3 flex items-center justify-between sticky top-0 glass-header z-30">
        <Link
          href="/"
          className="w-9 h-9 sm:w-10 sm:h-10 glass-card rounded-2xl flex items-center justify-center text-[#187a7d] active:scale-95 transition"
          title="رجوع للرئيسية"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
        <h1 className="text-sm sm:text-base font-black text-[#0f2b2d] flex items-center gap-1.5">
          <span>معلومات كافي عامر</span>
          <span className="text-[9px] sm:text-[10px] bg-[#f7d6b5] text-[#0b3335] px-2 py-0.5 rounded-full font-bold shadow-xs border border-white/40">
            Since 2012
          </span>
        </h1>
        <button
          onClick={handleShare}
          className="w-9 h-9 sm:w-10 sm:h-10 glass-card rounded-2xl flex items-center justify-center text-[#187a7d] active:scale-95 transition"
          title="مشاركة"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </header>

      <div className="p-4 sm:p-6 space-y-4">
        {/* Official QR & Identity Card */}
        <div className="glass-card rounded-[32px] p-5 text-center relative overflow-hidden group">
          <div className="w-full h-64 relative rounded-2xl overflow-hidden mb-3 bg-white/50 backdrop-blur-sm border border-white/60">
            <Image
              src="/images/qr-info.png"
              alt="كافي عامر - Since 2012 ورمز QR"
              fill
              unoptimized
              className="object-contain p-2"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 glass-badge text-xs font-bold px-3.5 py-1 rounded-full shadow-xs">
            <QrCode className="w-3.5 h-3.5" />
            <span>امسح الـ QR للاطلاع على كل الروابط</span>
          </div>
        </div>

        {/* Quick Contact Buttons (Call & WhatsApp) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Direct Phone Call */}
          <a
            href="tel:0924478000"
            className="bg-[#187a7d]/95 hover:bg-[#136265] text-white p-4 rounded-3xl shadow-lg shadow-[#187a7d]/25 flex flex-col items-center justify-center gap-1.5 transition active:scale-95 text-center group border border-white/20"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-0.5 group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <span className="font-black text-xs text-[#f7d6b5]">اتصل مباشرة</span>
            <span className="font-mono font-bold text-xs tracking-wider" dir="ltr">
              092 447 8000
            </span>
          </a>

          {/* Direct WhatsApp Chat */}
          <a
            href="https://wa.me/218924478000"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366]/95 hover:bg-[#20b858] text-white p-4 rounded-3xl shadow-lg shadow-[#25D366]/25 flex flex-col items-center justify-center gap-1.5 transition active:scale-95 text-center group border border-white/20"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-0.5 group-hover:scale-110 transition-transform">
              <WhatsAppIcon className="w-5 h-5" />
            </div>
            <span className="font-black text-xs">تواصل واتساب</span>
            <span className="font-mono font-bold text-xs tracking-wider" dir="ltr">
              092 447 8000
            </span>
          </a>
        </div>

        {/* Location & Address Card */}
        <div className="glass-card rounded-3xl p-5 space-y-3">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#e4f2f2] text-[#187a7d] flex items-center justify-center flex-shrink-0 shadow-xs border border-white/60">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <span className="text-[11px] text-[#187a7d] font-bold block">موقع الفرع</span>
              <h3 className="font-black text-[#0f2b2d] text-sm mt-0.5">
                طبرق ، مفترق رابعة
              </h3>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed font-medium">
                موقع متميز في قلب مدينة طبرق، يتوفر به جلسات عائلية وشبابية راقية.
              </p>
            </div>
          </div>

          <a
            href="https://maps.app.goo.gl/cjMCijpL2f2PR1xZ8"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full glass-pill text-[#187a7d] py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition hover:bg-white"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>فتح الموقع في خرائط Google</span>
          </a>
        </div>

        {/* Working Hours Card */}
        <div className="glass-card rounded-3xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f7d6b5]/50 text-[#0b3335] flex items-center justify-center border border-[#f7d6b5]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-[#0f2b2d] text-xs block">ساعات العمل اليومية</span>
              <span className="text-[11px] text-gray-500 font-medium">من 7:00 صباحاً حتى 12:00 منتصف الليل</span>
            </div>
          </div>

          <span className="bg-emerald-50/90 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>مفتوح الآن</span>
          </span>
        </div>

        {/* Social Media Channels with Real App Icons */}
        <div className="glass-card rounded-3xl p-5 space-y-3">
          <h4 className="font-black text-[#0f2b2d] text-xs">قنوات التواصل الاجتماعي</h4>
          
          <div className="grid grid-cols-2 gap-2.5">
            {socialLinks.map((s, idx) => {
              const IconComponent = s.icon;
              return (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-2xl flex items-center gap-2.5 transition active:scale-95 shadow-xs ${s.cardStyle}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs ${s.iconBg}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`font-black text-xs block ${s.textColor}`}>{s.name}</span>
                    <span className="text-[10px] text-gray-500 truncate block font-medium" dir="ltr">
                      {s.handle}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Story / About Amer Cafe */}
        <div className="bg-gradient-to-br from-[#0b3335]/95 to-[#187a7d]/95 backdrop-blur-xl text-white rounded-3xl p-5 shadow-lg relative overflow-hidden border border-[#f7d6b5]/25">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-1.5 text-[#f7d6b5] text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>عن كافي عامر (Since 2012)</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              منذ عام 2012، نلتزم في <strong className="text-[#f7d6b5]">كافي عامر</strong> بتقديم أرقى أنواع القهوة المختصة المحمصة بعناية، مع تشكيلة يومية طازجة من المخبوزات والحلويات والوجبات السريعة لخدمة أهالي وزوار مدينة طبرق.
            </p>
          </div>
          <Coffee className="w-32 h-32 opacity-10 text-white select-none absolute -end-6 -bottom-6 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
