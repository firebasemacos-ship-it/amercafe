import React from "react";
import Image from "next/image";
import {
  Coffee,
  CakeSlice,
  UtensilsCrossed,
  Croissant,
  Pizza,
  Salad,
  CupSoda,
  Sparkles,
  Utensils,
  Cookie,
  Flame,
  GlassWater,
  Soup,
  Sandwich,
  IceCream,
  Milk,
  Beef,
  Fish,
} from "lucide-react";

interface CategoryIconProps {
  icon?: string;
  name?: string;
  id?: string;
  className?: string;
  textClassName?: string;
}

export function CategoryIcon({
  icon = "",
  name = "",
  id = "",
  className = "w-5 h-5",
}: CategoryIconProps) {
  // 1. If icon is an uploaded image / SVG URL
  const isImage =
    icon &&
    (icon.startsWith("http://") ||
      icon.startsWith("https://") ||
      icon.startsWith("/") ||
      icon.startsWith("data:"));

  if (isImage) {
    return (
      <div className={`relative overflow-hidden flex-shrink-0 flex items-center justify-center ${className}`}>
        <Image
          src={icon}
          alt={name || "أيقونة القسم"}
          fill
          unoptimized
          className="object-contain"
        />
      </div>
    );
  }

  // 2. Normalize key identifier for matching
  const key = `${id} ${icon} ${name}`.toLowerCase().trim();

  // 3. Map to Clean SVG Vector Icons
  if (key.includes("coffee") || key.includes("☕") || key.includes("قهوة") || key.includes("مشروبات ساخنة") || key.includes("لاتيه") || key.includes("كولد برو")) {
    return <Coffee className={className} />;
  }

  if (key.includes("dessert") || key.includes("🍰") || key.includes("حلويات") || key.includes("سويت") || key.includes("كيك") || key.includes("تشيز")) {
    return <CakeSlice className={className} />;
  }

  if (key.includes("cookie") || key.includes("🍪") || key.includes("بسكويت")) {
    return <Cookie className={className} />;
  }

  if (key.includes("pastry") || key.includes("🥐") || key.includes("مخبوزات") || key.includes("كرواسون") || key.includes("فطور")) {
    return <Croissant className={className} />;
  }

  if (key.includes("sandwich") || key.includes("🥪") || key.includes("ساندوتش") || key.includes("سندوتش")) {
    return <Sandwich className={className} />;
  }

  if (key.includes("burger") || key.includes("🍔") || key.includes("برجر")) {
    return <UtensilsCrossed className={className} />;
  }

  if (key.includes("pizza") || key.includes("🍕") || key.includes("بيتزا")) {
    return <Pizza className={className} />;
  }

  if (key.includes("salad") || key.includes("🥗") || key.includes("سلطات") || key.includes("صحي")) {
    return <Salad className={className} />;
  }

  if (key.includes("drink") || key.includes("🥤") || key.includes("🧋") || key.includes("مشروبات") || key.includes("باردة") || key.includes("موهيتو") || key.includes("عصير")) {
    return <CupSoda className={className} />;
  }

  if (key.includes("water") || key.includes("ماء") || key.includes("مياه")) {
    return <GlassWater className={className} />;
  }

  if (key.includes("ice") || key.includes("🍦") || key.includes("🍨") || key.includes("ايس")) {
    return <IceCream className={className} />;
  }

  if (key.includes("soup") || key.includes("شوربة") || key.includes("حساء")) {
    return <Soup className={className} />;
  }

  if (key.includes("sparkle") || key.includes("✨") || key.includes("all") || key.includes("الأكثر طلبا") || key.includes("الكل")) {
    return <Sparkles className={className} />;
  }

  if (key.includes("flame") || key.includes("🔥") || key.includes("حار") || key.includes("سبايسي")) {
    return <Flame className={className} />;
  }

  // Fallback Clean SVG
  return <Utensils className={className} />;
}
