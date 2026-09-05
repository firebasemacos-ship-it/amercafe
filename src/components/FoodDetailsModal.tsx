"use client";

import { useApp } from "@/context/AppContext";
import { X, Heart, Star, Clock, Flame, Plus, Minus, ShoppingBag, FileText, Check } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FoodItem } from "@/data/foods";

function getSuggestedNotes(item: FoodItem) {
  const cat = (item.category || item.categoryName || "").toLowerCase();
  const name = (item.name || "").toLowerCase();

  // 1. المشروبات الساخنة (Hot Drinks)
  if (
    cat.includes("hot-drinks") ||
    cat.includes("ساخنة") ||
    cat.includes("قهوة") ||
    cat.includes("شاي") ||
    name.includes("مكياطة") ||
    name.includes("اسبريسو") ||
    name.includes("شاي") ||
    name.includes("كابتشينو") ||
    name.includes("نسكافي") ||
    name.includes("سنترا") ||
    name.includes("امريكانو") ||
    name.includes("هوت شوكلت")
  ) {
    return {
      label: "خيارات وملاحظات المشروب الساخن",
      placeholder: "مثال: بدون سكر، سكر زيادة، حليب قليل، رغوة كثيفة...",
      tags: ["بدون سكر", "سكر زيادة", "سكر وسط", "حليب قليل", "حليب زيادة", "سفري"],
    };
  }

  // 2. العصائر والمشروبات الباردة والآيس كوفي (Juices, Cold Drinks, Milkshakes)
  if (
    cat.includes("juice") ||
    cat.includes("عصائر") ||
    cat.includes("عصير") ||
    name.includes("مانجا") ||
    name.includes("جوافة") ||
    name.includes("فراولة") ||
    name.includes("أفوكادو") ||
    name.includes("ميلك شيك") ||
    name.includes("موخيتو") ||
    name.includes("آيس") ||
    name.includes("فروبي")
  ) {
    return {
      label: "خيارات وملاحظات المشروب البارد / العصير",
      placeholder: "مثال: بدون سكر، بدون ثلج، ثلج زيادة، كريمة إضافية...",
      tags: ["بدون سكر", "سكر خفيف", "بدون ثلج", "ثلج زيادة", "كريمة إضافية", "سفري"],
    };
  }

  // 3. السندوتشات (Sandwiches)
  if (
    cat.includes("sandwich") ||
    cat.includes("سندوتش") ||
    cat.includes("ساندوتش") ||
    name.includes("مفروم") ||
    name.includes("تن") ||
    name.includes("كبدة") ||
    name.includes("قلايا") ||
    name.includes("دحي")
  ) {
    return {
      label: "خيارات وملاحظات السندوتش",
      placeholder: "مثال: شطة زيادة، بدون حار، محمص، بدون بصل...",
      tags: ["شطة زيادة (حار)", "بدون شطة (بارد)", "محمص ومقرمش", "بدون بصل", "إضافة جبنة", "سفري"],
    };
  }

  // 4. البريوش (Brioche)
  if (cat.includes("brioche") || cat.includes("بريوش") || name.includes("بريوش")) {
    return {
      label: "خيارات وملاحظات البريوش",
      placeholder: "مثال: مسخن دافئ، زيادة نوتيلا، عسل إضافي...",
      tags: ["مسخن دافئ", "زيادة نوتيلا", "زيادة عسل", "مكسرات زيادة", "سفري"],
    };
  }

  // 5. الكريب والبان كيك والوافل (Crepes, Pancakes, Waffles)
  if (
    cat.includes("crepe") ||
    cat.includes("pancake") ||
    cat.includes("كريب") ||
    cat.includes("بان كيك") ||
    name.includes("وافل")
  ) {
    return {
      label: "خيارات وملاحظات الكريب والبان كيك",
      placeholder: "مثال: نوتيلا زيادة، مقرمش، صوص مكس، فواكه...",
      tags: ["نوتيلا زيادة", "مكسرات زيادة", "لوتس إضافي", "مقرمش كريسبي", "فواكه زيادة", "سفري"],
    };
  }

  // 6. الحلو (Sweets & Cookies)
  if (
    cat.includes("sweet") ||
    cat.includes("حلو") ||
    name.includes("تيراميسو") ||
    name.includes("بسبوسة") ||
    name.includes("كوكيز")
  ) {
    return {
      label: "خيارات وملاحظات الحلى",
      placeholder: "مثال: مسخن دافئ، صوص زيادة، بدون مكسرات...",
      tags: ["مسخن دافئ", "شوكولاتة زيادة", "بستاشيو زيادة", "بدون مكسرات", "سفري"],
    };
  }

  // Fallback generic
  return {
    label: "ملاحظات خاصة على الطلب",
    placeholder: "اكتب أي تفاصيل أو رغبات خاصة بالطلب...",
    tags: ["سفري", "طلب سريع", "بدون إضافات"],
  };
}

export default function FoodDetailsModal() {
  const { selectedFoodModal, setSelectedFoodModal, addToCart, isFavorite, toggleFavorite } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (selectedFoodModal) {
      setQuantity(1);
      setNotes("");
    }
  }, [selectedFoodModal]);

  if (!selectedFoodModal) return null;

  const item = selectedFoodModal;
  const isFav = isFavorite(item.id);
  const suggested = getSuggestedNotes(item);

  const toggleTag = (tag: string) => {
    setNotes((prev) => {
      const parts = prev
        .split("، ")
        .map((p) => p.trim())
        .filter(Boolean);

      if (parts.includes(tag)) {
        return parts.filter((p) => p !== tag).join("، ");
      } else {
        return [...parts, tag].join("، ");
      }
    });
  };

  const isTagActive = (tag: string) => {
    const parts = notes
      .split("، ")
      .map((p) => p.trim())
      .filter(Boolean);
    return parts.includes(tag);
  };

  const handleAdd = () => {
    addToCart(item, quantity, notes.trim() || undefined);
    setSelectedFoodModal(null);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Modal Card */}
      <div 
        className="w-full max-w-md glass-modal rounded-t-[32px] sm:rounded-[36px] overflow-hidden shadow-2xl max-h-[88dvh] sm:max-h-[90dvh] flex flex-col relative animate-in slide-in-from-bottom duration-300 border-t sm:border border-white/80"
        dir="rtl"
      >
        {/* Top Image Banner */}
        <div className="relative h-56 sm:h-64 w-full bg-gray-100 flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

          {/* Close & Favorite buttons */}
          <div className="absolute top-3 sm:top-4 start-3 sm:start-4 end-3 sm:end-4 flex items-center justify-between z-10">
            <button
              onClick={() => setSelectedFoodModal(null)}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:bg-white text-gray-800 transition active:scale-95 border border-white/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleFavorite(item.id)}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:bg-white transition active:scale-95 border border-white/60 cursor-pointer"
            >
              <Heart
                className={`w-4.5 h-4.5 sm:w-5 sm:h-5 transition-colors ${
                  isFav ? "text-red-500 fill-red-500 scale-110" : "text-gray-600"
                }`}
              />
            </button>
          </div>

          {/* Bottom Banner Title */}
          <div className="absolute bottom-3 sm:bottom-4 start-4 sm:start-6 end-4 sm:end-6 text-white">
            <span className="bg-[#187a7d]/90 text-[#f7d6b5] text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-md mb-1.5 inline-block border border-[#f7d6b5]/40 shadow-sm">
              {item.categoryName}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">{item.name}</h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3.5 sm:space-y-4 bg-[#f4f8f8]/60 backdrop-blur-sm">
          {/* Quick Metrics in Frosted Glass Card */}
          <div className="flex items-center justify-between glass-card p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm shadow-sm">
            <div className="flex items-center gap-1 sm:gap-1.5 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500" />
              <span>{item.rating}</span>
              <span className="text-[10px] sm:text-xs text-gray-400 font-normal">({item.reviewsCount}+)</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[#0f2b2d] font-medium">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#187a7d]" />
              <span>{item.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[#187a7d] font-medium">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{item.calories} سعرة</span>
            </div>
          </div>

          {/* Smart Dynamic Notes tailored to Item Type */}
          <div className="glass-card p-3 sm:p-3.5 rounded-2xl space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#0f2b2d] text-xs sm:text-sm flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#187a7d]" />
                <span>{suggested.label}</span>
              </h4>
              <span className="text-[10px] text-gray-400 font-medium">اختياري</span>
            </div>

            {/* Dynamic Quick Chips for this category */}
            <div className="flex flex-wrap gap-1.5">
              {suggested.tags.map((tag) => {
                const active = isTagActive(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-[10.5px] sm:text-xs px-2.5 py-1 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1 ${
                      active
                        ? "bg-[#187a7d] text-white font-bold shadow-sm ring-1 ring-[#187a7d]"
                        : "glass-pill text-gray-700 hover:text-[#187a7d] hover:bg-white"
                    }`}
                  >
                    {active && <Check className="w-3 h-3 text-[#f7d6b5]" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Notes Input with Category-Specific Placeholder */}
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={suggested.placeholder}
              className="w-full bg-white/80 border border-gray-200/80 rounded-xl px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#187a7d]/30 transition font-medium"
            />
          </div>

          {/* Quantity and Price */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200/60">
            <div>
              <span className="text-[11px] sm:text-xs text-gray-500 block font-medium">السعر الإجمالي</span>
              <span className="text-xl sm:text-2xl font-black text-[#187a7d]">
                {(item.price * quantity).toFixed(2)} د.ل
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2.5 sm:gap-3 glass-card px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center text-gray-800 shadow-sm active:scale-95 border border-gray-100 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <span className="font-black text-[#0f2b2d] w-4 text-center text-xs sm:text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#187a7d] text-white flex items-center justify-center shadow-sm active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-3.5 sm:p-4 bg-white/80 backdrop-blur-md border-t border-white/60 flex gap-3 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
          <button
            onClick={handleAdd}
            className="flex-1 bg-[#187a7d] hover:bg-[#136265] text-white py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#187a7d]/30 active:scale-[0.98] transition text-xs sm:text-sm cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#f7d6b5]" />
            <span>إضافة إلى سلة كافي عامر • {(item.price * quantity).toFixed(2)} د.ل</span>
          </button>
        </div>
      </div>
    </div>
  );
}
